import { supabase } from '@/integrations/supabase/client';
import { UserSkill, SkillName, SKILL_DEFINITIONS } from '@/types/skills';
import { toast } from 'sonner';

export const fetchUserSkills = async (userId: string): Promise<UserSkill[]> => {
  console.log('Fetching skills for user:', userId);
  
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }

  console.log('Fetched skills:', data?.length || 0);
  return data || [];
};

export const initializeUserSkills = async (userId: string): Promise<void> => {
  console.log('Initializing skills for user:', userId);

  const defaultSkills = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
    'crafting',
    'cooking',
    'gardening',
    'fitness',
    'meditation',
    'learning'
  ];

  const skillsToInsert = defaultSkills.map(skill => ({
    user_id: userId,
    skill_name: skill,
    xp: 0
  }));

  console.log('Attempting to insert skills:', skillsToInsert.length);

  const { error } = await supabase
    .from('user_skills')
    .insert(skillsToInsert);

  if (error) {
    console.error('Error initializing skills:', error);
    if (error.code === '42501') { // Permission denied
      throw new Error('User must be authenticated');
    } else if (error.code === '23505') { // Unique violation
      console.log('Skills already exist, ignoring');
      return;
    }
    throw error;
  }

  console.log('Successfully initialized skills');
};

export const updateSkillXP = async (
  userId: string,
  skillName: SkillName,
  xpAmount: number
): Promise<UserSkill> => {
  console.log('Updating skill XP:', { userId, skillName, xpAmount });

  // First get current XP
  const { data: currentSkill, error: fetchError } = await supabase
    .from('user_skills')
    .select('xp')
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .single();

  if (fetchError) {
    console.error('Error fetching current XP:', fetchError);
    throw fetchError;
  }

  const newXP = Math.max(0, (currentSkill?.xp || 0) + xpAmount);

  const { data, error } = await supabase
    .from('user_skills')
    .update({ xp: newXP })
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .select()
    .single();

  if (error) {
    console.error('Error updating skill XP:', error);
    if (error.code === '42501') {
      throw new Error('User must be authenticated');
    }
    throw error;
  }

  return data;
};

export const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  // This means:
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP
  // And so on...
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return nextLevelXP;
};

export const getSkillLevelInfo = (xp: number) => {
  const level = calculateLevel(xp);
  const nextLevelXP = calculateXPForNextLevel(xp);
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const progress = (xp - xpForCurrentLevel) / (nextLevelXP - xpForCurrentLevel);

  return {
    level,
    currentXP: xp,
    nextLevelXP,
    progress: Math.min(1, Math.max(0, progress))
  };
};

export const createSkill = async (
  userId: string,
  skillData: {
    skill_name: SkillName;
    description: string;
    primary_stat: string;
    xp: number;
  }
): Promise<UserSkill> => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert({
      user_id: userId,
      ...skillData
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating skill:', error);
    throw error;
  }

  return data;
};

export const updateSkillDefinition = async (
  userId: string,
  skillName: SkillName,
  updates: {
    name?: string;
    description?: string;
    primaryStat?: string;
  }
): Promise<UserSkill> => {
  const { data, error } = await supabase
    .from('user_skills')
    .update({
      skill_name: updates.name || undefined,
      description: updates.description || undefined,
      primary_stat: updates.primaryStat || undefined
    })
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .select()
    .single();

  if (error) {
    console.error('Error updating skill:', error);
    throw error;
  }

  return data;
};

export const deleteSkill = async (
  userId: string,
  skillName: SkillName
): Promise<void> => {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', userId)
    .eq('skill_name', skillName);

  if (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};
