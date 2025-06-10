
-- Add columns to table that determine Glade status
ALTER TABLE featured_games
ADD COLUMN glade_entry timestamptz,
ADD COLUMN glade_exit timestamptz;

-- Calculate Glade entry and Glade exit dates
UPDATE featured_games
SET
  glade_entry = (
    created_at + ((5 - EXTRACT(DOW FROM created_at) + 7) % 7) * interval '1 day'
  )::date + interval '12 hours',
  glade_exit = (
    created_at + ((5 - EXTRACT(DOW FROM created_at) + 7) % 7) * interval '1 day'
    + interval '6 days'
  )::date + interval '18 hours';
