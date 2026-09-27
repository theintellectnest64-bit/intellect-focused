import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

declare global {
  interface Window { Razorpay?: any }
}

const loadScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

interface Props {
  plan: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (paymentId: string, orderId: string) => void;
}

const RazorpayButton = ({ plan, prefill, onSuccess }: Props) => {
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      if (!(await loadScript())) throw new Error("Could not load payment window. Check your connection.");
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", { body: { plan } });
      if (error || !data?.order_id) throw new Error(data?.error ?? "Could not start payment. Please try again.");

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || data.key_id,
        order_id: data.order_id,
        amount: data.amount,
        currency: data.currency,
        name: "The Intellect Nest",
        description: "Chess coaching enrollment",
        prefill,
        theme: { color: "#2B7DD4" },
        handler: async (resp: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const { data: v, error: vErr } = await supabase.functions.invoke("verify-razorpay-payment", { body: resp });
          if (vErr || !v?.success) {
            toast.error("Payment could not be verified. Please contact us with your payment ID: " + resp.razorpay_payment_id);
            return;
          }
          toast.success("Payment successful!");
          onSuccess(resp.razorpay_payment_id, resp.razorpay_order_id);
        },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      });
      rzp.on("payment.failed", (r: any) => toast.error(r?.error?.description ?? "Payment failed. Please try again."));
      rzp.open();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" onClick={pay} disabled={busy} className="w-full sm:w-auto">
      {busy ? "Opening payment…" : "Pay online (Card / UPI / Netbanking)"}
    </Button>
  );
};

export default RazorpayButton;
