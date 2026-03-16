
-- Create admin check function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
    AND email = 'theintellectnest64@gmail.com'
  )
$$;

-- Drop overly permissive policies
DROP POLICY "Authenticated users can read leads" ON public.leads;
DROP POLICY "Authenticated users can read contacts" ON public.contacts;
DROP POLICY "Authenticated users can update leads" ON public.leads;
DROP POLICY "Authenticated users can update contacts" ON public.contacts;

-- Recreate with admin-only access
CREATE POLICY "Admin can read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can read contacts" ON public.contacts
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
