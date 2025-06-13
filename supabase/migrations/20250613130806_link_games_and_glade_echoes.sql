-- Link games to their glade echo (echo.id is UUID)
ALTER TABLE public.featured_games
ADD COLUMN glade UUID REFERENCES public.echoes(id);

-- Store selected games on an echo
ALTER TABLE public.echoes
ADD COLUMN game_ids INTEGER[];