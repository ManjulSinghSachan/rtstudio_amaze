-- Add image_urls column to stories table
ALTER TABLE public.stories 
ADD COLUMN image_urls text[];

-- Create storage bucket for story images
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true);

-- Create storage policies for story images
CREATE POLICY "Story images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-images');

CREATE POLICY "Anyone can upload story images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'story-images');

CREATE POLICY "Anyone can update their own story images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'story-images');