import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCharacter } from '@/contexts/CharacterContext';
import { UserSkill, SkillName, SKILL_DEFINITIONS } from '@/types/skills';
import * as skillService from '@/services/skillService';
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';

export interface SkillProgress {
  name: SkillName;
  xp: number;
  level: number;
  progress: number;
  nextLevelXP: number;
}

export function useGrowthSystem() {
  const { user } = useAuth();
  const { character, updateStats } = useCharacter();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial skills data
  useEffect(() => {
    async function initializeSkills() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        await skillService.initializeUserSkills(user.id);
        const userSkills = await skillService.fetchUserSkills(user.id);
        setSkills(userSkills);
      } catch (err) {
        setError(err as Error);
        toast.error('Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    }

    initializeSkills();
  }, [user]);

  // Debounced function to update character stats based on skill levels
  const updateCharacterStats = useCallback(
    debounce(async (skillsData: UserSkill[]) => {
      if (!character) return;

      // Calculate stat bonuses based on skill levels
      const statBonuses = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      };

      skillsData.forEach(skill => {
        const definition = SKILL_DEFINITIONS[skill.skill_name as SkillName];
        if (definition) {
          const level = skillService.calculateLevel(skill.xp);
          // Each skill level adds +1 to its primary stat
          statBonuses[definition.primaryStat] += Math.floor(level / 2);
        }
      });

      // Update character stats with bonuses
      const newStats = { ...character.stats };
      Object.entries(statBonuses).forEach(([stat, bonus]) => {
        newStats[stat] = Math.max(10, character.stats[stat] + bonus);
      });

      await updateStats(newStats);
    }, 1000),
    [character, updateStats]
  );

  // Update skills XP and trigger stat recalculation
  const addSkillXP = useCallback(async (
    skillName: SkillName,
    xpAmount: number
  ) => {
    if (!user) return;

    try {
      const updatedSkill = await skillService.updateSkillXP(
        user.id,
        skillName,
        xpAmount
      );

      setSkills(prevSkills => {
        const newSkills = prevSkills.map(skill =>
          skill.skill_name === skillName ? updatedSkill : skill
        );
        
        // Trigger stat update
        updateCharacterStats(newSkills);
        
        return newSkills;
      });

      const { level } = skillService.getSkillLevelInfo(updatedSkill.xp);
      toast.success(`${skillName} increased! (Level ${level})`);
    } catch (err) {
      console.error('Error updating skill XP:', err);
      toast.error('Failed to update skill');
    }
  }, [user, updateCharacterStats]);

  // Get formatted skill progress information
  const getSkillProgress = useCallback((skillName: SkillName): SkillProgress | null => {
    const skill = skills.find(s => s.skill_name === skillName);
    if (!skill) return null;

    const { level, currentXP, nextLevelXP, progress } = skillService.getSkillLevelInfo(skill.xp);

    return {
      name: skillName,
      xp: currentXP,
      level,
      progress,
      nextLevelXP
    };
  }, [skills]);

  return {
    skills,
    isLoading,
    error,
    addSkillXP,
    getSkillProgress
  };
} 