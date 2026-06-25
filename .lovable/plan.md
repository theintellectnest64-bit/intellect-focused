
## Goal
Stop calling `sheets.googleapis.com` from the browser with a hardcoded API key. Route all Sheets reads through the existing `fetch-dashboard-data` edge function (which already uses the `GOOGLE_SHEETS_API_KEY` secret). Run a smoke test first (Students + Payments + revenue total). If it works, reconnect the full dashboard. Disable AI Advisor.

## Changes

### 1. Edge function `supabase/functions/fetch-dashboard-data/index.ts`
- Add `CoachPayouts` to `DASHBOARD_RANGES` (e.g. `CoachPayouts!A3:E203`).
- Change all ranges from `A4:` to `A3:` so row 3 headers (`Month`, `Received`, `Student Name`, `Coach Name`, `Month Earned`, etc.) are returned — the dashboard's `parse()` keys off header names.
- Drop the admin-only gate. Keep the JWT check (`getClaims`) so only logged-in `/dashboard` users can call it, but remove the `is_admin` RPC requirement — the dashboard login isn't admin-scoped.
- Keep response shape: `{ data: { Payments: [...], Students: [...], ... } }` where each row is an object keyed by header.

### 2. `public/dashboard.html`
- Remove hardcoded `KEY` constant and the direct `https://sheets.googleapis.com/...` fetch.
- Replace `fSheet(range)` + `fetchAll()` so it:
  1. Reads the Supabase session via the global `supabase` client (inject a small loader at top of file using the project's anon key + URL, OR pass the access token into the iframe via `postMessage` from `Dashboard.tsx`). Preferred: have `Dashboard.tsx` post the access token to the iframe on load; the HTML stores it and sends `Authorization: Bearer <token>` + `apikey` header to the edge function.
  2. Calls `POST https://wvkntaznabhzdogxnwzg.supabase.co/functions/v1/fetch-dashboard-data` once.
  3. Splits the returned `data` object into `D.pay / D.exp / D.coach / D.stu / D.ads / D.payouts`.
- **Smoke-test mode first**: before re-enabling the full render, show a small panel at the top of the dashboard with:
  - `Students rows: N`
  - `Payments rows: N`
  - `Total Revenue (sum of Received): ₹X`
  - Only after this renders correctly do we call `renderAll()` (kept behind a `SMOKE_TEST=false` flag flipped in a follow-up step).
- Fix any stray literal-newline strings (`.join(' \n ')` style) to `.join('\n')` / `.split('\n')`.
- **AI Advisor**: hide the nav button (line 263) and short-circuit the `api.anthropic.com` fetch (line 1382) with an early `return` + "Disabled" message. No key is sent from the browser.

### 3. `src/pages/Dashboard.tsx`
- After login, get the current session's `access_token` and pass it to the iframe via `iframe.onload = () => iframe.contentWindow.postMessage({ type: 'auth', token, url, anonKey }, '*')`. The HTML listens for this once and then runs `fetchAll()`.

## Technical notes
- No new secrets needed — `GOOGLE_SHEETS_API_KEY` already exists.
- Edge function CORS already permits `*`.
- Keeping the HTML as a static file (per prior instructions, do not convert to React).
- After smoke test passes (user confirms the 3 numbers look right), I'll flip `SMOKE_TEST=false` in a follow-up turn to re-enable charts/tables.

## Out of scope
- Not touching `Dashboard.tsx` login UI.
- Not modifying `send-notification` or any other function.
- Not changing admin RPC or RLS — just removing the admin gate on this one read-only proxy.
