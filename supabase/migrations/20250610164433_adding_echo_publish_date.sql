
-- add publish date column
ALTER TABLE echoes
ADD COLUMN publish_date timestamptz;

-- default is instantly

ALTER TABLE echoes ALTER COLUMN publish_date SET DEFAULT now();

-- creating index for faster queries
CREATE INDEX idx_echoes_publish_date ON echoes (publish_date);