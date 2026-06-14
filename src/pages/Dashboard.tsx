import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Coins,
  Crown,
  DollarSign,
  Gauge,
  GraduationCap,
  LineChart as LineChartIcon,
  LogIn,
  LogOut,
  Megaphone,
  Percent,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

const C = {
  bg: "#FFFFFF",
  bgAlt: "#F0F6FF",
  card: "#FFFFFF",
  card2: "#F0F6FF",
  border: "#D6E4F5",
  text: "#0D1E3B",
  muted: "#4A5568",
  sky: "#2B7DD4",
  gold: "#F5C518",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
};

type Row = Record<string, string>;
type Payload = {
  tabs: string[];
  rawTabs?: string[];
  data: Record<string, Row[]>;
  fetchedAt: string;
  diagnostics?: Array<{ tab: string; canonical: string; rows: number; headerRow: number; headers: string[] }>;
};
type AppTab = "Overview" | "Growth" | "Funnel" | "Unit Economics" | "Coaches";
type Kpi = { label: string; value: string; hint: string; icon: React.ElementType; accent: string };

const APP_TABS: AppTab[] = ["Overview", "Growth", "Funnel", "Unit Economics", "Coaches"];
const DATA_TABS = ["Payments", "Expenses", "Coaches", "Students", "Ads"] as const;
const VALID_MONTH_RE = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/;
const MILESTONES = [
  { label: "Jun", target: 25 },
  { label: "Sep", target: 50 },
  { label: "Dec", target: 100 },
  { label: "Mar", target: 200 },
];
const PIE_COLORS = [C.sky, C.green, C.amber, C.red, "#A78BFA", "#F472B6", "#22D3EE", "#F97316"];

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  const raw = String(value).trim();
  const clean = raw.replace(/[(),₹$€£%\s]/g, "").trim();
  if (!clean || clean === "-" || clean.toLowerCase() === "na") return 0;
  const n = Number.parseFloat(clean);
  return Number.isFinite(n) ? (raw.includes("(") && raw.includes(")") ? -n : n) : 0;
};

const normalizeKey = (key: string) => key.toLowerCase().replace(/[\s_-]+/g, "");
const FIELD_ALIASES: Record<string, string[]> = {
  Month: ["Month", "Billing Month", "Payment Month", "Expense Month", "Coach Month", "Ads Month", "Period"],
  Date: ["Date", "Payment Date", "Paid Date", "Expense Date", "Created At", "Timestamp", "Submitted At"],
  Received: ["Received", "Amount Received", "Paid", "Payment", "Fee Received", "Revenue", "Total Received", "Net Received", "Collected", "Collection"],
  Amount: ["Amount", "Cost", "Expense", "Spent", "Paid", "Value", "Total", "Debit"],
  "Actual Pay": ["Actual Pay", "Pay", "Coach Pay", "Amount Paid", "Salary", "Payout", "Actual", "Total Pay"],
  "Estimated Pay": ["Estimated Pay", "Expected Pay", "Estimate", "Projected Pay"],
  Difference: ["Difference", "Diff", "Balance", "Variance"],
  "Classes This Month": ["Classes This Month", "Classes", "Sessions", "No. of Classes", "Class Count", "Total Classes"],
  Spend: ["Spend", "Ad Spend", "Ads Spend", "Meta Spend", "Amount Spent", "Marketing Spend"],
  Leads: ["Leads", "Lead", "Enquiries", "Inquiries", "Prospects"],
  "Demos Booked": ["Demos Booked", "Demo Booked", "Booked", "Trial Booked", "Demo Scheduled"],
  "Demos Shown": ["Demos Shown", "Demo Shown", "Shown", "Attended", "Demo Attended", "Trial Attended"],
  Conversions: ["Conversions", "Conversion", "Paid Conversions", "Sales", "Admissions", "Enrollments", "Enrolments"],
  "Student Name": ["Student Name", "Student", "Name", "Child Name", "Kid Name", "Learner"],
  "Coach Name": ["Coach Name", "Coach", "Teacher", "Trainer", "Instructor"],
  "Net Monthly Fee": ["Net Monthly Fee", "Monthly Fee", "Fee", "Net Fee", "Package Fee", "Amount", "Price"],
  Status: ["Status", "Payment Status", "Student Status", "Active Status"],
  Category: ["Category", "Type", "Expense Category", "Head", "Particulars", "Description"],
  Type: ["Type", "Class Type", "Program Type"],
  Package: ["Package", "Plan", "Batch", "Program"],
};
const get = (row: Row, key: string): string => {
  if (row[key] !== undefined) return row[key];
  const wants = (FIELD_ALIASES[key] ?? [key]).map(normalizeKey);
  const rowKeys = Object.keys(row);
  for (const k of rowKeys) {
    if (wants.includes(normalizeKey(k))) return row[k] ?? "";
  }
  for (const k of rowKeys) {
    const nk = normalizeKey(k);
    if (wants.some((want) => nk.includes(want) || want.includes(nk))) return row[k] ?? "";
  }
  return "";
};
const col = (row: Row, letter: string) => row[letter] ?? row[`Column ${letter}`] ?? "";
const cleanMonth = (value: string) => String(value || "").trim();
const isValidMonth = (value: string) => VALID_MONTH_RE.test(cleanMonth(value));
const paymentMonth = (row: Row) => cleanMonth(col(row, "C") || get(row, "Month"));
const expenseMonth = (row: Row) => cleanMonth(col(row, "B") || get(row, "Month"));
const coachMonth = (row: Row) => cleanMonth(col(row, "B") || get(row, "Month"));
const paymentReceived = (row: Row) => toNumber(col(row, "F") || get(row, "Received"));
const expenseAmount = (row: Row) => toNumber(col(row, "E") || get(row, "Amount"));
const expenseCategory = (row: Row) => String(col(row, "C") || get(row, "Category")).trim();
const coachActualPay = (row: Row) => toNumber(col(row, "G") || get(row, "Actual Pay"));
const studentStatus = (row: Row) => String(col(row, "L") || get(row, "Status")).trim().toLowerCase();
const monthFromDate = (value: string) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[A-Za-z]{3,9}\s+\d{4}$/.test(raw) || /^[A-Za-z]{3,9}$/.test(raw)) return raw;
  const slash = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  const date = slash ? new Date(Number(slash[3].length === 2 ? `20${slash[3]}` : slash[3]), Number(slash[2]) - 1, Number(slash[1])) : new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};
