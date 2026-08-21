import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

export interface ReceiptData {
  receiptNumber: string;
  registrationNumber: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  plan: string;
  sessions?: string | null;
  coach?: string | null;
  schedule?: string | null;
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  paymentReference: string;
  paymentStatus: string;
  enrollmentDate: string;
  balance?: string | null;
}

const NAVY = rgb(0.051, 0.118, 0.231);
const GOLD = rgb(0.961, 0.773, 0.094);
const SKY = rgb(0.169, 0.49, 0.831);
const GREY = rgb(0.35, 0.39, 0.45);
const LINE = rgb(0.87, 0.9, 0.94);

const clean = (v: string) =>
  String(v ?? "")
    .replace(/₹/g, "Rs. ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

export async function buildReceiptPdf(d: ReceiptData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Fee Receipt ${d.receiptNumber} - The Intellect Nest`);
  pdf.setAuthor("The Intellect Nest");

  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const oblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const M = 48;
  const innerW = width - M * 2;

  // Header band
  page.drawRectangle({ x: 0, y: height - 132, width, height: 132, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 138, width, height: 6, color: GOLD });

  // Official logo (embedded PNG, transparent background)
  let textX = M;
  try {
    const logo = await pdf.embedPng(decodeBase64(LOGO_PNG_BASE64));
    const logoH = 58;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, { x: M, y: height - 46 - logoH, width: logoW, height: logoH });
    textX = M + logoW + 14;
  } catch (e) {
    console.error("Logo embed failed:", e);
  }

  page.drawText("THE INTELLECT NEST", {
    x: textX, y: height - 62, size: 22, font: bold, color: rgb(1, 1, 1),
  });
  page.drawText("Where Knowledge Takes Flight", {
    x: textX, y: height - 82, size: 10.5, font: oblique, color: GOLD,
  });
  page.drawText("tinchess.com  |  theintellectnest64@gmail.com", {
    x: textX, y: height - 104, size: 9, font: reg, color: rgb(0.78, 0.85, 0.94),
  });

  const rightText = (text: string, y: number, size: number, font = reg, color = rgb(1, 1, 1)) => {
    const t = clean(text);
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: width - M - w, y, size, font, color });
  };
  rightText("FEE RECEIPT", height - 62, 15, bold);
  rightText(d.receiptNumber, height - 82, 11, bold, GOLD);
  rightText(`Date: ${d.paymentDate}`, height - 100, 9, reg, rgb(0.78, 0.85, 0.94));

  let y = height - 176;

  const sectionTitle = (label: string) => {
    page.drawText(clean(label).toUpperCase(), { x: M, y, size: 10, font: bold, color: SKY });
    y -= 8;
    page.drawLine({ start: { x: M, y }, end: { x: M + innerW, y }, thickness: 1, color: LINE });
    y -= 20;
  };

  const row = (label: string, value: string) => {
    if (!value) return;
    page.drawText(clean(label), { x: M, y, size: 9.5, font: bold, color: GREY });
    const val = clean(value);
    const maxW = innerW - 170;
    let line = val;
    const lines: string[] = [];
    while (reg.widthOfTextAtSize(line, 10.5) > maxW) {
      let cut = line.length;
      while (cut > 0 && reg.widthOfTextAtSize(line.slice(0, cut), 10.5) > maxW) cut--;
      const sp = line.lastIndexOf(" ", cut);
      const at = sp > 20 ? sp : cut;
      lines.push(line.slice(0, at));
      line = line.slice(at).trim();
    }
    lines.push(line);
    lines.forEach((l, i) => {
      page.drawText(l, { x: M + 170, y: y - i * 14, size: 10.5, font: reg, color: NAVY });
    });
    y -= 18 + (lines.length - 1) * 14;
  };

  sectionTitle("Billed To");
  row("Student Name", d.studentName);
  row("Parent / Guardian", d.parentName);
  row("Email", d.parentEmail);
  row("Phone", d.parentPhone);
  y -= 12;

  sectionTitle("Enrollment Details");
  row("Registration No.", d.registrationNumber);
  row("Program / Plan", d.plan);
  if (d.sessions) row("Sessions", d.sessions);
  if (d.coach) row("Coach", d.coach);
  if (d.schedule) row("Class Schedule", d.schedule);
  row("Enrollment Date", d.enrollmentDate);
  y -= 12;

  sectionTitle("Payment Summary");
  row("Payment Date", d.paymentDate);
  row("Payment Method", d.paymentMethod);
  row("Payment Reference", d.paymentReference);
  if (d.balance) row("Balance Due", d.balance);
  y -= 6;

  // Amount box
  const boxH = 58;
  page.drawRectangle({
    x: M, y: y - boxH, width: innerW, height: boxH,
    color: rgb(0.965, 0.976, 1), borderColor: LINE, borderWidth: 1,
  });
  page.drawRectangle({ x: M, y: y - boxH, width: 4, height: boxH, color: GOLD });
  page.drawText("TOTAL AMOUNT PAID", { x: M + 20, y: y - 24, size: 9.5, font: bold, color: GREY });
  page.drawText(clean(`Rs. ${d.amount}`), { x: M + 20, y: y - 46, size: 19, font: bold, color: NAVY });

  const statusText = clean(d.paymentStatus).toUpperCase();
  const stW = bold.widthOfTextAtSize(statusText, 10);
  page.drawRectangle({
    x: width - M - stW - 32, y: y - 38, width: stW + 22, height: 22,
    color: rgb(0.9, 0.97, 0.92), borderColor: rgb(0.53, 0.8, 0.6), borderWidth: 1,
  });
  page.drawText(statusText, {
    x: width - M - stW - 21, y: y - 31, size: 10, font: bold, color: rgb(0.09, 0.45, 0.24),
  });
  y -= boxH + 34;

  const noteH = 62;
  page.drawRectangle({
    x: M, y: y - noteH + 14, width: innerW, height: noteH,
    color: rgb(0.988, 0.992, 1), borderColor: LINE, borderWidth: 1,
  });
  page.drawText("NOTE", { x: M + 18, y: y - 6, size: 9, font: bold, color: SKY });
  page.drawText("Thank you for choosing The Intellect Nest. Please retain this receipt as proof of payment.", {
    x: M + 18, y: y - 24, size: 9.5, font: reg, color: NAVY,
  });
  page.drawText("For any billing query, write to theintellectnest64@gmail.com quoting the receipt reference above.", {
    x: M + 18, y: y - 40, size: 9.5, font: reg, color: GREY,
  });
  y -= noteH + 18;

  page.drawText("This is a computer-generated receipt and does not require a signature.", {
    x: M, y, size: 8.5, font: oblique, color: GREY,
  });

  // Footer
  page.drawLine({ start: { x: M, y: 92 }, end: { x: width - M, y: 92 }, thickness: 1, color: LINE });
  page.drawText("THE INTELLECT NEST", { x: M, y: 72, size: 10, font: bold, color: NAVY });
  page.drawText("Where Knowledge Takes Flight", { x: M, y: 58, size: 9, font: oblique, color: GREY });
  page.drawText("tinchess.com", { x: M, y: 42, size: 9, font: reg, color: SKY });
  const rn = clean(`Receipt Reference: ${d.receiptNumber}`);
  page.drawText(rn, {
    x: width - M - bold.widthOfTextAtSize(rn, 9), y: 58, size: 9, font: bold, color: NAVY,
  });

  return await pdf.save();
}
