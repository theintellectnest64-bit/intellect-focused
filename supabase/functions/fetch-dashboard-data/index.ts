import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1GJsSRZnNnXw8Pnjbq_miERgYOBleKHWgnu5ttWuKC5k";

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

    // 3. Convert each tab to an array of objects keyed by header row
    const data: Record<string, Array<Record<string, string>>> = {};
    (valuesJson.valueRanges ?? []).forEach(
      (vr: { range: string; values?: string[][] }, idx: number) => {
        const tabName = tabs[idx];
        const rows = vr.values ?? [];
        if (rows.length === 0) {
          data[tabName] = [];
          return;
        }
        const headers = rows[0].map((h) => String(h ?? "").trim());
        data[tabName] = rows.slice(1).map((row) => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = (row[i] ?? "").toString();
          });
          return obj;
        });
      },
    );

    return new Response(
      JSON.stringify({ tabs, data, fetchedAt: new Date().toISOString() }),
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
