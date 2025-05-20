CREATE TABLE IF NOT EXISTS public.featured_games (
  id          SERIAL       PRIMARY KEY,
  title       TEXT         NOT NULL,
  description TEXT         NOT NULL,
  game_url    TEXT         NOT NULL,
  image_url   TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
