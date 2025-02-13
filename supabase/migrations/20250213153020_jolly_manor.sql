/*
  # Create furniture table

  1. New Tables
    - `furniture`
      - `id` (uuid, primary key)
      - `name` (text)
      - `length` (numeric)
      - `width` (numeric)
      - `height` (numeric)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `furniture` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS furniture (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  length numeric NOT NULL,
  width numeric NOT NULL,
  height numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON furniture
  FOR SELECT
  TO public
  USING (true);