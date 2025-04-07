
import { supabase } from '@/lib/supabase';
import { UserSkill, SkillName, SKILL_DEFINITIONS } from '@/types/skills';
import { toast } from 'sonner';

export async function fetchUserSkills(userId: string): Promise<UserSkill[]> {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }

  return data || [];
}

export async function initializeUserSkills(userId: string): Promise<void> {
  const existingSkills = await fetchUserSkills(userId);
  
  if (existingSkills.length > 0) {
    return; // Skills already initialized
  }

  const skillsToCreate = Object.keys(SKILL_DEFINITIONS).map(skillName => ({
    user_id: userId,
    skill_name: skillName,
    xp: 0
  }));

  const { error } = await supabase
    .from('user_skills')
    .insert(skillsToCreate);

  if (error) {
    console.error('Error initializing user skills:', error);
    throw error;
  }
}

export async function updateSkillXP(
  userId: string,
  skillName: SkillName,
  xpChange: number
): Promise<UserSkill> {
  // First get current XP
  const { data: currentSkill, error: fetchError } = await supabase
    .from('user_skills')
    .select('xp')
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .single();

  if (fetchError) {
    console.error('Error fetching skill XP:', fetchError);
    throw fetchError;
  }

  const newXP = Math.max(0, (currentSkill?.xp || 0) + xpChange);

  const { data, error: updateError } = await supabase
    .from('user_skills')
    .update({ xp: newXP })
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating skill XP:', updateError);
    throw updateError;
  }

  return data;
}

export function calculateLevel(xp: number): number {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  // This means:
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP
  // And so on...
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function calculateXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return nextLevelXP;
}

export function getSkillLevelInfo(xp: number) {
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
}
