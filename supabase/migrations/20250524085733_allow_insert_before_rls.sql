DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

CREATE POLICY "Allow public select username"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to profiles"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
