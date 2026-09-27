import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { CURRENCY_DECIMALS } from "../_shared/currencies.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { amount?: unknown; currency?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "";
  const decimals = CURRENCY_DECIMALS[currency];
  if (decimals === undefined) return json({ error: "Please select a supported currency." }, 400);

  const raw = typeof body.amount === "number" ? String(body.amount) : typeof body.amount === "string" ? body.amount.trim() : "";
  const re = decimals === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`);
  if (!raw || !re.test(raw)) return json({ error: "Please enter a valid amount." }, 400);

  const [whole, frac = ""] = raw.split(".");
  const units = Number(whole + frac.padEnd(decimals, "0"));
  if (!Number.isSafeInteger(units) || units <= 0) return json({ error: "Please enter a valid amount." }, 400);
  if (units < 100) return json({ error: "Amount is below the minimum allowed." }, 400);
  if (units > 100_000_000_00) return json({ error: "Amount is too large." }, 400);

  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) return json({ error: "Payments are temporarily unavailable." }, 500);

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${keyId}:${keySecret}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: units, currency, receipt: `pay_${Date.now()}` }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Razorpay order error", res.status, data?.error?.code, data?.error?.description);
      if (res.status === 401) return json({ error: "Payments are temporarily unavailable." }, 502);
      const desc = String(data?.error?.description ?? "");
      if (/currency/i.test(desc)) return json({ error: `${currency} payments are not available right now. Please choose another currency.` }, 400);
      if (res.status === 400) return json({ error: desc || "This payment could not be created." }, 400);
      return json({ error: "Could not start the payment. Please try again." }, 502);
    }
    return json({ order_id: data.id, amount: data.amount, currency: data.currency, key_id: keyId });
  } catch (e) {
    console.error("Razorpay network error", e instanceof Error ? e.message : e);
    return json({ error: "Could not start the payment. Please try again." }, 502);
  }
});
