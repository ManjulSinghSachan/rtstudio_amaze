-- Solution definitions: canonical registry of all solution keys
CREATE TABLE public.solution_definitions (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.solution_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solution definitions are viewable by everyone" ON public.solution_definitions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert solution definitions" ON public.solution_definitions FOR INSERT WITH CHECK (true);

-- Match: find issues that my profile's solutions can help with
CREATE OR REPLACE FUNCTION public.match_issues_to_profile(p_user_id UUID)
RETURNS SETOF public.issues
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT i.* FROM issues i, profiles p
  WHERE p.id = p_user_id
    AND i.tags && p.solutions
    AND i.status = 'open'
    AND i.user_id != p_user_id
  ORDER BY i.created_at DESC;
$$;

-- Match: find profiles whose solutions overlap with an issue's tags
CREATE OR REPLACE FUNCTION public.match_profiles_to_issue(p_issue_id UUID)
RETURNS SETOF public.profiles
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT p.* FROM profiles p, issues i
  WHERE i.id = p_issue_id
    AND p.solutions && i.tags
    AND p.id != i.user_id
  ORDER BY p.display_name;
$$;

-- Match: find spaces whose solutions overlap with an issue's tags
CREATE OR REPLACE FUNCTION public.match_spaces_to_issue(p_issue_id UUID)
RETURNS SETOF public.spaces
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT s.* FROM spaces s, issues i
  WHERE i.id = p_issue_id
    AND s.solutions && i.tags
  ORDER BY s.name;
$$;

-- Generic search: given solution keys, return matching issues/profiles/spaces
CREATE OR REPLACE FUNCTION public.search_by_solutions(p_keys text[])
RETURNS TABLE(
  match_type TEXT,
  match_id UUID,
  match_name TEXT,
  matched_keys text[]
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT 'issue'::TEXT, i.id, i.title,
    ARRAY(SELECT unnest(i.tags) INTERSECT SELECT unnest(p_keys))
  FROM issues i WHERE i.tags && p_keys AND i.status = 'open'
  UNION ALL
  SELECT 'profile'::TEXT, p.id, COALESCE(p.display_name, p.full_name, p.email),
    ARRAY(SELECT unnest(p.solutions) INTERSECT SELECT unnest(p_keys))
  FROM profiles p WHERE p.solutions && p_keys
  UNION ALL
  SELECT 'space'::TEXT, s.id, s.name,
    ARRAY(SELECT unnest(s.solutions) INTERSECT SELECT unnest(p_keys))
  FROM spaces s WHERE s.solutions && p_keys
  ORDER BY match_type, match_name;
$$;
