import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import {
  LogIn, LogOut, RefreshCw, AlertCircle, TrendingUp, DollarSign,
  Users, GraduationCap, Activity, Target,
} from "lucide-react";
import { toast } from "sonner";

/* ──────────────── Theme tokens (scoped to /dashboard) ──────────────── */
const C = {
  bg: "#0D1B2A",
  card: "#132236",
  border: "#1E3A5F",
  text: "#FFFFFF",
  muted: "#94A3B8",
  sky: "#38BDF8",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
};

/* ──────────────── Helpers ──────────────── */
type Row = Record<string, string>;
type Payload = { tabs: string[]; data: Record<string, Row[]>; fetchedAt: string };

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/[,₹$€£\s]/g, "").trim();
  if (!s || s === "-") return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const isNumericColumn = (rows: Row[], key: string): boolean => {
  if (rows.length === 0) return false;
  let numeric = 0;
  let total = 0;
  for (const r of rows.slice(0, 30)) {
    const v = r[key];
    if (v === undefined || v === "") continue;
    total += 1;
    if (!Number.isNaN(parseFloat(String(v).replace(/[,₹$€£\s]/g, "")))) numeric += 1;
  }
  return total > 0 && numeric / total >= 0.7;
};

const fmtMoney = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n.toFixed(0)}`;

const fmtNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${Math.round(n)}`;

/* ──────────────── UI primitives ──────────────── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{ background: C.card, border: `1px solid ${C.border}` }}
  >
    {children}
  </div>
);

const KpiCard = ({
  label,
  value,
  icon: Icon,
  accent = C.sky,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: string;
  hint?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5"
    style={{ background: C.card, border: `1px solid ${C.border}` }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>
        {label}
      </span>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}20`, color: accent }}
      >
        <Icon size={18} />
      </div>
    </div>
    <div className="text-3xl font-semibold" style={{ color: C.text }}>
      {value}
    </div>
    {hint && (
      <div className="text-xs mt-1" style={{ color: C.muted }}>
        {hint}
      </div>
    )}
  </motion.div>
);

const DarkTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm"
      style={{ background: "#0a1422", border: `1px solid ${C.border}`, color: C.text }}
    >
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: C.muted }}>{p.name}:</span>
          <span>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ──────────────── Tab view ──────────────── */
