-- Enable RLS
ALTER TABLE public.echoes
  ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read access to echoes" ON public.echoes;
CREATE POLICY "Public read access to echoes"
  ON public.echoes
  FOR SELECT
  TO public
  USING (true);

-- Admins can INSERT
DROP POLICY IF EXISTS "Admins can insert echoes" ON public.echoes;
CREATE POLICY "Admins can insert echoes"
  ON public.echoes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = TRUE
    )
  );

-- Admins can UPDATE
DROP POLICY IF EXISTS "Admins can update echoes" ON public.echoes;
CREATE POLICY "Admins can update echoes"
  ON public.echoes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = TRUE
    )
  );

-- Admins can DELETE
DROP POLICY IF EXISTS "Admins can delete echoes" ON public.echoes;
CREATE POLICY "Admins can delete echoes"
  ON public.echoes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = TRUE
    )
  );
