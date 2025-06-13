
-- Add a column that stores which echo is currently pinned
ALTER TABLE public.echoes
ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure only one echo can be pinned at a time
CREATE UNIQUE INDEX ON public.echoes (pinned)
WHERE pinned = TRUE;