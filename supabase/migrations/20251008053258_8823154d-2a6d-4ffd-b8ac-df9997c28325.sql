-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tools are viewable by everyone" 
ON public.tools 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert tools" 
ON public.tools 
FOR INSERT 
WITH CHECK (true);

-- Create tool_notes table for notes functionality
CREATE TABLE public.tool_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id),
  note_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tool notes are viewable by everyone" 
ON public.tool_notes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add notes to tools" 
ON public.tool_notes 
FOR INSERT 
WITH CHECK (true);

-- Insert initial tools data
INSERT INTO public.tools (name, description, url) VALUES
  ('Lovable', 'AI-powered app builder for creating web tools', 'https://lovable.dev'),
  ('Replit', 'Collaborative coding platform', 'https://replit.com'),
  ('Supabase', 'Backend and database for your apps', 'https://supabase.com'),
  ('GitHub', 'Version control and collaboration', 'https://github.com'),
  ('Twilio', 'SMS and communication APIs', 'https://twilio.com'),
  ('Resend', 'Email for developers', 'https://resend.com');