const adsMonth = (row: Row) => cleanMonth(get(row, "Month")) || monthFromDate(get(row, "Date"));
const getRowMonth = (row: Row) => cleanMonth(get(row, "Month")) || monthFromDate(get(row, "Date"));
const sameMonth = (row: Row, selectedMonth: string, getMonth: (row: Row) => string = getRowMonth) => getMonth(row) === selectedMonth;
const percent = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);
const ratio = (num: number, den: number) => (den > 0 ? num / den : 0);

const money = (value: number) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
};

const num = (value: number) => Math.round(value).toLocaleString("en-IN");
const pct = (value: number) => `${value.toFixed(1)}%`;

const collectMonths = (payload: Payload | null) => {
  if (!payload) return [];
  const months: string[] = [];
  const push = (month: string) => {
    const clean = String(month || "").trim();
    if (isValidMonth(clean) && !months.includes(clean)) months.push(clean);
  };
  (payload.data.Payments ?? []).forEach((r) => push(paymentMonth(r)));
  return months;
};

const cardStyle = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: "0 4px 24px rgba(13,30,59,0.06)" };
const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, color: C.text };

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 sm:p-5 ${className}`} style={cardStyle}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-3 min-w-0">
      <div className="h-9 w-9 shrink-0 flex items-center justify-center" style={{ background: `${C.sky}18`, color: C.sky, borderRadius: 12 }}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h2 className="font-semibold leading-tight" style={{ color: C.text }}>{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm truncate" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
    </div>
  </div>
);

const KpiCard = ({ label, value, hint, icon: Icon, accent }: Kpi) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 sm:p-5 overflow-hidden relative"
    style={cardStyle}
  >
    <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[11px] sm:text-xs uppercase" style={{ color: C.muted, letterSpacing: 0 }}>{label}</div>
        <div className="text-2xl sm:text-3xl font-bold mt-2 break-words" style={{ color: C.text }}>{value}</div>
      </div>
      <div className="h-10 w-10 shrink-0 flex items-center justify-center" style={{ background: `${accent}1F`, color: accent, borderRadius: 12 }}>
        <Icon size={19} />
      </div>
    </div>
    <div className="text-xs mt-3" style={{ color: C.muted }}>{hint}</div>
  </motion.div>
);

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 text-sm shadow-2xl" style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, boxShadow: "0 12px 32px rgba(13,30,59,0.15)" }}>
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((entry, index) => (
        <div key={`${entry.name}-${index}`} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color ?? C.sky }} />
          <span style={{ color: C.muted }}>{entry.name}</span>
          <span>{typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <Card>
    <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
      <AlertCircle size={16} color={C.amber} /> {text}
    </div>
  </Card>
);

const useDashboardModel = (payload: Payload | null, selectedMonth: string) => {
  return useMemo(() => {
    const payments = payload?.data.Payments ?? [];
    const expenses = payload?.data.Expenses ?? [];
    const coaches = payload?.data.Coaches ?? [];
    const students = payload?.data.Students ?? [];
    const ads = payload?.data.Ads ?? [];
    const months = collectMonths(payload);

    const rowsFor = (rows: Row[], getMonth: (row: Row) => string) => rows.filter((r) => selectedMonth && sameMonth(r, selectedMonth, getMonth));
    const payRows = rowsFor(payments, paymentMonth);
    const expenseRows = rowsFor(expenses, expenseMonth);
    const coachRows = rowsFor(coaches, coachMonth);
    const adRows = rowsFor(ads, adsMonth);

    const activeStudents = students.filter((r) => {
      const status = studentStatus(r);
      return !status || status === "active" || status === "paid" || status === "ongoing";
    }).length;
    const revenue = payRows.reduce((sum, r) => sum + paymentReceived(r), 0);
    const sheetExpenses = expenseRows.reduce((sum, r) => sum + expenseAmount(r), 0);
    const coachPay = coachRows.reduce((sum, r) => sum + coachActualPay(r), 0);
    const totalExpenses = sheetExpenses + coachPay;
    const profit = revenue - totalExpenses;
    const metaAdsSpend = expenseRows
      .filter((r) => /meta|facebook|instagram|ads?/i.test(expenseCategory(r)))
      .reduce((sum, r) => sum + expenseAmount(r), 0);
    const adsSpend = adRows.reduce((sum, r) => sum + toNumber(get(r, "Spend")), 0);
    const adsConversions = adRows.reduce((sum, r) => sum + toNumber(get(r, "Conversions")), 0);
    const leads = adRows.reduce((sum, r) => sum + toNumber(get(r, "Leads")), 0);
    const demosBooked = adRows.reduce((sum, r) => sum + toNumber(get(r, "Demos Booked")), 0);
    const demosShown = adRows.reduce((sum, r) => sum + toNumber(get(r, "Demos Shown")), 0);
    const overduePayments = payRows.filter((r) => String(get(r, "Status")).trim().toLowerCase() === "overdue").length;
    const coachCostPct = percent(coachPay, revenue);
    const avgFee = ratio(students.reduce((sum, r) => sum + toNumber(get(r, "Net Monthly Fee")), 0), students.filter((r) => toNumber(get(r, "Net Monthly Fee")) > 0).length);

    const monthly = months.map((month) => {
      const p = payments.filter((r) => sameMonth(r, month, paymentMonth));
      const e = expenses.filter((r) => sameMonth(r, month, expenseMonth));
      const c = coaches.filter((r) => sameMonth(r, month, coachMonth));
      const a = ads.filter((r) => sameMonth(r, month, adsMonth));
      const mRevenue = p.reduce((sum, r) => sum + paymentReceived(r), 0);
      const mExpenses = e.reduce((sum, r) => sum + expenseAmount(r), 0);
      const mCoach = c.reduce((sum, r) => sum + coachActualPay(r), 0);
      const mProfit = mRevenue - mExpenses - mCoach;
      const uniquePaidStudents = new Set(p.map((r) => get(r, "Student Name").trim()).filter(Boolean)).size;
      return {
        month,
        revenue: mRevenue,
        expenses: mExpenses + mCoach,
        operatingExpenses: mExpenses,
        coachPay: mCoach,
        profit: mProfit,
        margin: percent(mProfit, mRevenue),
        coachCost: percent(mCoach, mRevenue),
        activeStudents: uniquePaidStudents || activeStudents,
        adsSpend: a.reduce((sum, r) => sum + toNumber(get(r, "Spend")), 0),
        conversions: a.reduce((sum, r) => sum + toNumber(get(r, "Conversions")), 0),
      };
    });

    const expenseBreakdownMap = new Map<string, number>();
    expenseRows.forEach((r) => {
      const category = expenseCategory(r) || "Other";
      expenseBreakdownMap.set(category, (expenseBreakdownMap.get(category) ?? 0) + expenseAmount(r));
    });
    if (coachPay > 0) expenseBreakdownMap.set("Coach Pay", (expenseBreakdownMap.get("Coach Pay") ?? 0) + coachPay);
    const expenseBreakdown = Array.from(expenseBreakdownMap, ([name, value]) => ({ name, value })).filter((item) => item.value > 0);

    const coachTotalsMap = new Map<string, { coach: string; classes: number; estimated: number; actual: number; difference: number }>();
    coachRows.forEach((r) => {
      const coach = get(r, "Coach Name").trim() || "Unassigned";
      const current = coachTotalsMap.get(coach) ?? { coach, classes: 0, estimated: 0, actual: 0, difference: 0 };
      current.classes += toNumber(get(r, "Classes This Month"));
      current.estimated += toNumber(get(r, "Estimated Pay"));
      current.actual += coachActualPay(r);
      current.difference += toNumber(get(r, "Difference"));
      coachTotalsMap.set(coach, current);
    });
    const coachTotals = Array.from(coachTotalsMap.values()).sort((a, b) => b.actual - a.actual);

    const packageRows = students.filter((r) => toNumber(get(r, "Net Monthly Fee")) > 0);
    const packageAvg = (matcher: RegExp) => ratio(
      packageRows.filter((r) => matcher.test(`${get(r, "Type")} ${get(r, "Package")}`)).reduce((sum, r) => sum + toNumber(get(r, "Net Monthly Fee")), 0),
      packageRows.filter((r) => matcher.test(`${get(r, "Type")} ${get(r, "Package")}`)).length,
    );
    const effectiveAvgFee = avgFee || ratio(revenue, Math.max(activeStudents, 1));
    const groupFee = packageAvg(/group|batch/i) || 2999;
    const oneOnOneFee = packageAvg(/1[-\s]?on[-\s]?1|private|one/i) || 4999;
    const variableCostPct = Math.min(Math.max(coachCostPct, 0), 85);
    const netContributionPerStudent = effectiveAvgFee * (1 - variableCostPct / 100);
    const fixedCosts = Math.max(sheetExpenses - metaAdsSpend, 0);

    return {
      payments,
      expenses,
      coaches,
      students,
      ads,
      months,
      activeStudents,
      revenue,
      sheetExpenses,
      coachPay,
      totalExpenses,
      profit,
      roas: ratio(revenue, adsSpend || metaAdsSpend),
      cac: ratio(adsSpend, adsConversions),
      coachCostPct,
      overduePayments,
      monthly,
      expenseBreakdown,
      funnel: { leads, demosBooked, demosShown, conversions: adsConversions, spend: adsSpend, cpl: ratio(adsSpend, leads), cpa: ratio(adsSpend, adsConversions) },
      avgFee: effectiveAvgFee,
      ltv: [3, 6, 12].map((monthsCount) => ({ label: `${monthsCount}mo`, value: effectiveAvgFee * monthsCount })),
      breakEvenStudents: netContributionPerStudent > 0 ? Math.ceil(fixedCosts / netContributionPerStudent) : 0,
      fixedCosts,
      netContributionPerStudent,
      pricing: [
        { type: "Group", fee: groupFee, margin: percent(groupFee * (1 - variableCostPct / 100), groupFee), contribution: groupFee * (1 - variableCostPct / 100) },
        { type: "1-on-1", fee: oneOnOneFee, margin: percent(oneOnOneFee * (1 - variableCostPct / 100), oneOnOneFee), contribution: oneOnOneFee * (1 - variableCostPct / 100) },
      ],
      coachTotals,
    };
  }, [payload, selectedMonth]);
};

const OverviewTab = ({ model, selectedMonth }: { model: ReturnType<typeof useDashboardModel>; selectedMonth: string }) => {
  const kpis: Kpi[] = [
    { label: "Active Students", value: num(model.activeStudents), hint: "Students tab · Status = Active", icon: Users, accent: C.sky },
    { label: "Monthly Revenue", value: money(model.revenue), hint: `Payments received · ${selectedMonth}`, icon: CircleDollarSign, accent: C.green },
    { label: "Net Profit", value: money(model.profit), hint: "Revenue − expenses − coach pay", icon: TrendingUp, accent: model.profit >= 0 ? C.green : C.red },
    { label: "Total Expenses", value: money(model.totalExpenses), hint: "Expenses + actual coach pay", icon: WalletCards, accent: C.red },
    { label: "ROAS", value: `${model.roas.toFixed(2)}x`, hint: "Revenue ÷ Meta Ads expense", icon: Megaphone, accent: C.amber },
    { label: "CAC", value: money(model.cac), hint: "Ads spend ÷ conversions", icon: Target, accent: C.sky },
    { label: "Coach Cost %", value: pct(model.coachCostPct), hint: "Actual coach pay ÷ revenue", icon: Percent, accent: model.coachCostPct > 40 ? C.red : C.green },
    { label: "Overdue Payments", value: num(model.overduePayments), hint: "Payments status = Overdue", icon: AlertCircle, accent: model.overduePayments > 0 ? C.red : C.green },
  ];
  const coachHealthy = model.coachCostPct <= 40;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</div>
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" style={{ ...cardStyle, background: coachHealthy ? `${C.green}18` : `${C.red}18`, borderColor: coachHealthy ? `${C.green}88` : `${C.red}88` }}>
        <div className="flex items-center gap-3">
          <Gauge color={coachHealthy ? C.green : C.red} size={22} />
          <div>
            <div className="font-semibold" style={{ color: C.text }}>{coachHealthy ? "Coach cost is under control" : "Coach cost is above target"}</div>
            <div className="text-sm" style={{ color: C.muted }}>Current coach cost is {pct(model.coachCostPct)}. Target is 40% or lower.</div>
          </div>
        </div>
        <div className="text-3xl font-bold" style={{ color: coachHealthy ? C.green : C.red }}>{pct(model.coachCostPct)}</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Card className="xl:col-span-3">
          <SectionTitle icon={LineChartIcon} title="Revenue vs Expenses vs Profit" subtitle="All months from the sheet" />
          <div className="h-[340px]">
            <ResponsiveContainer>
              <AreaChart data={model.monthly} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.45} /><stop offset="95%" stopColor={C.green} stopOpacity={0.03} /></linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.38} /><stop offset="95%" stopColor={C.red} stopOpacity={0.03} /></linearGradient>
                  <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.sky} stopOpacity={0.38} /><stop offset="95%" stopColor={C.sky} stopOpacity={0.03} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={`${C.border}99`} />
                <XAxis dataKey="month" stroke={C.muted} fontSize={11} />
                <YAxis stroke={C.muted} fontSize={11} tickFormatter={(v) => money(Number(v)).replace("₹", "")} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.green} fill="url(#revenueFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.red} fill="url(#expenseFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke={C.sky} fill="url(#profitFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <SectionTitle icon={Coins} title="Expense Breakdown" subtitle={selectedMonth} />
          {model.expenseBreakdown.length ? (
            <div className="h-[340px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={model.expenseBreakdown} innerRadius={68} outerRadius={118} paddingAngle={3} dataKey="value" nameKey="name">
                    {model.expenseBreakdown.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState text="No expenses found for this month." />}
        </Card>
      </div>
      <Card>
        <SectionTitle icon={BarChart3} title="Monthly P&L" subtitle="Revenue / Expenses / Coach Pay / Net Profit / Margin" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Month", "Revenue", "Expenses", "Coach Pay", "Net Profit", "Margin %", "Coach Cost %"].map((h) => <th key={h} className="text-left px-3 py-2 font-semibold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>)}</tr></thead>
            <tbody>{model.monthly.map((row) => {
              const marginColor = row.margin > 30 ? C.green : row.margin >= 15 ? C.amber : C.red;
              return <tr key={row.month} style={{ borderBottom: `1px solid ${C.border}80` }}>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: C.text }}>{row.month}</td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: C.green }}>{money(row.revenue)}</td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: C.red }}>{money(row.operatingExpenses)}</td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: C.amber }}>{money(row.coachPay)}</td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: row.profit >= 0 ? C.green : C.red }}>{money(row.profit)}</td>
                <td className="px-3 py-3 whitespace-nowrap font-semibold" style={{ color: marginColor }}>{pct(row.margin)}</td>
                <td className="px-3 py-3 whitespace-nowrap font-semibold" style={{ color: row.coachCost > 40 ? C.red : C.green }}>{pct(row.coachCost)}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

const GrowthTab = ({ model }: { model: ReturnType<typeof useDashboardModel> }) => {
  const currentActive = model.monthly.at(-1)?.activeStudents ?? model.activeStudents;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card>
          <SectionTitle icon={Users} title="Active Student Count" subtitle="Unique paying students by month" />
          <div className="h-[330px]"><ResponsiveContainer><LineChart data={model.monthly}><CartesianGrid strokeDasharray="3 3" stroke={`${C.border}99`} /><XAxis dataKey="month" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} /><Tooltip content={<DarkTooltip />} /><Line type="monotone" dataKey="activeStudents" name="Active Students" stroke={C.sky} strokeWidth={3} dot={{ fill: C.sky, r: 4 }} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <SectionTitle icon={TrendingUp} title="Revenue Ramp" subtitle="Monthly received revenue" />
          <div className="h-[330px]"><ResponsiveContainer><BarChart data={model.monthly}><CartesianGrid strokeDasharray="3 3" stroke={`${C.border}99`} /><XAxis dataKey="month" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} tickFormatter={(v) => money(Number(v)).replace("₹", "")} /><Tooltip content={<DarkTooltip />} /><Bar dataKey="revenue" name="Revenue" fill={C.green} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {MILESTONES.map((milestone) => {
          const reached = currentActive >= milestone.target;
          return <Card key={milestone.label}>
            <div className="flex items-center justify-between gap-3">
              <div><div className="text-sm" style={{ color: C.muted }}>{milestone.label} Target</div><div className="text-3xl font-bold mt-1" style={{ color: C.text }}>{milestone.target}</div></div>
              <div className="px-3 py-1 text-xs font-semibold" style={{ borderRadius: 999, background: reached ? `${C.green}22` : `${C.amber}22`, color: reached ? C.green : C.amber }}>{reached ? "Hit" : "Chasing"}</div>
            </div>
            <div className="mt-4 h-2 overflow-hidden" style={{ background: C.bg, borderRadius: 999 }}><div className="h-full" style={{ width: `${Math.min(100, percent(currentActive, milestone.target))}%`, background: reached ? C.green : C.sky, borderRadius: 999 }} /></div>
            <div className="text-xs mt-2" style={{ color: C.muted }}>Actual: {num(currentActive)} active students</div>
          </Card>;
        })}
      </div>
    </motion.div>
  );
};

const FunnelTab = ({ model }: { model: ReturnType<typeof useDashboardModel> }) => {
  const steps = [
    { label: "Leads", value: model.funnel.leads, color: C.sky, base: model.funnel.leads },
    { label: "Demos Booked", value: model.funnel.demosBooked, color: C.green, base: model.funnel.leads },
    { label: "Demos Shown", value: model.funnel.demosShown, color: C.amber, base: model.funnel.leads },
    { label: "Conversions", value: model.funnel.conversions, color: C.red, base: model.funnel.leads },
  ];
  const max = Math.max(...steps.map((s) => s.value), 1);
  const rates = [
    { label: "Lead → Booked", value: pct(percent(model.funnel.demosBooked, model.funnel.leads)), icon: CalendarDays },
    { label: "Booked → Shown", value: pct(percent(model.funnel.demosShown, model.funnel.demosBooked)), icon: Users },
    { label: "Shown → Paid", value: pct(percent(model.funnel.conversions, model.funnel.demosShown)), icon: Crown },
    { label: "CPL", value: money(model.funnel.cpl), icon: Megaphone },
    { label: "CPA", value: money(model.funnel.cpa), icon: Target },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <Card>
        <SectionTitle icon={Target} title="Acquisition Funnel" subtitle="Leads → demos → paid conversions" />
        <div className="space-y-4">
          {steps.map((step) => <div key={step.label}>
            <div className="flex justify-between text-sm mb-2"><span style={{ color: C.text }}>{step.label}</span><span style={{ color: C.muted }}>{num(step.value)} · {pct(percent(step.value, step.base))}</span></div>
            <div className="h-9 overflow-hidden" style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(3, percent(step.value, max))}%` }} className="h-full flex items-center justify-end pr-3 font-semibold text-sm" style={{ background: step.color, color: C.bg, borderRadius: 11 }}>{num(step.value)}</motion.div></div>
          </div>)}
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">{rates.map((rate) => <KpiCard key={rate.label} label={rate.label} value={rate.value} hint="Selected month" icon={rate.icon} accent={C.sky} />)}</div>
      <Card>
        <SectionTitle icon={ArrowUpRight} title="What-if Revenue" subtitle="Projected revenue from current leads at different conversion rates" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{[10, 15, 20, 25].map((conversion) => {
          const projected = model.funnel.leads * (conversion / 100) * model.avgFee;
          return <div key={conversion} className="p-4" style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14 }}><div className="text-xs" style={{ color: C.muted }}>{conversion}% conversion</div><div className="text-2xl font-bold mt-2" style={{ color: C.green }}>{money(projected)}</div><div className="text-xs mt-2" style={{ color: C.muted }}>{num(model.funnel.leads * (conversion / 100))} new students × avg fee</div></div>;
        })}</div>
      </Card>
    </motion.div>
  );
};

