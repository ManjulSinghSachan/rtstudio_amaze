-- Create prompts table
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  example_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Prompts are viewable by everyone" 
ON public.prompts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert prompts" 
ON public.prompts 
FOR INSERT 
WITH CHECK (true);