CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  about TEXT NOT NULL,
  experience TEXT,
  resume_url TEXT,
  heard_from TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
ON public.applications FOR INSERT
TO public WITH CHECK (true);

CREATE POLICY "Admin can read applications"
ON public.applications FOR SELECT
TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update applications"
ON public.applications FOR UPDATE
TO authenticated USING (is_admin(auth.uid()));

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();