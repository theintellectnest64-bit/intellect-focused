CREATE POLICY "Anyone can upload payment proof"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admin can read payment proofs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-proofs' AND is_admin(auth.uid()));