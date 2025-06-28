-- Production database setup for Supabase
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service VARCHAR(100),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    alt_text VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page views table for analytics
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    visitor_id VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: plumber2024)
-- You should change this password in production
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2b$10$rQZ9QmjytWzQgwjvHBVzUeQqM8gzIzYxJxJzQzQzQzQzQzQzQzQzQ', 'admin@vodoinstaler-zekic.rs')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

-- Row Level Security policies
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact inquiries
CREATE POLICY "Allow public to insert contact inquiries" ON contact_inquiries
    FOR INSERT WITH CHECK (true);

-- Allow public to view gallery photos
CREATE POLICY "Allow public to view gallery photos" ON gallery_photos
    FOR SELECT USING (true);

-- Allow public to insert page views
CREATE POLICY "Allow public to insert page views" ON page_views
    FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to implement proper auth)
CREATE POLICY "Allow service role full access to all tables" ON contact_inquiries
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to gallery" ON gallery_photos
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to page views" ON page_views
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to admin users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');
