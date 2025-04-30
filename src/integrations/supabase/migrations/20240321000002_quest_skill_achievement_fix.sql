-- Add skill and achievement related columns to quests table if they don't exist
ALTER TABLE quests
ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS skill_xp_reward INTEGER,
ADD COLUMN IF NOT EXISTS achievement_id UUID REFERENCES achievements(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS achievement_xp_reward INTEGER;

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_quests_skill_id ON quests(skill_id);
CREATE INDEX IF NOT EXISTS idx_quests_achievement_id ON quests(achievement_id); 