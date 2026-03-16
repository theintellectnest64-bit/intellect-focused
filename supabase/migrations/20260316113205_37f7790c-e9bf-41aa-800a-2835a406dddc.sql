
-- Create leads table (Book Demo submissions)
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age TEXT NOT NULL,
  current_level TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'English',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table (Contact form submissions)
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form submissions)
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit a contact" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read leads/contacts
CREATE POLICY "Authenticated users can read leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read contacts" ON public.contacts
  FOR SELECT TO authenticated USING (true);

-- Only authenticated users can update leads/contacts (status management)
CREATE POLICY "Authenticated users can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
