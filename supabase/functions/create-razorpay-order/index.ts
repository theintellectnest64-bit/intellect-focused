import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Server-side price list (paise) — never trust amounts from the browser.
const PLAN_AMOUNTS: Record<string, number> = {
  "india-group": 299900,
  "india-1on1": 499900,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) return json({ error: "Payment gateway not configured" }, 500);

  let body: { plan?: string };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const plan = typeof body.plan === "string" ? body.plan : "";
  const amount = PLAN_AMOUNTS[plan];
  if (!amount) return json({ error: "Online payment is not available for this plan" }, 400);
  if (amount < 100) return json({ error: "Amount must be at least 100 paise" }, 400);

  const receipt = `tin_${Date.now()}`.slice(0, 40);
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${keyId}:${keySecret}`),
    },
    body: JSON.stringify({ amount, currency: "INR", receipt, notes: { plan } }),
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) return json({ error: "Payment gateway authentication failed" }, 401);
  if (!res.ok) {
    console.error("Razorpay order error", res.status, data);
    return json({ error: data?.error?.description ?? "Could not create order" }, 500);
  }

  return json({ order_id: data.id, amount: data.amount, currency: data.currency, key_id: keyId });
});
