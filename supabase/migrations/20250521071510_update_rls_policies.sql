-- 1) Featured Games
ALTER TABLE public.featured_games 
  ENABLE ROW LEVEL SECURITY;

-- Anyone (even guests) can read
DROP POLICY IF EXISTS "Public read access to featured_games" ON public.featured_games;
CREATE POLICY "Public read access to featured_games"
  ON public.featured_games
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated admins can INSERT
DROP POLICY IF EXISTS "Allow insert for admins" ON public.featured_games;
CREATE POLICY "Admins can insert featured_games"
  ON public.featured_games
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

-- Only authenticated admins can UPDATE
DROP POLICY IF EXISTS "Allow update for admins" ON public.featured_games;
CREATE POLICY "Admins can update featured_games"
  ON public.featured_games
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

-- Only authenticated admins can DELETE
DROP POLICY IF EXISTS "Allow delete for admins" ON public.featured_games;
CREATE POLICY "Admins can delete featured_games"
  ON public.featured_games
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


-- 2) Profiles
ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do anything (SELECT/INSERT/UPDATE/DELETE) on their own row
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
