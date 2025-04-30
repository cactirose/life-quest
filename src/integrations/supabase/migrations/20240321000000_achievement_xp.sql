-- Add XP-related columns to achievements table
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS required_xp INTEGER NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS current_xp INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_per_completion INTEGER NOT NULL DEFAULT 100;

-- Update existing achievements to have default XP values
UPDATE achievements
SET required_xp = 100,
    current_xp = 0,
    xp_per_completion = 100
WHERE required_xp IS NULL; 