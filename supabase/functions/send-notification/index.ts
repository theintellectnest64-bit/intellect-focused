import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, skipping email notification");
      return new Response(JSON.stringify({ success: false, reason: "no_api_key" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { type, record_id } = body;

    if (!record_id || typeof record_id !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Missing record_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service-role key to verify the record actually exists in the database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let emailSubject: string;
    let emailHtml: string;

    if (type === "lead") {
      const { data: lead, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("id", record_id)
        .single();

      if (error || !lead) {
        return new Response(JSON.stringify({ success: false, error: "Record not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const eName = escapeHtml(lead.parent_name);
      const eEmail = escapeHtml(lead.parent_email);
      const ePhone = escapeHtml(lead.parent_phone);
      const eChildName = escapeHtml(lead.child_name);
      const eChildAge = escapeHtml(lead.child_age);
      const eCurrentLevel = escapeHtml(lead.current_level);
      const ePreferredLanguage = escapeHtml(lead.preferred_language);
      const eMessage = escapeHtml(lead.message);

      emailSubject = `New Lead — ${eName}`;
      emailHtml = `
        <h2>New Demo Booking</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Parent Name</td><td style="padding:8px;border-bottom:1px solid #eee">${eName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${eEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${ePhone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Child's Name</td><td style="padding:8px;border-bottom:1px solid #eee">${eChildName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Child's Age</td><td style="padding:8px;border-bottom:1px solid #eee">${eChildAge}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Current Level</td><td style="padding:8px;border-bottom:1px solid #eee">${eCurrentLevel}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Language</td><td style="padding:8px;border-bottom:1px solid #eee">${ePreferredLanguage}</td></tr>
          ${eMessage ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Message</td><td style="padding:8px;border-bottom:1px solid #eee">${eMessage}</td></tr>` : ""}
        </table>
      `;
    } else if (type === "contact") {
      const { data: contact, error } = await supabaseAdmin
        .from("contacts")
        .select("*")
        .eq("id", record_id)
        .single();

      if (error || !contact) {
        return new Response(JSON.stringify({ success: false, error: "Record not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const eName = escapeHtml(contact.name);
      const eEmail = escapeHtml(contact.email);
      const ePhone = escapeHtml(contact.phone);
      const eSubject = escapeHtml(contact.subject);
      const eMessage = escapeHtml(contact.message);

      emailSubject = `New Contact — ${eName}`;
      emailHtml = `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${eName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${eEmail}</td></tr>
          ${ePhone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${ePhone}</td></tr>` : ""}
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Subject</td><td style="padding:8px;border-bottom:1px solid #eee">${eSubject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Message</td><td style="padding:8px;border-bottom:1px solid #eee">${eMessage}</td></tr>
        </table>
      `;
    } else if (type === "application") {
      const { data: app, error } = await supabaseAdmin
        .from("applications")
        .select("*")
        .eq("id", record_id)
        .single();

      if (error || !app) {
        return new Response(JSON.stringify({ success: false, error: "Record not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const eName = escapeHtml(app.full_name);
      const eEmail = escapeHtml(app.email);
      const ePhone = escapeHtml(app.phone);
      const eRole = escapeHtml(app.role);
      const eLocation = escapeHtml(app.location);
      const eAbout = escapeHtml(app.about);
      const eExperience = escapeHtml(app.experience);
      const eResume = escapeHtml(app.resume_url);
      const eHeard = escapeHtml(app.heard_from);

      emailSubject = `New Job Application — ${eRole} — ${eName}`;
      emailHtml = `
        <h2>New Job Application</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Full Name</td><td style="padding:8px;border-bottom:1px solid #eee">${eName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${eEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Phone / WhatsApp</td><td style="padding:8px;border-bottom:1px solid #eee">${ePhone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Role</td><td style="padding:8px;border-bottom:1px solid #eee">${eRole}</td></tr>
          ${eLocation ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Location</td><td style="padding:8px;border-bottom:1px solid #eee">${eLocation}</td></tr>` : ""}
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">About</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${eAbout}</td></tr>
          ${eExperience ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">Experience</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${eExperience}</td></tr>` : ""}
          ${eResume ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Resume / CV</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="${eResume}">${eResume}</a></td></tr>` : ""}
          ${eHeard ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Heard From</td><td style="padding:8px;border-bottom:1px solid #eee">${eHeard}</td></tr>` : ""}
        </table>
      `;
    } else if (type === "enrollment") {
      const { data: enr, error } = await supabaseAdmin
        .from("enrollments")
        .select("*")
        .eq("id", record_id)
        .single();

      if (error || !enr) {
        return new Response(JSON.stringify({ success: false, error: "Record not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const row = (label: string, value: unknown) =>
        value
          ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">${label}</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(String(value))}</td></tr>`
          : "";

      emailSubject = `New Enrollment — ${escapeHtml(enr.registration_number)} — ${escapeHtml(enr.student_name)}`;
      emailHtml = `
        <h2>New Student Enrollment</h2>
        <table style="border-collapse:collapse;width:100%">
          ${row("Registration No.", enr.registration_number)}
          ${row("Plan", enr.plan)}
          ${row("Custom Plan Request", enr.custom_plan_note)}
          ${row("Rubik's Cube Add-on", enr.rubiks_addon ? "Yes" : "")}
          ${row("Student Name", enr.student_name)}
          ${row("Date of Birth", enr.student_dob)}
          ${row("Parent / Guardian", enr.parent_name)}
          ${row("Email", enr.email)}
          ${row("Primary Phone", enr.phone)}
          ${row("Guardian WhatsApp", enr.guardian_whatsapp)}
          ${row("Location", [enr.city, enr.state, enr.country].filter(Boolean).join(", "))}
          ${row("Student WhatsApp", enr.student_whatsapp)}
          ${row("Alternate Phone", enr.alternate_phone)}
          ${row("Chess.com / Lichess", enr.chess_id)}
          ${row("Time Zone", enr.preferred_timezone)}
          ${row("Preferred Coach", enr.preferred_coach)}
          ${row("Notes", enr.notes)}
          ${row("Student Counsellor", enr.student_counsellor)}
          ${row("Payment Type", enr.payment_type)}
          ${row("Balance To Be Paid", enr.balance_amount)}
          ${row("Payment Date", enr.payment_date)}
          ${row("Transaction ID / UTR", enr.transaction_id)}
          ${row("Payment Proof File", enr.payment_proof_url)}
          ${row("Payment Note", enr.payment_note)}
        </table>
        <p style="margin-top:16px;font-size:13px;color:#4A5568">View the payment proof in the admin panel at tinchess.com/admin.</p>
      `;
    } else {
      return new Response(JSON.stringify({ success: false, error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "The Intellect Nest <onboarding@resend.dev>",
        to: ["theintellectnest64@gmail.com"],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      console.error("Resend API error:", res.status);
      return new Response(JSON.stringify({ success: false, error: "Email delivery failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});