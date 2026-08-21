CREATE OR REPLACE FUNCTION public.assign_receipt_number(_enrollment_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing text;
  candidate text;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  suffix text;
  i int;
BEGIN
  SELECT receipt_number INTO existing FROM public.enrollments WHERE id = _enrollment_id FOR UPDATE;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;

  LOOP
    suffix := '';
    FOR i IN 1..5 LOOP
      suffix := suffix || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;

    candidate := 'TIN-' || to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYY-MMDD') || '-' || suffix;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.enrollments WHERE receipt_number = candidate);
  END LOOP;

  UPDATE public.enrollments SET receipt_number = candidate WHERE id = _enrollment_id;
  RETURN candidate;
END;
$function$;