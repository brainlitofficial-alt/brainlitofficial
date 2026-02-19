-- Create webinar_settings table in Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create the webinar_settings table
CREATE TABLE webinar_settings (
  id BIGSERIAL PRIMARY KEY,
  next_webinar_date TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE webinar_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow reads for everyone (to display on landing page)
CREATE POLICY "Allow public reads" ON webinar_settings
  FOR SELECT
  TO anon
  USING (true);

-- Create a policy to allow reads for authenticated users
CREATE POLICY "Allow authenticated reads" ON webinar_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy to allow inserts and updates for anon (admin uses anon key)
CREATE POLICY "Allow anon updates" ON webinar_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert a default webinar date (you can change this)
INSERT INTO webinar_settings (next_webinar_date) 
VALUES (NOW() + INTERVAL '7 days');

-- Note: This table will only have one row.
-- The admin dashboard will update this single row.
