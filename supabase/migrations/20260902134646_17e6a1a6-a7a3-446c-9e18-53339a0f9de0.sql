CREATE TABLE public.user_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_skills TO authenticated;
GRANT ALL ON public.user_skills TO service_role;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON public.user_skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.skill_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  unlocked boolean NOT NULL DEFAULT false,
  position jsonb DEFAULT '{"x": 0, "y": 0}',
  connected_to jsonb DEFAULT '[]',
  stat_bonuses jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_nodes TO authenticated;
GRANT ALL ON public.skill_nodes TO service_role;
ALTER TABLE public.skill_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skill nodes" ON public.skill_nodes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_skill_nodes_updated_at BEFORE UPDATE ON public.skill_nodes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();