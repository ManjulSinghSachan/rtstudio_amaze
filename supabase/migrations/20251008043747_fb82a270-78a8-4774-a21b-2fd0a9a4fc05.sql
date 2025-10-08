-- Create stories table for Story Board
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_text TEXT NOT NULL,
  attribution TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Everyone can read stories
CREATE POLICY "Stories are viewable by everyone"
  ON public.stories FOR SELECT
  USING (true);

-- Authenticated users can insert their own stories
CREATE POLICY "Authenticated users can insert stories"
  ON public.stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create contact_submissions table for "Reach Out" forms
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can read contact submissions (for now, all authenticated users)
CREATE POLICY "Authenticated users can read contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Anyone can insert contact submissions
CREATE POLICY "Anyone can submit contact forms"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create tool_comments table for Tools section
CREATE TABLE public.tool_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.tool_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
CREATE POLICY "Tool comments are viewable by everyone"
  ON public.tool_comments FOR SELECT
  USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert tool comments"
  ON public.tool_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create play_group_signups table
CREATE TABLE public.play_group_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(tool_name, user_id)
);

ALTER TABLE public.play_group_signups ENABLE ROW LEVEL SECURITY;

-- Everyone can read signups to see interest level
CREATE POLICY "Play group signups are viewable by everyone"
  ON public.play_group_signups FOR SELECT
  USING (true);

-- Authenticated users can manage their own signups
CREATE POLICY "Users can manage their own play group signups"
  ON public.play_group_signups FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);