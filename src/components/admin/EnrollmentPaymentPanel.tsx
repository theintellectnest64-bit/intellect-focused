import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Receipt, Send, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Enrollment = Tables<"enrollments">;

export const PAYMENT_STATUS_OPTIONS = ["Pending Verification", "Paid / Verified", "Payment Failed"] as const;

interface Props {
  enrollment: Enrollment;
  onUpdated: (patch: Partial<Enrollment>) => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-secondary">{label}</label>
    {children}
  </div>
);

const EnrollmentPaymentPanel = ({ enrollment: e, onUpdated }: Props) => {
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    payment_status: e.payment_status ?? "Pending Verification",
    amount_paid: e.amount_paid != null ? String(e.amount_paid) : "",
    payment_method: e.payment_method ?? e.payment_type ?? "",
    assigned_coach: e.assigned_coach ?? "",
    class_schedule: e.class_schedule ?? "",
    sessions_total: e.sessions_total ?? "",
  });

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    const amount = form.amount_paid.trim() === "" ? null : Number(form.amount_paid);
    if (amount !== null && !isFinite(amount)) {
      setSaving(false);
      toast.error("Amount must be a number");
      return;
    }
    const patch = {
      payment_status: form.payment_status,
      amount_paid: amount,
      payment_method: form.payment_method.trim() || null,
      assigned_coach: form.assigned_coach.trim() || null,
      class_schedule: form.class_schedule.trim() || null,
      sessions_total: form.sessions_total.trim() || null,
      payment_verified_at:
        form.payment_status === "Paid / Verified"
          ? (e.payment_verified_at ?? new Date().toISOString())
          : null,
    };
    const { error } = await supabase.from("enrollments").update(patch).eq("id", e.id);
    setSaving(false);
    if (error) { toast.error("Could not save: " + error.message); return; }
    onUpdated(patch);
    toast.success("Payment details saved");
  };

  const sendConfirmation = async (resend = false) => {
    if (form.payment_status !== "Paid / Verified") {
      toast.error("Mark the payment as Paid / Verified and save first");
      return;
    }
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-enrollment-confirmation", {
      body: { enrollment_id: e.id, resend },
    });
    setSending(false);

    if (error) {
      toast.error("Email failed. Check the error saved on this enrollment.");
      onUpdated({ confirmation_email_status: "failed" });
      return;
    }
    const res = data as { success?: boolean; skipped?: boolean; error?: string; receipt_number?: string };
    if (!res?.success) { toast.error(res?.error ?? "Email failed"); return; }
    if (res.skipped) { toast.info("Confirmation was already sent for this enrollment"); return; }

    onUpdated({
      confirmation_email_status: "sent",
      confirmation_email_sent_at: new Date().toISOString(),
      receipt_number: res.receipt_number ?? null,
      confirmation_email_error: null,
    });
    toast.success(`Receipt ${res.receipt_number} emailed to the parent (CC office)`);
  };

  const emailStatus = e.confirmation_email_status ?? "not_sent";
  const verified = form.payment_status === "Paid / Verified";

  return (
    <div className="mt-4 rounded-lg border border-sky-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Receipt size={14} className="text-gold" />
        <h4 className="font-body text-xs font-semibold text-navy">Payment verification &amp; receipt</h4>
        <span className="ml-1 rounded-md bg-navy/5 px-2 py-0.5 font-body text-[11px] font-semibold text-navy">
          Internal ID: {e.registration_number}
        </span>
        {e.receipt_number && (
          <span className="rounded-md bg-gold/15 px-2 py-0.5 font-body text-[11px] font-semibold text-navy">
            Public Receipt Reference: {e.receipt_number}
          </span>
        )}
        {emailStatus === "sent" && (
          <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 font-body text-[11px] font-medium text-green-700">
            <CheckCircle2 size={11} /> Confirmation sent
          </span>
        )}
        {emailStatus === "failed" && (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 font-body text-[11px] font-medium text-red-700">
            <AlertTriangle size={11} /> Email failed — retry
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="Payment status">
          <Select value={form.payment_status} onValueChange={v => set("payment_status", v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Amount paid (₹)">
          <Input className="h-8 text-xs" inputMode="decimal" value={form.amount_paid} onChange={ev => set("amount_paid", ev.target.value)} placeholder="e.g. 4500" />
        </Field>
        <Field label="Payment method">
          <Input className="h-8 text-xs" value={form.payment_method} onChange={ev => set("payment_method", ev.target.value)} placeholder="UPI / Bank transfer" />
        </Field>
        <Field label="Coach">
          <Input className="h-8 text-xs" value={form.assigned_coach} onChange={ev => set("assigned_coach", ev.target.value)} placeholder={e.preferred_coach ?? ""} />
        </Field>
        <Field label="Class schedule">
          <Input className="h-8 text-xs" value={form.class_schedule} onChange={ev => set("class_schedule", ev.target.value)} placeholder="Mon & Thu, 6:00 PM IST" />
        </Field>
        <Field label="Sessions">
          <Input className="h-8 text-xs" value={form.sessions_total} onChange={ev => set("sessions_total", ev.target.value)} placeholder="12 sessions" />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Button size="sm" className="h-8 text-xs" onClick={save} disabled={saving}>
          <ShieldCheck size={13} className="mr-1" /> {saving ? "Saving..." : "Save payment details"}
        </Button>
        <Button
          size="sm"
          variant={emailStatus === "sent" ? "outline" : "default"}
          className="h-8 text-xs"
          onClick={() => sendConfirmation(emailStatus === "sent")}
          disabled={sending || !verified || e.payment_status !== "Paid / Verified"}
        >
          <Send size={13} className="mr-1" />
          {sending ? "Sending..." : emailStatus === "sent" ? "Resend receipt email" : "Send confirmation + receipt"}
        </Button>
        {e.payment_status !== "Paid / Verified" && (
          <span className="font-body text-[11px] text-muted-foreground">
            Save the status as “Paid / Verified” to enable sending.
          </span>
        )}
      </div>

      {e.confirmation_email_error && (
        <p className="mt-3 font-body text-[11px] text-red-600 break-words">
          Last error: {e.confirmation_email_error}
        </p>
      )}
      {e.confirmation_email_sent_at && (
        <p className="mt-2 font-body text-[10px] text-muted-foreground">
          Sent to {e.email} (CC theintellectnest64@gmail.com) on {new Date(e.confirmation_email_sent_at).toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
};

export default EnrollmentPaymentPanel;
