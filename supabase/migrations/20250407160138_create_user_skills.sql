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

-- Create RLS policies
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
  ON user_skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
