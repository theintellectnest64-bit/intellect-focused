CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number text NOT NULL UNIQUE,
  plan text NOT NULL,
  custom_plan_note text,
  rubiks_addon boolean NOT NULL DEFAULT false,
  student_name text NOT NULL,
  student_dob date NOT NULL,
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  guardian_whatsapp text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  student_whatsapp text,
  alternate_phone text,
  chess_id text,
  preferred_timezone text,
  preferred_coach text NOT NULL DEFAULT 'Not sure — assign for me',
  notes text,
  student_counsellor text NOT NULL DEFAULT 'Harshit',
  payment_type text NOT NULL,
  balance_amount text,
  payment_date date NOT NULL,
  transaction_id text NOT NULL,
  payment_proof_url text,
  payment_note text,
  status text NOT NULL DEFAULT 'Pending Review',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.enrollments TO anon;
GRANT SELECT, INSERT, UPDATE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enrollment"
ON public.enrollments FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can read enrollments"
ON public.enrollments FOR SELECT TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update enrollments"
ON public.enrollments FOR UPDATE TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();