-- Remove public read access from contact_submissions
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON public.contact_submissions;

-- Remove public read access from play_group_signups
DROP POLICY IF EXISTS "Play group signups are viewable by everyone" ON public.play_group_signups;

-- Update play_group_signups policy to exclude SELECT (keep INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Users can manage their own play group signups" ON public.play_group_signups;

CREATE POLICY "Users can insert their own play group signups"
ON public.play_group_signups
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own play group signups"
ON public.play_group_signups
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own play group signups"
ON public.play_group_signups
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);