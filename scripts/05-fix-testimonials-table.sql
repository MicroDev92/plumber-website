-- Fix testimonials table structure
-- Run this in your Supabase SQL editor

-- Drop the table if it exists and recreate with correct structure
DROP TABLE IF EXISTS testimonials CASCADE;

-- Create testimonials table with proper structure
CREATE TABLE testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    service VARCHAR(100),
    location VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public to view published testimonials
CREATE POLICY "Allow public to view published testimonials" ON testimonials
    FOR SELECT USING (is_published = true);

-- Service role has full access
CREATE POLICY "Service role full access - testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'service_role');

-- Insert some sample testimonials for testing
INSERT INTO testimonials (name, text, rating, service, location, is_featured, is_published) VALUES
('Marko Petrović', 'Odličan rad! Brzo i profesionalno rešena hitna intervencija. Preporučujem svima!', 5, 'Hitna intervencija', 'Novi Beograd', true, true),
('Ana Jovanović', 'Renovirali su mi kompletno kupatilo. Rad je završen u dogovorenom roku i kvalitet je vrhunski.', 5, 'Renoviranje kupatila', 'Zemun', true, true),
('Stefan Nikolić', 'Profesionalna ugradnja sudopera. Čist rad, bez problema. Definitivno ću ih ponovo angažovati.', 4, 'Ugradnja sanitarija', 'Voždovac', false, true);