const TabView = ({ name, rows }: { name: string; rows: Row[] }) => {
  if (!rows || rows.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2" style={{ color: C.muted }}>
          <AlertCircle size={16} /> No rows in “{name}”.
        </div>
      </Card>
    );
  }

  const headers = Object.keys(rows[0]);
  const numericCols = headers.filter((h) => isNumericColumn(rows, h));
  const labelCol = headers.find((h) => !numericCols.includes(h)) ?? headers[0];

  // KPIs: totals & averages of first 4 numeric columns
  const kpis = numericCols.slice(0, 4).map((col) => {
    const total = rows.reduce((s, r) => s + toNumber(r[col]), 0);
    const looksMoney = /price|pay|revenue|cost|amount|fee|inr|₹|usd|\$/i.test(col);
    return {
      col,
      total,
      avg: total / rows.length,
      money: looksMoney,
    };
  });

  // Chart data: label col on X, all numeric cols as series, capped to last 30 rows
  const chartData = rows.slice(-30).map((r) => {
    const obj: Record<string, string | number> = { __label: r[labelCol] ?? "" };
    numericCols.forEach((c) => (obj[c] = toNumber(r[c])));
    return obj;
  });

  const palette = [C.sky, C.green, C.amber, C.red, "#A78BFA", "#F472B6"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* KPIs */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <KpiCard
              key={k.col}
              label={k.col}
              value={k.money ? fmtMoney(k.total) : fmtNum(k.total)}
              hint={`avg ${k.money ? fmtMoney(k.avg) : fmtNum(k.avg)} • ${rows.length} rows`}
              icon={[TrendingUp, DollarSign, Users, Activity][i] ?? TrendingUp}
              accent={palette[i]}
            />
          ))}
        </div>
      )}

      {/* Chart */}
      {numericCols.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm uppercase tracking-wider" style={{ color: C.muted }}>
              Trend — {name}
            </h3>
            <span className="text-xs" style={{ color: C.muted }}>
              last {chartData.length} rows
            </span>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              {numericCols.length > 1 ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="__label" stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} fontSize={11} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
                  {numericCols.map((c, i) => (
                    <Line
                      key={c}
                      type="monotone"
                      dataKey={c}
                      stroke={palette[i % palette.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="__label" stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} fontSize={11} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey={numericCols[0]} fill={C.sky} radius={[6, 6, 0, 0]} />
                  <ReferenceLine y={0} stroke={C.border} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm uppercase tracking-wider" style={{ color: C.muted }}>
            Data — {name}
          </h3>
          <span className="text-xs" style={{ color: C.muted }}>
            {rows.length} rows
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 font-medium whitespace-nowrap"
                    style={{ color: C.muted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 200).map((r, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: `1px solid ${C.border}80` }}
                  className="hover:bg-white/[0.02]"
                >
                  {headers.map((h) => (
                    <td
                      key={h}
                      className="px-3 py-2 whitespace-nowrap"
                      style={{ color: C.text }}
                    >
                      {r[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 200 && (
            <div className="text-xs mt-2" style={{ color: C.muted }}>
              Showing first 200 of {rows.length} rows
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

/* ──────────────── Page ──────────────── */
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
  const [activeTab, setActiveTab] = useState<string>("");

  // Auth bootstrap
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u ? { email: u.email } : null);
        if (u) {
          supabase.rpc("is_admin", { _user_id: u.id }).then(({ data }) => {
            setIsAdmin(data === true);
          });
        } else {
          setIsAdmin(false);
        }
      },
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u ? { email: u.email } : null);
      if (u) {
        const { data } = await supabase.rpc("is_admin", { _user_id: u.id });
        setIsAdmin(data === true);
      }
      setAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.functions.invoke("fetch-dashboard-data");
    if (err) {
      setError(err.message);
      toast.error(err.message);
    } else if (data?.error) {
      setError(data.error);
      toast.error(data.error);
    } else {
      const p = data as Payload;
      setPayload(p);
      if (!activeTab && p.tabs.length > 0) setActiveTab(p.tabs[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (err) toast.error(err.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setPayload(null);
  };

  // Aggregate top-level KPIs across all tabs
  const globalKpis = useMemo(() => {
    if (!payload) return [];
    const out: Array<{ label: string; value: string; icon: React.ElementType; accent: string }> = [];
    out.push({
      label: "Sheets Loaded",
      value: String(payload.tabs.length),
      icon: GraduationCap,
      accent: C.sky,
    });
    const totalRows = Object.values(payload.data).reduce((s, r) => s + r.length, 0);
    out.push({
      label: "Total Rows",
      value: fmtNum(totalRows),
      icon: Users,
      accent: C.green,
    });
    out.push({
      label: "Last Sync",
      value: new Date(payload.fetchedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
      }),
      icon: Target,
      accent: C.amber,
    });
    return out;
  }, [payload]);

  /* ── Render gates ── */

  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, sans-serif" }}>
      <Helmet>
        <title>Dashboard — The Intellect Nest</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {children}
    </div>
  );

  if (authChecking) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: C.sky, borderTopColor: "transparent" }}
          />
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
            <p className="text-sm mb-6" style={{ color: C.muted }}>
              Sign in to view business metrics.
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg outline-none"
                style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg outline-none"
                style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: C.sky, color: "#0a1422" }}
              >
                <LogIn size={16} /> {loginLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-sm text-center">
            <AlertCircle className="mx-auto mb-3" color={C.red} size={32} />
            <h1 className="text-xl font-semibold mb-1">Access denied</h1>
            <p className="text-sm mb-4" style={{ color: C.muted }}>
              Your account ({user.email}) is not an admin.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
            >
              Sign out
            </button>
          </Card>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Business OS</h1>
            <p className="text-sm" style={{ color: C.muted }}>
              The Intellect Nest · Live from Google Sheets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && !payload && (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: C.sky, borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-6" >
            <div className="flex items-start gap-3" style={{ color: C.red }}>
              <AlertCircle size={18} />
              <div>
                <div className="font-medium">Failed to load sheet</div>
                <div className="text-sm" style={{ color: C.muted }}>
                  {error}
                </div>
                <div className="text-xs mt-2" style={{ color: C.muted }}>
                  Make sure the sheet is shared as “Anyone with the link · Viewer”
                  and the Google Sheets API key is valid.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {payload && (
          <>
            {/* Global KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {globalKpis.map((k) => (
                <KpiCard key={k.label} {...k} />
              ))}
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 overflow-x-auto mb-6 pb-1"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              {payload.tabs.map((t) => {
                const active = t === activeTab;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="px-4 py-2 text-sm whitespace-nowrap rounded-t-lg transition-colors"
                    style={{
                      color: active ? C.sky : C.muted,
                      borderBottom: active ? `2px solid ${C.sky}` : "2px solid transparent",
                      background: active ? `${C.sky}10` : "transparent",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {t}
                    <span className="ml-2 text-xs" style={{ color: C.muted }}>
                      {payload.data[t]?.length ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <TabView
                key={activeTab}
                name={activeTab}
                rows={payload.data[activeTab] ?? []}
              />
            </AnimatePresence>
          </>
        )}
      </div>
    </PageShell>
  );
};

export default Dashboard;
