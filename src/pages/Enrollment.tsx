import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import AgePicker from "@/components/AgePicker";
import CountryCodePhone from "@/components/CountryCodePhone";

const loadSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

const WHATSAPP_URL =
  "https://wa.me/919893189566?text=Hi!%20I%20have%20just%20completed%20my%20enrollment%20with%20The%20Intellect%20Nest%20%F0%9F%95%8A%E2%99%9F";

const PLANS = [
  { id: "india-group", name: "India Group", price: "₹2,999/month", desc: "8 classes + weekly tournament, 4–6 students" },
  { id: "india-1on1", name: "India 1-on-1", price: "₹4,999/month", desc: "8 private sessions, fully personalised" },
  { id: "international-group", name: "International Group", price: "$49/month", desc: "8 classes + weekly tournament, 4–6 students" },
  { id: "international-1on1", name: "International 1-on-1", price: "$99/month", desc: "8 private sessions, fully personalised" },
  { id: "other", name: "Other / Customised Plan", price: "Let's talk", desc: "Tell us the arrangement you're looking for" },
];

const COACHES = ["Not sure — assign for me", "Sanyam Sir", "Prince Sir", "Parina Mam", "Adarsh Sir"];

const TIMEZONES = [
  "IST — India",
  "GST — Dubai / UAE",
  "GMT — London",
  "EST — New York",
  "CST — Chicago",
  "SGT — Singapore",
  "NZST — Auckland / Hamilton",
];

const STEPS = ["Plan", "Details", "Payment", "Confirm"];

const BORDER = "#DBEAFE";
const ACCENT = "#2B7DD4";
const NAVY = "#0D1E3B";
const GOLD = "#F5C518";

const Field = ({
  label,
  required,
  children,
  error,
}: { label: string; required?: boolean; children: React.ReactNode; error?: string }) => (
  <div>
    <label className="font-body text-[13px] mb-1.5 block" style={{ color: "#4A5568" }}>
      {label} {required && <span style={{ color: ACCENT }}>*</span>}
    </label>
    {children}
    {error && <p className="font-body text-xs text-destructive mt-1">{error}</p>}
  </div>
);

interface FormState {
  plan: string;
  custom_plan_note: string;
  rubiks_addon: boolean;
  student_name: string;
  student_dob: string;
  parent_name: string;
  email: string;
  phone: string;
  guardian_whatsapp: string;
  city: string;
  state: string;
  country: string;
  student_whatsapp: string;
  alternate_phone: string;
  chess_id: string;
  preferred_timezone: string;
  preferred_coach: string;
  notes: string;
  payment_type: string;
  balance_amount: string;
  payment_date: string;
  transaction_id: string;
  payment_note: string;
}

const initialForm: FormState = {
  plan: "",
  custom_plan_note: "",
  rubiks_addon: false,
  student_name: "",
  student_dob: "",
  parent_name: "",
  email: "",
  phone: "",
  guardian_whatsapp: "",
  city: "",
  state: "",
  country: "",
  student_whatsapp: "",
  alternate_phone: "",
  chess_id: "",
  preferred_timezone: "",
  preferred_coach: COACHES[0],
  notes: "",
  payment_type: "",
  balance_amount: "",
  payment_date: "",
  transaction_id: "",
  payment_note: "",
};

