-- Create tables for tracking analytics data
-- Run this script to set up your database

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service VARCHAR(100),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo gallery table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    alt_text VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website analytics table (for custom tracking)
CREATE TABLE IF NOT EXISTS website_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call tracking table (if not using external service)
CREATE TABLE IF NOT EXISTS call_logs (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(50),
    duration INTEGER, -- in seconds
    call_type VARCHAR(20), -- 'inbound', 'outbound'
    status VARCHAR(20), -- 'answered', 'missed', 'voicemail'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_website_analytics_date ON website_analytics(date);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at);
