-- Function to auto-set glade_entry and glade_exit
CREATE OR REPLACE FUNCTION set_glade_dates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.glade_entry := (
    NEW.created_at + ((5 - EXTRACT(DOW FROM NEW.created_at) + 7) % 7) * interval '1 day'
  )::date + interval '12 hours';

  NEW.glade_exit := (
    NEW.created_at + ((5 - EXTRACT(DOW FROM NEW.created_at) + 7) % 7) * interval '1 day'
    + interval '6 days'
  )::date + interval '18 hours';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on insert to featured_games
DROP TRIGGER IF EXISTS trigger_set_glade_dates ON featured_games;

CREATE TRIGGER trigger_set_glade_dates
BEFORE INSERT ON featured_games
FOR EACH ROW
EXECUTE FUNCTION set_glade_dates();
