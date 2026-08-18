export interface EmailData {
  studentName: string;
  parentName: string;
  plan: string;
  coach?: string | null;
  schedule?: string | null;
  sessions?: string | null;
  enrollmentDate: string;
  registrationNumber: string;
  amount: string;
  paymentStatus: string;
  paymentReference: string;
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: string;
  balance?: string | null;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const NAVY = "#0D1E3B";
const SKY = "#2B7DD4";
const GOLD = "#F5C518";
const BODY = "#4A5568";
const BORDER = "#E3EAF3";
const SOFT = "#F5F9FF";

const row = (label: string, value?: string | null) =>
  value
    ? `<tr>
        <td style="padding:9px 0;font:600 12px/1.4 Arial,Helvetica,sans-serif;color:${BODY};letter-spacing:.4px;text-transform:uppercase;width:44%;vertical-align:top;">${esc(label)}</td>
        <td style="padding:9px 0;font:400 15px/1.5 Georgia,'Times New Roman',serif;color:${NAVY};text-align:right;vertical-align:top;">${esc(value)}</td>
      </tr>`
    : "";

export function buildEmailHtml(d: EmailData): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Enrollment Confirmed — The Intellect Nest</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Enrollment confirmed for ${esc(d.studentName)} — receipt ${esc(d.receiptNumber)} attached.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid ${BORDER};border-radius:14px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:${NAVY};padding:34px 32px 28px;text-align:center;">
    <div style="font:700 22px/1.2 Georgia,'Times New Roman',serif;color:#ffffff;letter-spacing:1.5px;">THE INTELLECT NEST</div>
    <div style="height:2px;width:56px;background:${GOLD};margin:12px auto;"></div>
    <div style="font:italic 400 13px/1.4 Georgia,serif;color:${GOLD};letter-spacing:.6px;">Where Knowledge Takes Flight</div>
  </td></tr>
  <tr><td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Welcome -->
  <tr><td style="padding:34px 32px 8px;">
    <div style="font:600 11px/1.4 Arial,sans-serif;color:${SKY};letter-spacing:2px;text-transform:uppercase;">Admission Confirmed</div>
    <h1 style="margin:10px 0 14px;font:700 27px/1.25 Georgia,'Times New Roman',serif;color:${NAVY};">Welcome, ${esc(d.studentName)}</h1>
    <p style="margin:0 0 14px;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:${BODY};">Dear ${esc(d.parentName)},</p>
    <p style="margin:0 0 14px;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:${BODY};">
      We are delighted to welcome <strong style="color:${NAVY};">${esc(d.studentName)}</strong> to The Intellect Nest.
      Your payment has been received and verified, and the enrollment is now officially confirmed.
      We are looking forward to beginning this journey with your family.
    </p>
  </td></tr>

  <!-- Enrollment details -->
  <tr><td style="padding:18px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border:1px solid ${BORDER};border-radius:12px;">
      <tr><td style="padding:22px 22px 6px;">
        <div style="font:700 12px/1.4 Arial,sans-serif;color:${NAVY};letter-spacing:1.6px;text-transform:uppercase;">Enrollment Details</div>
        <div style="height:2px;width:38px;background:${GOLD};margin:10px 0 4px;"></div>
      </td></tr>
      <tr><td style="padding:0 22px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Student", d.studentName)}
          ${row("Parent / Guardian", d.parentName)}
          ${row("Program", d.plan)}
          ${row("Coach", d.coach)}
          ${row("Schedule", d.schedule)}
          ${row("Sessions", d.sessions)}
          ${row("Registration No.", d.registrationNumber)}
          ${row("Enrollment Date", d.enrollmentDate)}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Payment receipt -->
  <tr><td style="padding:18px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;">
      <tr><td style="padding:22px 22px 6px;">
        <div style="font:700 12px/1.4 Arial,sans-serif;color:${NAVY};letter-spacing:1.6px;text-transform:uppercase;">Payment Receipt</div>
        <div style="height:2px;width:38px;background:${GOLD};margin:10px 0 4px;"></div>
      </td></tr>
      <tr><td style="padding:0 22px 4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Receipt No.", d.receiptNumber)}
          ${row("Payment Date", d.paymentDate)}
          ${row("Payment Method", d.paymentMethod)}
          ${row("Payment Reference", d.paymentReference)}
          ${row("Balance Due", d.balance)}
        </table>
      </td></tr>
      <tr><td style="padding:14px 22px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border-radius:10px;">
          <tr>
            <td style="padding:16px 18px;">
              <div style="font:600 10px/1.4 Arial,sans-serif;color:${GOLD};letter-spacing:1.6px;text-transform:uppercase;">Amount Paid</div>
              <div style="font:700 24px/1.3 Georgia,serif;color:#ffffff;margin-top:4px;">&#8377;${esc(d.amount)}</div>
            </td>
            <td style="padding:16px 18px;text-align:right;">
              <span style="display:inline-block;background:#E8F7EE;color:#166534;font:700 11px/1 Arial,sans-serif;letter-spacing:1.2px;padding:9px 14px;border-radius:999px;text-transform:uppercase;">${esc(d.paymentStatus)}</span>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font:400 13px/1.6 Arial,sans-serif;color:${BODY};">A detailed fee receipt (PDF) is attached to this email for your records.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Next steps -->
  <tr><td style="padding:26px 32px 0;">
    <div style="font:700 12px/1.4 Arial,sans-serif;color:${NAVY};letter-spacing:1.6px;text-transform:uppercase;">Next Steps</div>
    <div style="height:2px;width:38px;background:${GOLD};margin:10px 0 14px;"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${[
        "Our academic coordinator will contact you on WhatsApp within 24 hours to confirm the class timings.",
        "You will receive the Zoom class link before the first session — please save it.",
        "Ensure a quiet space, a stable internet connection, and a laptop or tablet for the class.",
        "Create a free Chess.com or Lichess account for practice assignments, if not already done.",
        "Keep this receipt safe; it is your official proof of payment.",
      ]
        .map(
          (t, i) => `<tr>
            <td width="30" style="padding:0 0 12px;vertical-align:top;">
              <div style="width:22px;height:22px;border-radius:11px;background:${SOFT};border:1px solid ${BORDER};text-align:center;font:700 11px/22px Arial,sans-serif;color:${SKY};">${i + 1}</div>
            </td>
            <td style="padding:1px 0 12px;font:400 14px/1.6 Arial,sans-serif;color:${BODY};">${t}</td>
          </tr>`,
        )
        .join("")}
    </table>
  </td></tr>

  <!-- Contact -->
  <tr><td style="padding:10px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border:1px solid ${BORDER};border-radius:12px;">
      <tr><td style="padding:20px 22px;">
        <div style="font:700 12px/1.4 Arial,sans-serif;color:${NAVY};letter-spacing:1.6px;text-transform:uppercase;">Need Help?</div>
        <p style="margin:10px 0 0;font:400 14px/1.7 Arial,sans-serif;color:${BODY};">
          Email: <a href="mailto:theintellectnest64@gmail.com" style="color:${SKY};text-decoration:none;">theintellectnest64@gmail.com</a><br />
          Website: <a href="https://www.tinchess.com" style="color:${SKY};text-decoration:none;">tinchess.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:26px 32px 0;">
    <p style="margin:0;font:400 15px/1.7 Arial,sans-serif;color:${BODY};">
      We look forward to seeing ${esc(d.studentName)} in class and being part of their chess journey.
    </p>
    <p style="margin:14px 0 0;font:600 15px/1.7 Georgia,serif;color:${NAVY};">Warm regards,<br />Team The Intellect Nest</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:30px 32px 34px;">
    <div style="border-top:1px solid ${BORDER};padding-top:22px;text-align:center;">
      <div style="font:700 14px/1.3 Georgia,serif;color:${NAVY};letter-spacing:1.4px;">THE INTELLECT NEST</div>
      <div style="font:italic 400 12px/1.5 Georgia,serif;color:${BODY};margin-top:6px;">Where Knowledge Takes Flight</div>
      <div style="margin-top:10px;"><a href="https://www.tinchess.com" style="font:600 12px/1.4 Arial,sans-serif;color:${SKY};text-decoration:none;">tinchess.com</a></div>
      <div style="font:400 11px/1.6 Arial,sans-serif;color:#94A3B8;margin-top:12px;">This confirmation was sent because an enrollment was completed for ${esc(d.studentName)}.</div>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}
