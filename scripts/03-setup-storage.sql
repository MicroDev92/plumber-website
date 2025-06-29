-- Set up Supabase Storage for gallery photos
-- Run this in your Supabase SQL editor

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vodoinstalater-zekic-galerija', 'vodoinstalater-zekic-galerija', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public to view images
CREATE POLICY "Public can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'vodoinstalater-zekic-galerija');

-- Allow uploads to gallery
CREATE POLICY "Allow uploads to gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vodoinstalater-zekic-galerija');

-- Allow deletes from gallery
CREATE POLICY "Allow deletes from gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'vodoinstalater-zekic-galerija');
