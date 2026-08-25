GRANT DELETE ON public.leads TO authenticated;

CREATE POLICY "Admin can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