const Enrollment = () => {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneCode, setPhoneCode] = useState("+91|IN");
  const [waCode, setWaCode] = useState("+91|IN");
  const [studentWaCode, setStudentWaCode] = useState("+91|IN");
  const [quickAge, setQuickAge] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reg: string; plan: string; coach: string; amount: string } | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const p = params.get("plan");
    if (p && PLANS.some((x) => x.id === p)) set("plan", p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlan = useMemo(() => PLANS.find((p) => p.id === form.plan), [form.plan]);

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.plan) e.plan = "Please select a plan";
      if (form.plan === "other" && !form.custom_plan_note.trim()) e.custom_plan_note = "Please tell us what you're looking for";
    }
    if (s === 1) {
      if (form.student_name.trim().length < 2) e.student_name = "Student name is required";
      if (!form.student_dob) e.student_dob = "Date of birth is required";
      if (form.parent_name.trim().length < 2) e.parent_name = "Parent/guardian name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "A valid email is required";
      if (form.phone.trim().length < 6) e.phone = "Primary phone number is required";
      if (form.guardian_whatsapp.trim().length < 6) e.guardian_whatsapp = "Guardian's WhatsApp number is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.state.trim()) e.state = "State/Province is required";
      if (!form.country.trim()) e.country = "Country is required";
    }
    if (s === 2) {
      if (!form.payment_type) e.payment_type = "Please select a payment type";
      if (form.payment_type === "Partial Payment" && !form.balance_amount.trim())
        e.balance_amount = "Please enter the balance to be paid";
      if (!form.payment_date) e.payment_date = "Payment date is required";
      if (!form.transaction_id.trim()) e.transaction_id = "Transaction ID / UTR is required";
      if (!proofFile) e.proof = "Please upload your payment proof";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFile = (f: File | null) => {
    if (!f) { setProofFile(null); return; }
    const ok = ["image/jpeg", "image/png", "application/pdf"].includes(f.type);
    if (!ok) { toast.error("Only JPG, PNG or PDF files are allowed"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    setProofFile(f);
    setErrors((e) => ({ ...e, proof: "" }));
  };

  const submit = async () => {
    if (!agreed) { toast.error("Please accept the Terms & Conditions to continue"); return; }
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) { toast.error("Some details are missing"); return; }
    setSubmitting(true);
    try {
      const supabase = await loadSupabase();
      const recordId = crypto.randomUUID();
      const registration = `TIN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      let proofPath: string | null = null;
      if (proofFile) {
        const ext = proofFile.name.split(".").pop();
        const path = `${recordId}.${ext}`;
        const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, proofFile, {
          contentType: proofFile.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        proofPath = path;
      }

      const planLabel = selectedPlan ? `${selectedPlan.name} — ${selectedPlan.price}` : form.plan;

      const { error } = await supabase.from("enrollments").insert({
        id: recordId,
        registration_number: registration,
        plan: planLabel,
        custom_plan_note: form.plan === "other" ? form.custom_plan_note : null,
        rubiks_addon: form.rubiks_addon,
        student_name: form.student_name.trim(),
        student_dob: form.student_dob,
        parent_name: form.parent_name.trim(),
        email: form.email.trim(),
        phone: `${phoneCode.split("|")[0]} ${form.phone.trim()}`,
        guardian_whatsapp: `${waCode.split("|")[0]} ${form.guardian_whatsapp.trim()}`,
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        student_whatsapp: form.student_whatsapp.trim() ? `${studentWaCode.split("|")[0]} ${form.student_whatsapp.trim()}` : null,
        alternate_phone: form.alternate_phone.trim() || null,
        chess_id: form.chess_id.trim() || null,
        preferred_timezone: form.preferred_timezone || null,
        preferred_coach: form.preferred_coach,
        notes: form.notes.trim() || null,
        student_counsellor: "Harshit",
        payment_type: form.payment_type,
        balance_amount: form.payment_type === "Partial Payment" ? form.balance_amount.trim() : null,
        payment_date: form.payment_date,
        transaction_id: form.transaction_id.trim(),
        payment_proof_url: proofPath,
        payment_note: form.payment_note.trim() || null,
      });
      if (error) throw error;

      supabase.functions
        .invoke("send-notification", { body: { type: "enrollment", record_id: recordId } })
        .catch((err) => console.warn("Notification failed:", err));

      setDone({
        reg: registration,
        plan: planLabel,
        coach: form.preferred_coach,
        amount: form.payment_type === "Partial Payment" ? `Partial payment (balance: ${form.balance_amount})` : "Full payment",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Confirmation ── */
  if (done) {
    return (
      <div className="pt-[75px] min-h-screen" style={{ background: "#F0F6FF" }}>
        <Helmet><title>Enrollment Confirmed | The Intellect Nest</title><meta name="robots" content="noindex" /></Helmet>
        <div className="container mx-auto px-4 py-14 max-w-2xl">
          <div className="bg-white rounded-2xl p-8 md:p-10 text-center" style={{ border: `1px solid ${BORDER}` }}>
            <p className="font-body text-sm mb-2" style={{ color: "#4A5568" }}>Your Registration Number</p>
            <div
              className="inline-block rounded-xl px-6 py-4 mb-6"
              style={{ background: GOLD, color: NAVY }}
            >
              <span className="font-display text-3xl md:text-4xl font-bold tracking-wide">{done.reg}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: NAVY }}>
              Welcome to The Intellect Nest! 🕊♟
            </h1>
            <div className="rounded-xl p-5 text-left my-6" style={{ border: `1px solid ${BORDER}`, background: "#F0F6FF" }}>
              <p className="font-body text-sm mb-1" style={{ color: NAVY }}><strong>Plan:</strong> {done.plan}</p>
              <p className="font-body text-sm mb-1" style={{ color: NAVY }}><strong>Coach:</strong> {done.coach}</p>
              <p className="font-body text-sm" style={{ color: NAVY }}><strong>Payment:</strong> {done.amount}</p>
            </div>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "#4A5568" }}>
              Get lifetime free chess advice &amp; support — even after your course is completed. No charges, ever.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-body font-semibold"
              style={{ background: ACCENT, color: "#FFFFFF" }}
            >
              Continue on WhatsApp
            </a>
            <div className="mt-8 pt-6 font-body text-xs leading-relaxed" style={{ borderTop: `1px solid ${BORDER}`, color: "#4A5568" }}>
              <p>tinchess.com · +91 989 318 9566</p>
              <p className="italic mt-1">where knowledge takes flight</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <p className="font-body text-sm py-1" style={{ color: "#4A5568" }}>
        <span style={{ color: NAVY, fontWeight: 600 }}>{label}: </span>{value}
      </p>
    ) : null;

  return (
    <div className="pt-[75px] min-h-screen bg-white">
      <Helmet>
        <title>Student Enrollment | The Intellect Nest</title>
        <meta name="description" content="Complete your student registration with The Intellect Nest — plan selection, student details, payment and confirmation." />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <section className="py-10" style={{ background: "#F0F6FF", borderBottom: `1px solid ${BORDER}` }}>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-display text-[26px] md:text-[38px] font-bold mb-2" style={{ color: NAVY }}>
            Student Enrollment
          </h1>
          <p className="font-body text-sm md:text-base" style={{ color: "#4A5568" }}>
            The Intellect Nest registration desk · Counsellor: Harshit
          </p>
        </div>
      </section>

      {/* Stepper */}
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-semibold shrink-0"
                  style={{
                    background: i <= step ? ACCENT : "#F0F6FF",
                    color: i <= step ? "#FFFFFF" : "#4A5568",
                    border: `1px solid ${i <= step ? ACCENT : BORDER}`,
                  }}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </span>
                <span className="font-body text-xs md:text-sm hidden sm:inline" style={{ color: i <= step ? NAVY : "#4A5568" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="flex-1 h-px mx-2" style={{ background: i < step ? ACCENT : BORDER }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 md:p-8" style={{ border: `1px solid ${BORDER}` }}>
          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold" style={{ color: NAVY }}>Choose your plan</h2>
              <div className="space-y-3">
                {PLANS.map((p) => {
                  const active = form.plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => set("plan", p.id)}
                      className="w-full text-left rounded-xl p-4 transition-colors"
                      style={{
                        border: `1px solid ${active ? ACCENT : BORDER}`,
                        background: active ? "#F0F6FF" : "#FFFFFF",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-body font-semibold text-sm" style={{ color: NAVY }}>{p.name}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#4A5568" }}>{p.desc}</p>
                        </div>
                        <span className="font-display font-bold text-sm whitespace-nowrap" style={{ color: ACCENT }}>{p.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.plan && <p className="font-body text-xs text-destructive">{errors.plan}</p>}

              {form.plan === "other" && (
                <Field label="Tell us what you're looking for" required error={errors.custom_plan_note}>
                  <Textarea rows={4} value={form.custom_plan_note} onChange={(e) => set("custom_plan_note", e.target.value)} placeholder="Describe the schedule, format or arrangement you need" />
                </Field>
              )}

              <label className="flex items-start gap-3 rounded-xl p-4 cursor-pointer" style={{ border: `1px solid ${BORDER}` }}>
                <input
                  type="checkbox"
                  checked={form.rubiks_addon}
                  onChange={(e) => set("rubiks_addon", e.target.checked)}
                  className="mt-0.5"
                />
                <span className="font-body text-sm" style={{ color: NAVY }}>
                  Add Rubik's Cube add-on <span className="text-xs" style={{ color: "#4A5568" }}>(optional)</span>
                </span>
              </label>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold" style={{ color: NAVY }}>Student &amp; parent details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Student full name" required error={errors.student_name}>
                  <Input value={form.student_name} onChange={(e) => set("student_name", e.target.value)} placeholder="Student's full name" />
                </Field>
                <Field label="Student date of birth" required error={errors.student_dob}>
                  <Input type="date" value={form.student_dob} onChange={(e) => set("student_dob", e.target.value)} />
                </Field>
              </div>

              <AgePicker value={quickAge} onChange={setQuickAge} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Parent / Guardian full name" required error={errors.parent_name}>
                  <Input value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="Parent or guardian name" />
                </Field>
                <Field label="Email address" required error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                </Field>
              </div>

              <Field label="Primary phone number" required error={errors.phone}>
                <CountryCodePhone value={form.phone} onChange={(v) => set("phone", v)} countryCode={phoneCode} onCountryCodeChange={setPhoneCode} />
              </Field>

              <Field label="Guardian's WhatsApp number" required error={errors.guardian_whatsapp}>
                <CountryCodePhone value={form.guardian_whatsapp} onChange={(v) => set("guardian_whatsapp", v)} countryCode={waCode} onCountryCodeChange={setWaCode} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="City" required error={errors.city}>
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" />
                </Field>
                <Field label="State / Province" required error={errors.state}>
                  <Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="State or province" />
                </Field>
                <Field label="Country" required error={errors.country}>
                  <Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" />
                </Field>
              </div>

              <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }} />
              <p className="font-body text-xs" style={{ color: "#4A5568" }}>Optional details</p>

              <Field label="Student's own WhatsApp number (13+)">
                <CountryCodePhone value={form.student_whatsapp} onChange={(v) => set("student_whatsapp", v)} countryCode={studentWaCode} onCountryCodeChange={setStudentWaCode} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Alternate / secondary contact number">
                  <Input value={form.alternate_phone} onChange={(e) => set("alternate_phone", e.target.value)} placeholder="Alternate number" />
                </Field>
                <Field label="Chess.com or Lichess username">
                  <Input value={form.chess_id} onChange={(e) => set("chess_id", e.target.value)} placeholder="Username / ID" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Preferred time zone">
                  <Select value={form.preferred_timezone} onValueChange={(v) => set("preferred_timezone", v)}>
                    <SelectTrigger><SelectValue placeholder="Select time zone" /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Preferred coach">
                  <Select value={form.preferred_coach} onValueChange={(v) => set("preferred_coach", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COACHES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Additional notes">
                <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Scheduling constraints, prior experience, special requests..." />
              </Field>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold" style={{ color: NAVY }}>Payment</h2>




              <Field label="Amount paid" required error={errors.payment_type}>
                <div className="flex flex-wrap gap-3">
                  {["Full Payment", "Partial Payment"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("payment_type", t)}
                      className="rounded-lg px-4 py-2 font-body text-sm"
                      style={{
                        border: `1px solid ${form.payment_type === t ? ACCENT : BORDER}`,
                        background: form.payment_type === t ? "#F0F6FF" : "#FFFFFF",
                        color: NAVY,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              {form.payment_type === "Partial Payment" && (
                <Field label="Balance to be paid" required error={errors.balance_amount}>
                  <Input value={form.balance_amount} onChange={(e) => set("balance_amount", e.target.value)} placeholder="e.g. ₹1,500 by 15th" />
                </Field>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Payment date" required error={errors.payment_date}>
                  <Input type="date" value={form.payment_date} onChange={(e) => set("payment_date", e.target.value)} />
                </Field>
                <Field label="Transaction ID / UTR number" required error={errors.transaction_id}>
                  <Input value={form.transaction_id} onChange={(e) => set("transaction_id", e.target.value)} placeholder="Transaction reference" />
                </Field>
              </div>

              <Field label="Upload payment proof (JPG, PNG or PDF · max 5MB)" required error={errors.proof}>
                <label
                  className="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer"
                  style={{ border: `1px dashed ${BORDER}` }}
                >
                  <Upload size={16} style={{ color: ACCENT }} />
                  <span className="font-body text-sm" style={{ color: proofFile ? NAVY : "#4A5568" }}>
                    {proofFile ? proofFile.name : "Choose a file"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </Field>

              <Field label="Any payment-related note">
                <Textarea rows={2} value={form.payment_note} onChange={(e) => set("payment_note", e.target.value)} placeholder="e.g. paid via father's account" />
              </Field>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold" style={{ color: NAVY }}>Review &amp; confirm</h2>

              {[
                {
                  title: "Plan", stepIdx: 0, rows: (
                    <>
                      <Row label="Plan" value={selectedPlan ? `${selectedPlan.name} — ${selectedPlan.price}` : ""} />
                      <Row label="Custom request" value={form.plan === "other" ? form.custom_plan_note : ""} />
                      <Row label="Rubik's Cube add-on" value={form.rubiks_addon ? "Yes" : "No"} />
                    </>
                  ),
                },
                {
                  title: "Student & parent", stepIdx: 1, rows: (
                    <>
                      <Row label="Student" value={form.student_name} />
                      <Row label="Date of birth" value={form.student_dob} />
                      <Row label="Parent / Guardian" value={form.parent_name} />
                      <Row label="Email" value={form.email} />
                      <Row label="Primary phone" value={`${phoneCode.split("|")[0]} ${form.phone}`} />
                      <Row label="Guardian WhatsApp" value={`${waCode.split("|")[0]} ${form.guardian_whatsapp}`} />
                      <Row label="Location" value={[form.city, form.state, form.country].filter(Boolean).join(", ")} />
                      <Row label="Student WhatsApp" value={form.student_whatsapp ? `${studentWaCode.split("|")[0]} ${form.student_whatsapp}` : ""} />
                      <Row label="Alternate number" value={form.alternate_phone} />
                      <Row label="Chess.com / Lichess" value={form.chess_id} />
                      <Row label="Time zone" value={form.preferred_timezone} />
                      <Row label="Preferred coach" value={form.preferred_coach} />
                      <Row label="Notes" value={form.notes} />
                    </>
                  ),
                },
                {
                  title: "Payment", stepIdx: 2, rows: (
                    <>
                      <Row label="Amount paid" value={form.payment_type} />
                      <Row label="Balance to be paid" value={form.balance_amount} />
                      <Row label="Payment date" value={form.payment_date} />
                      <Row label="Transaction ID / UTR" value={form.transaction_id} />
                      <Row label="Proof" value={proofFile?.name} />
                      <Row label="Payment note" value={form.payment_note} />
                    </>
                  ),
                },
              ].map((sec) => (
                <div key={sec.title} className="rounded-xl p-5" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base font-bold" style={{ color: NAVY }}>{sec.title}</h3>
                    <button type="button" onClick={() => goTo(sec.stepIdx)} className="font-body text-xs underline" style={{ color: ACCENT }}>
                      Edit
                    </button>
                  </div>
                  {sec.rows}
                </div>
              ))}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
                <span className="font-body text-sm" style={{ color: "#4A5568" }}>
                  I agree to The Intellect Nest's{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: ACCENT }}>Terms &amp; Conditions</a>{" "}
                  and{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: ACCENT }}>Privacy Policy</a>.
                </span>
              </label>

              <Button
                type="button"
                onClick={submit}
                disabled={submitting || !agreed}
                className="w-full py-6 font-body font-semibold text-base hover:opacity-90"
                style={{ background: GOLD, color: NAVY }}
              >
                {submitting ? "Submitting..." : "Confirm Enrollment"}
              </Button>
            </div>
          )}

          {/* Nav */}
          {step < 3 && (
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
              <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
              <Button type="button" onClick={next} style={{ background: ACCENT, color: "#FFFFFF" }}>
                Continue <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="mt-6">
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
