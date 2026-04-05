-- Phase 4 schema additions: avatar URL for profiles, cover image/location for events, storage buckets

-- Add avatar_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add new columns to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE events ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-covers', 'event-covers', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for avatars bucket
CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage RLS policies for event-covers bucket
CREATE POLICY "Authenticated users can upload event covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-covers');

CREATE POLICY "Event covers are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'event-covers');
