-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, skill_name)
);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own skills" ON user_skills;
DROP POLICY IF EXISTS "Users can update their own skills" ON user_skills;
DROP POLICY IF EXISTS "Users can insert their own skills" ON user_skills;

-- Create RLS policies
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Policy for selecting skills
CREATE POLICY "Users can view their own skills"
  ON user_skills 
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  );

-- Policy for updating skills
CREATE POLICY "Users can update their own skills"
  ON user_skills 
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  );

-- Policy for inserting skills
CREATE POLICY "Users can insert their own skills"
  ON user_skills 
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update skill XP in a single query
CREATE OR REPLACE FUNCTION update_skill_xp(
  p_user_id UUID,
  p_skill_name TEXT,
  p_xp_change INTEGER
)
RETURNS user_skills AS $$
DECLARE
  result user_skills;
  current_auth_uid UUID;
BEGIN
  -- Get current authenticated user ID
  current_auth_uid := auth.uid();
  
  -- Check if user is authenticated
  IF current_auth_uid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated' USING ERRCODE = '42501';
  END IF;

  -- Check if user is authorized
  IF current_auth_uid != p_user_id THEN
    RAISE EXCEPTION 'Cannot update skills for another user' USING ERRCODE = '42501';
  END IF;

  -- Update XP and return the updated record
  UPDATE user_skills
  SET xp = GREATEST(0, xp + p_xp_change)
  WHERE user_id = p_user_id 
    AND skill_name = p_skill_name
  RETURNING * INTO result;

  -- Check if update was successful
  IF result IS NULL THEN
    RAISE EXCEPTION 'Skill not found' USING ERRCODE = '42501';
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
