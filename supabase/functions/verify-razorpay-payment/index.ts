import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const safeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ verified: false, error: "Invalid request." }, 400);
  }
  const paymentId = b.razorpay_payment_id, orderId = b.razorpay_order_id, signature = b.razorpay_signature;
  if (typeof paymentId !== "string" || typeof orderId !== "string" || typeof signature !== "string" || !paymentId || !orderId || !signature) {
    return json({ verified: false, error: "Missing payment details." }, 400);
  }

  const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!secret) return json({ verified: false, error: "Verification unavailable." }, 500);

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${orderId}|${paymentId}`));
  const expected = Array.from(new Uint8Array(sig)).map((x) => x.toString(16).padStart(2, "0")).join("");

  if (!safeEqual(expected, signature)) return json({ verified: false, error: "Invalid signature." }, 400);
  return json({ verified: true, payment_id: paymentId, order_id: orderId });
});
