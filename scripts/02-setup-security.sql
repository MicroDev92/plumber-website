-- Row Level Security setup
-- Run this AFTER the first script

-- Enable RLS on all tables
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact inquiries
CREATE POLICY "Allow public to insert contact inquiries" ON contact_inquiries
    FOR INSERT WITH CHECK (true);

-- Allow public to view published gallery photos
CREATE POLICY "Allow public to view gallery photos" ON gallery_photos
    FOR SELECT USING (true);

-- Allow public to insert page views for analytics
CREATE POLICY "Allow public to insert page views" ON page_views
    FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access - contact_inquiries" ON contact_inquiries
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access - gallery_photos" ON gallery_photos
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access - page_views" ON page_views
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access - admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');
