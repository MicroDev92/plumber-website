-- Insert sample data (optional)
-- Run this to populate your database with sample content

-- Insert sample gallery photos
INSERT INTO gallery_photos (title, description, image_url, alt_text, is_featured) VALUES
('Renoviranje kupatila', 'Kompletna renovacija kupatila sa modernim sanitarijama', '/placeholder.svg?height=300&width=400', 'Renovirano kupatilo', true),
('Ugradnja kuhinjskog sudopera', 'Profesionalna ugradnja novog sudopera u kuhinji', '/placeholder.svg?height=300&width=400', 'Kuhinjski sudoper', false),
('Popravka cevi', 'Hitna intervencija - popravka pucanja glavne cevi', '/placeholder.svg?height=300&width=400', 'Popravka cevi', false),
('Ugradnja bojlera', 'Ugradnja novog protočnog bojlera', '/placeholder.svg?height=300&width=400', 'Novi bojler', true),
('Čišćenje odvoda', 'Profesionalno čišćenje začepljenog odvoda', '/placeholder.svg?height=300&width=400', 'Čišćenje odvoda', false),
('Instalacija za mašinu za pranje', 'Nova instalacija za mašinu za pranje veša', '/placeholder.svg?height=300&width=400', 'Instalacija za mašinu', false)
ON CONFLICT DO NOTHING;

-- Insert sample admin user (username: admin, password: plumber2024)
-- Note: In production, you should use a proper password hashing library
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rQZ9QmjytWzQgwjvHBVzUeQqM8gzIzYxJxJzQzQzQzQzQzQzQzQzQ', 'admin@vodoinstaler-zekic.rs')
ON CONFLICT (username) DO NOTHING;

-- Insert some sample contact inquiries for testing
INSERT INTO contact_inquiries (name, email, phone, service, message, status) VALUES
('Marko Petrović', 'marko@example.com', '+381 60 111 2222', 'Hitna intervencija', 'Pukla mi je cev u kupatilu, potrebna je hitna intervencija.', 'pending'),
('Ana Jovanović', 'ana@example.com', '+381 60 333 4444', 'Renoviranje kupatila', 'Želim da renoviram kupatilo, molim za predračun.', 'pending'),
('Stefan Nikolić', 'stefan@example.com', '+381 60 555 6666', 'Ugradnja', 'Potrebna mi je ugradnja novog sudopera u kuhinji.', 'completed')
ON CONFLICT DO NOTHING;
