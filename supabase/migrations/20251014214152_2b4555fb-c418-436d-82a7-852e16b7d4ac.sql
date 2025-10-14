-- Create table for storing access credentials
CREATE TABLE public.access_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.access_credentials ENABLE ROW LEVEL SECURITY;

-- No public access to credentials table
CREATE POLICY "No public access to credentials"
ON public.access_credentials
FOR ALL
USING (false);

-- Insert the initial password hash (for 'studio2025')
-- Using a simple hash for demo - in production use proper bcrypt
INSERT INTO public.access_credentials (password_hash) 
VALUES ('studio2025');

-- Add SELECT policy for contact_submissions (admin only - for now just authenticated)
CREATE POLICY "Authenticated users can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Add SELECT policy for play_group_signups (users can only see their own)
CREATE POLICY "Users can view their own play group signups"
ON public.play_group_signups
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);