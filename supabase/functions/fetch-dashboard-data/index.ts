import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1GJsSRZnNnXw8Pnjbq_miERgYOBleKHWgnu5ttWuKC5k";

const CANONICAL_TABS = ["Payments", "Expenses", "Coaches", "Ads", "Students"];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const canonicalTabName = (tabName: string) => {
  const n = normalize(tabName);
  if (/payment|revenue|fee|invoice|collection/.test(n)) return "Payments";
  if (/expense|cost|spend|outflow/.test(n) && !/ad|ads|meta|facebook|instagram/.test(n)) return "Expenses";
  if (/coach|teacher|trainer|payroll|salary/.test(n)) return "Coaches";
  if (/ad|ads|meta|facebook|instagram|campaign|lead|funnel|marketing/.test(n)) return "Ads";
  if (/student|learner|kid|child|enrol|enroll|active/.test(n)) return "Students";
  return tabName;
};

const HEADER_HINTS = [
  "month", "student", "name", "received", "amount", "status", "category", "coach", "actual",
  "pay", "classes", "spend", "leads", "demo", "conversion", "fee", "package", "type",
];

const rowScore = (row: string[]) => {
  const cells = row.map((cell) => String(cell ?? "").trim()).filter(Boolean);
  const hintMatches = cells.filter((cell) => HEADER_HINTS.some((hint) => normalize(cell).includes(hint))).length;
  return hintMatches * 10 + Math.min(cells.length, 12);
};

const findHeaderIndex = (rows: string[][]) => {
  let bestIndex = 0;
  let bestScore = -1;
  rows.slice(0, 20).forEach((row, index) => {
    const score = rowScore(row);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
};

const rowsToObjects = (rows: string[][]) => {
  if (!rows.length) return { rows: [], headerRow: 0, headers: [] as string[] };
  const headerRow = findHeaderIndex(rows);
  const headers = rows[headerRow].map((h, i) => String(h ?? "").trim() || `Column ${i + 1}`);
  const objects = rows.slice(headerRow + 1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (row[i] ?? "").toString();
    });
    return obj;
  }).filter((obj) => Object.values(obj).some((value) => String(value).trim() !== ""));
  return { rows: objects, headerRow, headers };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_SHEETS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify caller is logged-in admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin", {
      _user_id: claims.claims.sub,
    });
    if (adminErr || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Get sheet metadata (tab names)
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${apiKey}&fields=sheets.properties.title`,
    );
    if (!metaRes.ok) {
      const txt = await metaRes.text();
      console.error("Sheets metadata error:", metaRes.status, txt);
      return new Response(
        JSON.stringify({ error: "Failed to load sheet metadata", detail: txt }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const meta = await metaRes.json();
    const tabs: string[] = (meta.sheets ?? []).map(
      (s: { properties: { title: string } }) => s.properties.title,
    );

    // 2. Batch-get values for every tab
    const ranges = tabs.map((t) => `ranges=${encodeURIComponent(`'${t}'!A1:ZZ10000`)}`).join("&");
    const valuesRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?${ranges}&key=${apiKey}`,
    );
    if (!valuesRes.ok) {
      const txt = await valuesRes.text();
      console.error("Sheets batchGet error:", valuesRes.status, txt);
      return new Response(
        JSON.stringify({ error: "Failed to load sheet values", detail: txt }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const valuesJson = await valuesRes.json();

    // 3. Convert tabs to canonical dashboard datasets, even if sheet tab names vary.
    const data: Record<string, Array<Record<string, string>>> = {};
    CANONICAL_TABS.forEach((tab) => {
      data[tab] = [];
    });
    const diagnostics: Array<{ tab: string; canonical: string; rows: number; headerRow: number; headers: string[] }> = [];
    (valuesJson.valueRanges ?? []).forEach(
      (vr: { range: string; values?: string[][] }, idx: number) => {
        const tabName = tabs[idx];
        const rows = vr.values ?? [];
        const canonical = canonicalTabName(tabName);
        const converted = rowsToObjects(rows);
        data[canonical] = [...(data[canonical] ?? []), ...converted.rows];
        if (canonical !== tabName) data[tabName] = converted.rows;
        diagnostics.push({ tab: tabName, canonical, rows: converted.rows.length, headerRow: converted.headerRow + 1, headers: converted.headers });
      },
    );
    console.info("dashboard sync diagnostics", JSON.stringify(diagnostics.map((d) => ({ tab: d.tab, canonical: d.canonical, rows: d.rows, headerRow: d.headerRow }))));

    return new Response(
      JSON.stringify({ tabs: CANONICAL_TABS, rawTabs: tabs, data, diagnostics, fetchedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("fetch-dashboard-data error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