const UnitEconomicsTab = ({ model }: { model: ReturnType<typeof useDashboardModel> }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard label="Average Monthly Fee" value={money(model.avgFee)} hint="Students tab · Net Monthly Fee" icon={DollarSign} accent={C.sky} />
      {model.ltv.map((item) => <KpiCard key={item.label} label={`LTV ${item.label}`} value={money(item.value)} hint="Avg fee × retention scenario" icon={Coins} accent={C.green} />)}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Card>
        <SectionTitle icon={Gauge} title="Break-even" subtitle="Fixed costs ÷ contribution per student" />
        <div className="text-5xl font-bold" style={{ color: C.text }}>{num(model.breakEvenStudents)}</div>
        <div className="text-sm mt-2" style={{ color: C.muted }}>students needed to cover {money(model.fixedCosts)} fixed costs at {money(model.netContributionPerStudent)} contribution/student.</div>
        <div className="mt-5 h-3 overflow-hidden" style={{ background: C.bg, borderRadius: 999 }}><div className="h-full" style={{ width: `${Math.min(100, percent(model.activeStudents, model.breakEvenStudents || 1))}%`, background: model.activeStudents >= model.breakEvenStudents ? C.green : C.amber, borderRadius: 999 }} /></div>
        <div className="text-xs mt-2" style={{ color: C.muted }}>Current active students: {num(model.activeStudents)}</div>
      </Card>
      <Card>
        <SectionTitle icon={WalletCards} title="Pricing Matrix" subtitle="Group vs 1-on-1 fee and margin" />
        <div className="space-y-3">{model.pricing.map((row) => <div key={row.type} className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center" style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14 }}>
          <div><div className="text-xs" style={{ color: C.muted }}>Package</div><div className="font-semibold" style={{ color: C.text }}>{row.type}</div></div>
          <div><div className="text-xs" style={{ color: C.muted }}>Fee</div><div className="font-semibold" style={{ color: C.green }}>{money(row.fee)}</div></div>
          <div><div className="text-xs" style={{ color: C.muted }}>Contribution</div><div className="font-semibold" style={{ color: C.sky }}>{money(row.contribution)}</div></div>
          <div><div className="text-xs" style={{ color: C.muted }}>Margin</div><div className="font-semibold" style={{ color: row.margin >= 30 ? C.green : C.amber }}>{pct(row.margin)}</div></div>
        </div>)}</div>
      </Card>
    </div>
  </motion.div>
);

