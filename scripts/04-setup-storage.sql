-- Set up Supabase Storage policies for gallery photos
-- Run this in your Supabase SQL editor

-- Create storage policy to allow public uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vodoinstalater-zekic-galerija', 'vodoinstalater-zekic-galerija', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public to view images
CREATE POLICY "Public can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'vodoinstalater-zekic-galerija');

-- Allow authenticated users to upload images (you can adjust this)
CREATE POLICY "Allow uploads to gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vodoinstalater-zekic-galerija');

-- Allow authenticated users to delete images
CREATE POLICY "Allow deletes from gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'vodoinstalater-zekic-galerija');
