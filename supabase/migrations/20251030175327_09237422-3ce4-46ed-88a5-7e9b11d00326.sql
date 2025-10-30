-- Add full_story_text column to stories table for expandable content
ALTER TABLE public.stories 
ADD COLUMN full_story_text TEXT;

-- Add an index for better query performance
CREATE INDEX idx_stories_has_full_text ON public.stories ((full_story_text IS NOT NULL));