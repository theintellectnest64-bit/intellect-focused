ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS phone_country text;