import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, ChevronsUpDown, Lock, ShieldCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Currency = { code: string; name: string; symbol: string; decimals: number };

const CURRENCIES: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", decimals: 2 },
  { code: "USD", name: "US Dollar", symbol: "$", decimals: 2 },
  { code: "GBP", name: "British Pound", symbol: "£", decimals: 2 },
  { code: "EUR", name: "Euro", symbol: "€", decimals: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimals: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimals: 2 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimals: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", decimals: 2 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", decimals: 2 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", decimals: 3 },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", decimals: 3 },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", decimals: 3 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimals: 0 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", decimals: 2 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimals: 2 },
  { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", decimals: 2 },
  { code: "THB", name: "Thai Baht", symbol: "฿", decimals: 2 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", decimals: 2 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", decimals: 2 },
  { code: "DKK", name: "Danish Krone", symbol: "kr", decimals: 2 },
];

const FN_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callFn(name: string, body: unknown) {
  const res = await fetch(`${FN_BASE}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

let scriptPromise: Promise<boolean> | null = null;
function loadCheckout(): Promise<boolean> {
  if ((window as any).Razorpay) return Promise.resolve(true);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => { scriptPromise = null; resolve(false); };
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

function toUnits(value: string, decimals: number): number | null {
  const re = decimals === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`);
  if (!re.test(value)) return null;
  const [w, f = ""] = value.split(".");
  const n = Number(w + f.padEnd(decimals, "0"));
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

type Result = { status: "success"; paymentId: string; amount: string; currency: Currency } | { status: "cancelled" | "failed" | "unverified" };

const MESSAGES = {
  cancelled: "Payment was not completed.",
  failed: "Payment could not be completed. Please try again.",
  unverified: "We could not confirm this payment. Please try again or contact us.",
};

const Payment = () => {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const units = currency ? toUnits(amount.trim(), currency.decimals) : null;
  const canPay = !!currency && units !== null && !busy;

  const pay = async () => {
    setError("");
    if (!currency) return setError("Please select a currency.");
    if (!amount.trim()) return setError("Please enter an amount.");
    if (units === null) return setError("Please enter a valid amount.");
    if (units < 100) return setError(`Minimum amount is ${currency.symbol}${(100 / 10 ** currency.decimals).toFixed(currency.decimals)}.`);

    setBusy(true);
    try {
      const [loaded, order] = await Promise.all([loadCheckout(), callFn("create-razorpay-order", { amount: amount.trim(), currency: currency.code })]);
      if (!order.ok || !order.data?.order_id) {
        setError(order.data?.error || "Could not start the payment. Please try again.");
        setBusy(false);
        return;
      }
      if (!loaded) {
        setError("Could not load the secure payment window. Please check your connection and try again.");
        setBusy(false);
        return;
      }
      const displayAmount = amount.trim();
      const cur = currency;
      let failed = false;
      const rzp = new (window as any).Razorpay({
        key: order.data.key_id,
        amount: order.data.amount,
        currency: order.data.currency,
        order_id: order.data.order_id,
        name: "The Intellect Nest",
        description: "Secure Online Payment",
        image: `${window.location.origin}/images/logo.webp`,
        theme: { color: "#2B7DD4" },
        handler: async (resp: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setBusy(true);
          try {
            const v = await callFn("verify-razorpay-payment", {
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            });
            if (v.ok && v.data?.verified === true) {
              setResult({ status: "success", paymentId: resp.razorpay_payment_id, amount: displayAmount, currency: cur });
            } else setResult({ status: "unverified" });
          } catch {
            setResult({ status: "unverified" });
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setResult(failed ? { status: "failed" } : { status: "cancelled" });
          },
        },
      });
      rzp.on("payment.failed", () => { failed = true; });
      rzp.open();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setBusy(false);
    }
  };

  const reset = () => { setResult(null); setError(""); };

  return (
    <section className="min-h-[80vh] section-alt chess-grid-bg flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Secure Online Payment | The Intellect Nest</title>
        <meta name="description" content="Make a secure online payment to The Intellect Nest, powered by Razorpay." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="w-full max-w-md bg-card rounded-2xl card-shadow border border-sky-border overflow-hidden">
        <div className="top-gradient-bar" />
        <div className="p-8">
          <div className="text-center mb-8">
            <img src="/images/logo.webp" alt="The Intellect Nest" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold tracking-wide">THE INTELLECT NEST</h1>
            <p className="font-body text-sm text-muted-foreground italic mt-1">Where Knowledge Takes Flight</p>
            <p className="eyebrow mt-5"><Lock className="h-3 w-3" /> Secure Online Payment</p>
          </div>

          {result?.status === "success" ? (
            <div className="text-center space-y-5">
              <CheckCircle2 className="h-14 w-14 mx-auto text-sky" />
              <div>
                <h2 className="text-xl font-bold">Payment Successful</h2>
                <p className="font-body text-sm text-muted-foreground mt-1">Thank you! Your payment has been received successfully.</p>
              </div>
              <dl className="font-body text-sm text-left bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Amount</dt><dd className="font-semibold text-navy">{result.currency.symbol}{result.amount}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Currency</dt><dd className="font-semibold text-navy">{result.currency.code}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Transaction ID</dt><dd className="font-semibold text-navy break-all text-right">{result.paymentId}</dd></div>
              </dl>
              <Link to="/" className="cta-gold w-full">Back to The Intellect Nest</Link>
            </div>
          ) : result ? (
            <div className="text-center space-y-5">
              <XCircle className="h-14 w-14 mx-auto text-destructive" />
              <p className="font-body text-navy">{MESSAGES[result.status]}</p>
              <Button onClick={reset} className="w-full">Try Again</Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button id="currency" type="button" variant="outline" role="combobox" aria-expanded={open}
                      className={cn("w-full justify-between font-body font-normal border-sky-border", !currency && "text-muted-foreground")}>
                      <span className="truncate">{currency ? `${currency.name} — ${currency.code} (${currency.symbol})` : "Select currency"}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandList className="max-h-[260px]">
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                          {CURRENCIES.map((c) => (
                            <CommandItem key={c.code} value={`${c.name} ${c.code}`} onSelect={() => { setCurrency(c); setOpen(false); setError(""); }} className="font-body text-sm">
                              <span className="flex-1">{c.name} — {c.code} ({c.symbol})</span>
                              {currency?.code === c.code && <Check className="h-4 w-4 text-sky" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  {currency && <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground">{currency.symbol}</span>}
                  <Input id="amount" inputMode="decimal" autoComplete="off" placeholder="Enter amount" value={amount}
                    onChange={(e) => { setAmount(e.target.value.replace(/[^\d.]/g, "")); setError(""); }}
                    className={cn("font-body border-sky-border", currency && "pl-12")} />
                </div>
              </div>

              {error && <p role="alert" className="font-body text-sm text-destructive">{error}</p>}

              <Button onClick={pay} disabled={busy} aria-disabled={!canPay} className={cn("w-full h-12 text-base", !canPay && !busy && "opacity-60")}>
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : "Pay Online"}
              </Button>

              <p className="font-body text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-sky" /> Securely powered by Razorpay
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Payment;
