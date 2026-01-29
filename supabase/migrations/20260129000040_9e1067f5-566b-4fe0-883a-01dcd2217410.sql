-- Fix 1: Remove public SELECT access to contact_submissions (privacy issue)
DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON contact_submissions;

-- Fix 2: Update award_serviceberries function with authorization checks
CREATE OR REPLACE FUNCTION public.award_serviceberries(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Only allow awarding to the authenticated user (prevent impersonation)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to award serviceberries';
  END IF;
  
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot award serviceberries to other users';
  END IF;
  
  -- Validate amount is reasonable (prevent abuse)
  IF p_amount <= 0 OR p_amount > 100 THEN
    RAISE EXCEPTION 'Invalid serviceberry amount: must be between 1 and 100';
  END IF;
  
  -- Validate reason is from allowed list
  IF p_reason NOT IN ('commitment_made', 'commitment_completed', 'profile_setup', 'story_shared', 'prompt_shared', 'tool_shared') THEN
    RAISE EXCEPTION 'Invalid serviceberry reason';
  END IF;

  INSERT INTO public.serviceberries (user_id, amount, reason, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 3: Update storage policies to require authentication and user folder structure
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload story images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own story images" ON storage.objects;

-- Create more restrictive policies requiring authentication
CREATE POLICY "Authenticated users can upload story images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'story-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own story images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'story-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own story images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'story-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );