
-- Admin notes table for CRM
CREATE TABLE public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type text NOT NULL CHECK (record_type IN ('lead', 'contact')),
  record_id uuid NOT NULL,
  note text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_admin_notes_record ON public.admin_notes(record_type, record_id);

-- Enable RLS
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Only admins can CRUD notes
CREATE POLICY "Admin can read notes"
  ON public.admin_notes FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can insert notes"
  ON public.admin_notes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin can delete notes"
  ON public.admin_notes FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));
