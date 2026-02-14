-- Add solutions column to profiles
ALTER TABLE public.profiles ADD COLUMN solutions text[];

-- Issues table: structured user needs
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags text[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issues are viewable by everyone" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Users can insert own issues" ON public.issues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own issues" ON public.issues FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own issues" ON public.issues FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_issues_tags ON public.issues USING GIN (tags);
CREATE INDEX idx_issues_user_id ON public.issues (user_id);
CREATE INDEX idx_issues_status ON public.issues (status);

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Spaces table: matching hub
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  solutions text[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spaces are viewable by everyone" ON public.spaces FOR SELECT USING (true);
CREATE POLICY "Anyone can create spaces" ON public.spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Creator can update own spaces" ON public.spaces FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creator can delete own spaces" ON public.spaces FOR DELETE USING (auth.uid() = created_by);

CREATE INDEX idx_spaces_solutions ON public.spaces USING GIN (solutions);

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- GIN index on profiles.solutions for matching queries
CREATE INDEX idx_profiles_solutions ON public.profiles USING GIN (solutions);
