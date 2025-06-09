-- Create game-images only if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'game-images', 'game-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'game-images'
);

-- Create echo-images only if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'echo-images', 'echo-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'echo-images'
);


-- Allow only admins to INSERT into game-images
CREATE POLICY allow_admin_uploads_to_game_images
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'game-images'
    AND EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = TRUE
    )
  );

-- Allow only admins to INSERT into echo-images
CREATE POLICY allow_admin_uploads_to_echo_images
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'echo-images'
    AND EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = TRUE
    )
  );