const CoachesTab = ({ model }: { model: ReturnType<typeof useDashboardModel> }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Card>
        <SectionTitle icon={BarChart3} title="Coach Pay vs Revenue" subtitle="Monthly comparison" />
        <div className="h-[330px]"><ResponsiveContainer><BarChart data={model.monthly}><CartesianGrid strokeDasharray="3 3" stroke={`${C.border}99`} /><XAxis dataKey="month" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} tickFormatter={(v) => money(Number(v)).replace("₹", "")} /><Tooltip content={<DarkTooltip />} /><Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} /><Bar dataKey="revenue" name="Revenue" fill={C.green} radius={[8, 8, 0, 0]} /><Bar dataKey="coachPay" name="Coach Pay" fill={C.amber} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Card>
      <Card>
        <SectionTitle icon={Percent} title="Coach Cost % Trend" subtitle="Red target line at 40%" />
        <div className="h-[330px]"><ResponsiveContainer><BarChart data={model.monthly}><CartesianGrid strokeDasharray="3 3" stroke={`${C.border}99`} /><XAxis dataKey="month" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} /><Tooltip content={<DarkTooltip />} /><ReferenceLine y={40} stroke={C.red} strokeDasharray="4 4" label={{ value: "40%", fill: C.red, fontSize: 12 }} /><Bar dataKey="coachCost" name="Coach Cost %" radius={[8, 8, 0, 0]}>{model.monthly.map((row) => <Cell key={row.month} fill={row.coachCost > 40 ? C.red : C.green} />)}</Bar></BarChart></ResponsiveContainer></div>
      </Card>
    </div>
    <Card>
      <SectionTitle icon={GraduationCap} title="Coach Payroll" subtitle="Total classes, estimated pay, actual pay, and difference" />
      {model.coachTotals.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{model.coachTotals.map((coach) => <div key={coach.coach} className="p-4" style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14 }}>
        <div className="flex items-start justify-between gap-3"><div><div className="font-semibold" style={{ color: C.text }}>{coach.coach}</div><div className="text-xs" style={{ color: C.muted }}>{num(coach.classes)} classes total</div></div><GraduationCap color={C.sky} size={20} /></div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm"><div><div style={{ color: C.muted }}>Estimated</div><div className="font-semibold" style={{ color: C.amber }}>{money(coach.estimated)}</div></div><div><div style={{ color: C.muted }}>Actual</div><div className="font-semibold" style={{ color: C.green }}>{money(coach.actual)}</div></div><div><div style={{ color: C.muted }}>Diff</div><div className="font-semibold" style={{ color: coach.difference >= 0 ? C.green : C.red }}>{money(coach.difference)}</div></div></div>
      </div>)}</div> : <EmptyState text="No coach payroll rows found." />}
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("Overview");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser ? { email: currentUser.email } : null);
      if (currentUser) supabase.rpc("is_admin", { _user_id: currentUser.id }).then(({ data }) => setIsAdmin(data === true));
      else setIsAdmin(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser ? { email: currentUser.email } : null);
      if (currentUser) {
        const { data } = await supabase.rpc("is_admin", { _user_id: currentUser.id });
        setIsAdmin(data === true);
      }
      setAuthChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (quiet = false) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.functions.invoke("fetch-dashboard-data");
    if (err) {
      setError(err.message);
      if (!quiet) toast.error(err.message);
    } else if (data?.error) {
      setError(data.error);
      if (!quiet) toast.error(data.error);
    } else {
      const nextPayload = data as Payload;
      setPayload(nextPayload);
      const months = collectMonths(nextPayload);
      setSelectedMonth((current) => (current && months.includes(current) ? current : months.at(-1) ?? ""));
      if (!quiet) toast.success("Dashboard synced");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return undefined;
    fetchData(true);
    const interval = window.setInterval(() => fetchData(true), 5 * 60 * 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const model = useDashboardModel(payload, selectedMonth);
  const monthOptions = model.months;
  const syncCounts = payload ? APP_TABS.map((tab) => `${tab}: ${(payload.data[tab] ?? []).length}`).join(" · ") : "Not synced yet";
  const totalRows = payload ? APP_TABS.reduce((sum, tab) => sum + (payload.data[tab] ?? []).length, 0) : 0;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (err) toast.error(err.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setPayload(null);
  };

  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="[&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans" style={{ background: C.bgAlt, minHeight: "100vh", color: C.text, fontFamily: "Inter, sans-serif" }}>
      <Helmet><title>Dashboard — The Intellect Nest</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      {children}
    </div>
  );

  if (authChecking) return <PageShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: C.sky, borderTopColor: "transparent" }} /></div></PageShell>;

  if (!user) {
    return <PageShell><div className="min-h-screen flex items-center justify-center px-4"><Card className="w-full max-w-sm"><h1 className="text-2xl font-semibold mb-1" style={{ color: C.text }}>Dashboard</h1><p className="text-sm mb-6" style={{ color: C.muted }}>Sign in to view The Intellect Nest Business OS.</p><form onSubmit={handleLogin} className="space-y-3"><input type="email" required placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg outline-none" style={inputStyle} /><input type="password" required placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg outline-none" style={inputStyle} /><button type="submit" disabled={loginLoading} className="w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: C.sky, color: C.bg }}><LogIn size={16} /> {loginLoading ? "Signing in…" : "Sign in"}</button></form></Card></div></PageShell>;
  }

  if (!isAdmin) {
    return <PageShell><div className="min-h-screen flex items-center justify-center px-4"><Card className="w-full max-w-sm text-center"><AlertCircle className="mx-auto mb-3" color={C.red} size={32} /><h1 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Access denied</h1><p className="text-sm mb-4" style={{ color: C.muted }}>Your account ({user.email}) is not an admin.</p><button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm" style={inputStyle}>Sign out</button></Card></div></PageShell>;
  }

  return (
    <PageShell>
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: `${C.bg}F2`, borderBottom: `1px solid ${C.border}` }}>
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0"><div className="h-11 w-11 shrink-0 flex items-center justify-center text-2xl" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 }}>♟️</div><div className="min-w-0"><h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: C.text }}>The Intellect Nest</h1><div className="text-xs sm:text-sm uppercase" style={{ color: C.muted, letterSpacing: 0 }}>Business OS · tinchess.com</div></div></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-2 text-xs sm:text-sm" style={{ ...inputStyle, borderRadius: 12 }}>Synced rows: {totalRows}</div>
              <div className="px-3 py-2 text-xs sm:text-sm" style={{ ...inputStyle, borderRadius: 12 }}>Last updated: {payload ? new Date(payload.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-2 text-sm outline-none" style={{ ...inputStyle, borderRadius: 12 }}>{monthOptions.map((month) => <option key={month} value={month}>{month}</option>)}</select>
              <button onClick={() => fetchData(false)} disabled={loading} className="px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-60" style={{ ...inputStyle, borderRadius: 12 }}><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
              <button onClick={handleLogout} className="px-3 py-2 text-sm flex items-center gap-2" style={{ ...inputStyle, borderRadius: 12 }}><LogOut size={15} /> Sign out</button>
            </div>
          </div>
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto">
            {APP_TABS.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 text-sm whitespace-nowrap transition-colors" style={{ borderRadius: 12, background: activeTab === tab ? `${C.sky}22` : C.card, border: `1px solid ${activeTab === tab ? C.sky : C.border}`, color: activeTab === tab ? C.sky : C.muted, fontWeight: activeTab === tab ? 700 : 500 }}>{tab}</button>)}
          </div>
        </header>

        <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6">
          {loading && !payload && <div className="flex justify-center py-24"><div className="w-9 h-9 border-2 rounded-full animate-spin" style={{ borderColor: C.sky, borderTopColor: "transparent" }} /></div>}
          {error && <Card className="mb-5"><div className="flex items-start gap-3" style={{ color: C.red }}><AlertCircle size={18} /><div><div className="font-semibold">Failed to load live dashboard data</div><div className="text-sm" style={{ color: C.muted }}>{error}</div><div className="text-xs mt-2" style={{ color: C.muted }}>Make sure the sheet is shared as “Anyone with the link · Viewer” and the Google Sheets API key is valid.</div></div></div></Card>}
          {payload && <div className="mb-5 p-3 text-xs sm:text-sm overflow-x-auto" style={{ ...cardStyle, color: C.muted }}><span className="font-semibold" style={{ color: C.text }}>Google Sheet sync:</span> {syncCounts}</div>}
          {payload && selectedMonth && <AnimatePresence mode="wait">{activeTab === "Overview" && <OverviewTab key="overview" model={model} selectedMonth={selectedMonth} />}{activeTab === "Growth" && <GrowthTab key="growth" model={model} />}{activeTab === "Funnel" && <FunnelTab key="funnel" model={model} />}{activeTab === "Unit Economics" && <UnitEconomicsTab key="unit" model={model} />}{activeTab === "Coaches" && <CoachesTab key="coaches" model={model} />}</AnimatePresence>}
          {payload && !selectedMonth && <EmptyState text="No Month values found. Add Month values to the Payments tab to populate the dashboard." />}
        </main>
      </div>
    </PageShell>
  );
};

export default Dashboard;