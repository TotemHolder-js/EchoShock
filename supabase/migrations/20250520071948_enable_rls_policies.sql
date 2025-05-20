-- Enable RLS
ALTER TABLE featured_games ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT
CREATE POLICY "Public read access to featured_games"
  ON featured_games
  FOR SELECT
  USING (true);

-- Allow INSERT for admins
CREATE POLICY "Allow insert for admins"
  ON featured_games
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow UPDATE for admins
CREATE POLICY "Allow update for admins"
  ON featured_games
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow DELETE for admins
CREATE POLICY "Allow delete for admins"
  ON featured_games
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );


-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own profile
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);