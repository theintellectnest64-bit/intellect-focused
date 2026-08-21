import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildReceiptPdf } from "./receipt-pdf.ts";
import { buildEmailHtml } from "./email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CC_EMAIL = "theintellectnest64@gmail.com";
const PAID = "Paid / Verified";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const fmtDate = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtAmount = (value: unknown) => {
  const n = Number(value);
  if (!isFinite(n) || n <= 0) return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const toBase64 = (bytes: Uint8Array) => {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  let enrollmentId: string | undefined;

  try {
    // ---- Auth: admin only ----
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ success: false, error: "Unauthorized" }, 401);

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ success: false, error: "Unauthorized" }, 401);

    const { data: isAdmin } = await userClient.rpc("is_admin", { _user_id: userData.user.id });
    if (!isAdmin) return json({ success: false, error: "Forbidden" }, 403);

    // ---- Input ----
    const body = await req.json().catch(() => ({}));
    enrollmentId = body?.enrollment_id;
    const resend = Boolean(body?.resend);
    if (!enrollmentId || typeof enrollmentId !== "string") {
      return json({ success: false, error: "Missing enrollment_id" }, 400);
    }

    const { data: enr, error: enrErr } = await admin
      .from("enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();

    if (enrErr || !enr) return json({ success: false, error: "Enrollment not found" }, 404);

    // ---- Payment gate ----
    if (enr.payment_status !== PAID) {
      return json(
        { success: false, error: "Payment is not verified yet. Mark it as Paid / Verified first.", code: "payment_not_verified" },
        409,
      );
    }

    // ---- Idempotency ----
    if (enr.confirmation_email_status === "sent" && !resend) {
      return json({ success: true, skipped: true, reason: "already_sent", receipt_number: enr.receipt_number });
    }

    if (!enr.email) return json({ success: false, error: "Enrollment has no parent email" }, 400);

    // ---- Receipt number (atomic, never duplicated) ----
    const { data: receiptNumber, error: rnErr } = await admin.rpc("assign_receipt_number", {
      _enrollment_id: enrollmentId,
    });
    if (rnErr || !receiptNumber) throw new Error(`Could not assign receipt number: ${rnErr?.message}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const amount = fmtAmount(enr.amount_paid);
    const paymentMethod = enr.payment_method || enr.payment_type || "UPI";
    const paymentDate = fmtDate(enr.payment_date) || fmtDate(enr.created_at);
    const enrollmentDate = fmtDate(enr.created_at);
    const coach = enr.assigned_coach || enr.preferred_coach || null;
    const sessions = enr.sessions_total || null;
    const schedule = enr.class_schedule || null;
    const balance = enr.balance_amount ? String(enr.balance_amount) : null;

    const shared = {
      studentName: enr.student_name,
      parentName: enr.parent_name,
      plan: enr.plan + (enr.rubiks_addon ? " + Rubik's Cube add-on" : ""),
      coach,
      schedule,
      sessions,
      enrollmentDate,
      registrationNumber: enr.registration_number,
      amount: amount || "—",
      paymentStatus: "Paid / Verified",
      paymentReference: enr.transaction_id || "—",
      receiptNumber: receiptNumber as string,
      paymentDate,
      paymentMethod,
      balance,
    };

    const html = buildEmailHtml(shared);

    const pdfBytes = await buildReceiptPdf({
      ...shared,
      parentEmail: enr.email,
      parentPhone: enr.phone || enr.guardian_whatsapp || "",
    });

    // ---- Send ----
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "The Intellect Nest <admissions@tinchess.com>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [enr.email],
        cc: [CC_EMAIL],
        reply_to: CC_EMAIL,
        subject: `Enrollment Confirmed — ${enr.student_name} | The Intellect Nest`,
        html,
        attachments: [
          {
            filename: `Receipt-${receiptNumber}.pdf`,
            content: toBase64(pdfBytes),
          },
        ],
      }),
    });

    const resBody = await res.text();
    if (!res.ok) {
      console.error(`Resend failed [${res.status}]: ${resBody}`);
      await admin
        .from("enrollments")
        .update({
          confirmation_email_status: "failed",
          confirmation_email_error: `[${res.status}] ${resBody}`.slice(0, 1000),
          confirmation_email_attempts: (enr.confirmation_email_attempts ?? 0) + 1,
        })
        .eq("id", enrollmentId);
      return json({ success: false, error: "Email delivery failed", details: resBody }, 502);
    }

    await admin
      .from("enrollments")
      .update({
        confirmation_email_status: "sent",
        confirmation_email_sent_at: new Date().toISOString(),
        confirmation_email_error: null,
        confirmation_email_attempts: (enr.confirmation_email_attempts ?? 0) + 1,
      })
      .eq("id", enrollmentId);

    return json({ success: true, receipt_number: receiptNumber, sent_to: enr.email, cc: CC_EMAIL });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("send-enrollment-confirmation error:", message);
    if (enrollmentId) {
      await admin
        .from("enrollments")
        .update({
          confirmation_email_status: "failed",
          confirmation_email_error: message.slice(0, 1000),
        })
        .eq("id", enrollmentId);
    }
    return json({ success: false, error: message }, 500);
  }
});
