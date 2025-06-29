-- Insert sample data (optional)
-- Run this to populate your database with sample content

-- Insert sample admin user (username: admin, password: plumber2024)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rQZ9QmjytWzQgwjvHBVzUeQqM8gzIzYxJxJzQzQzQzQzQzQzQzQzQ', 'admin@vodoinstaler-zekic.rs')
ON CONFLICT (username) DO NOTHING;

-- Note: Gallery will be empty initially
-- Add photos through the admin panel at /admin/login
