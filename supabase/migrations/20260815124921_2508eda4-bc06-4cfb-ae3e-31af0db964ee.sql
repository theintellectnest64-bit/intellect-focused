ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS demo_status text NOT NULL DEFAULT 'not_scheduled',
  ADD COLUMN IF NOT EXISTS demo_scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS follow_up_at date,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS source text;

CREATE INDEX IF NOT EXISTS leads_demo_status_idx ON public.leads (demo_status);
CREATE INDEX IF NOT EXISTS leads_follow_up_at_idx ON public.leads (follow_up_at);