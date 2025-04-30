-- Add skill and achievement related columns to quests table
ALTER TABLE quests
ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES skills(id),
ADD COLUMN IF NOT EXISTS skill_xp_reward INTEGER,
ADD COLUMN IF NOT EXISTS achievement_id UUID REFERENCES achievements(id),
ADD COLUMN IF NOT EXISTS achievement_xp_reward INTEGER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quests_skill_id ON quests(skill_id);
CREATE INDEX IF NOT EXISTS idx_quests_achievement_id ON quests(achievement_id); 