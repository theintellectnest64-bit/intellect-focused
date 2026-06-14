import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1GJsSRZnNnXw8Pnjbq_miERgYOBleKHWgnu5ttWuKC5k";

const DASHBOARD_RANGES = [
  { tab: "Payments", range: "Payments!A4:J503" },
  { tab: "Expenses", range: "Expenses!A4:G403" },
  { tab: "Coaches", range: "Coaches!A4:I203" },
  { tab: "Students", range: "Students!A4:M103" },
  { tab: "Ads", range: "Ads!A4:N203" },
] as const;

const FIXED_COLUMNS: Record<string, Record<number, string>> = {
  Payments: { 2: "Month", 5: "Received" },
  Expenses: { 1: "Month", 2: "Category", 4: "Amount" },
  Coaches: { 1: "Month", 6: "Actual Pay" },
  Students: { 11: "Status" },
};

const columnLetter = (index: number) => {
  let n = index + 1;
  let letter = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

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

const rowsToObjects = (tab: string, rows: string[][]) => {
  if (!rows.length) return { rows: [], headerRow: 0, headers: [] as string[] };
  const firstRowLooksLikeHeader = rowScore(rows[0]) >= 20;
  const headers = firstRowLooksLikeHeader ? rows[0].map((h) => String(h ?? "").trim()) : [];
  const objects = rows.slice(firstRowLooksLikeHeader ? 1 : 0).map((row) => {
    const obj: Record<string, string> = {};
    const maxColumns = Math.max(row.length, headers.length);
    for (let i = 0; i < maxColumns; i += 1) {
      const value = (row[i] ?? "").toString();
      const letter = columnLetter(i);
      obj[letter] = value;
      obj[`Column ${letter}`] = value;
      const header = headers[i];
      if (header) obj[header] = value;
      const fixedName = FIXED_COLUMNS[tab]?.[i];
      if (fixedName) obj[fixedName] = value;
    }
    return obj;
  }).filter((obj) => Object.values(obj).some((value) => String(value).trim() !== ""));
  return { rows: objects, headerRow: firstRowLooksLikeHeader ? 4 : 0, headers };
};
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
