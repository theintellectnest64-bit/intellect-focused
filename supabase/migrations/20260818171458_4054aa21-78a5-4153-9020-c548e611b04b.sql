ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'Pending Verification',
  ADD COLUMN IF NOT EXISTS amount_paid numeric,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS receipt_number text,
  ADD COLUMN IF NOT EXISTS class_schedule text,
  ADD COLUMN IF NOT EXISTS assigned_coach text,
  ADD COLUMN IF NOT EXISTS sessions_total text,
  ADD COLUMN IF NOT EXISTS payment_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_email_status text NOT NULL DEFAULT 'not_sent',
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_email_error text,
  ADD COLUMN IF NOT EXISTS confirmation_email_attempts integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_receipt_number_key
  ON public.enrollments (receipt_number) WHERE receipt_number IS NOT NULL;

CREATE SEQUENCE IF NOT EXISTS public.receipt_number_seq;

CREATE OR REPLACE FUNCTION public.assign_receipt_number(_enrollment_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing text;
  candidate text;
BEGIN
  SELECT receipt_number INTO existing FROM public.enrollments WHERE id = _enrollment_id FOR UPDATE;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;

  LOOP
    candidate := 'TIN-' || to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYY') || '-' ||
                 lpad(nextval('public.receipt_number_seq')::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.enrollments WHERE receipt_number = candidate);
  END LOOP;

  UPDATE public.enrollments SET receipt_number = candidate WHERE id = _enrollment_id;
  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_receipt_number(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.assign_receipt_number(uuid) TO service_role;