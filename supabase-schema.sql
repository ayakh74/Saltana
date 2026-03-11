-- Saltana Restaurant — Supabase Schema
-- Run this in your Supabase SQL editor

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 100),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a reservation
CREATE POLICY "Allow public insert" ON reservations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated (admin) can view all reservations
CREATE POLICY "Allow authenticated read" ON reservations
  FOR SELECT TO authenticated
  USING (true);

-- Index for date queries
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations (date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations (status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
