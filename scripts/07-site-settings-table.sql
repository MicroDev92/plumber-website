-- Create site_settings table for managing website configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'Vodoinstalater Žekić',
  phone TEXT NOT NULL DEFAULT '+381 60 123 4567',
  email TEXT NOT NULL DEFAULT 'info@vodoinstaler-zekic.rs',
  service_area TEXT NOT NULL DEFAULT 'Beograd i okolina',
  description TEXT NOT NULL DEFAULT 'Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva. Pružamo kvalitetne usluge ugradnje, popravke i održavanja vodovodnih i kanalizacionih sistema.',
  address TEXT DEFAULT 'Beograd, Srbija',
  working_hours TEXT DEFAULT 'Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00',
  emergency_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to site_settings" ON site_settings
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (
  business_name,
  phone,
  email,
  service_area,
  description,
  address,
  working_hours,
  emergency_available
) VALUES (
  'Vodoinstalater Žekić',
  '+381 60 123 4567',
  'info@vodoinstaler-zekic.rs',
  'Beograd i okolina',
  'Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva. Pružamo kvalitetne usluge ugradnje, popravke i održavanja vodovodnih i kanalizacionih sistema.',
  'Beograd, Srbija',
  'Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00',
  true
) ON CONFLICT DO NOTHING;
