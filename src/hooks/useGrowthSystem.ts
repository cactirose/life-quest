import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { UserSkill, SkillName, SKILL_DEFINITIONS } from '@/types/skills';
import * as skillService from '@/services/skillService';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import { supabase } from '@/integrations/supabase/client';

export interface SkillProgress {
  name: SkillName;
  xp: number;
  level: number;
  progress: number;
  nextLevelXP: number;
}

export interface SkillDefinition {
  name: string;
  description: string;
  primaryStat: string;
  icon?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useGrowthSystem() {
  const { user, isLoading: isAuthLoading, isAuthenticated, ensureValidSession, refreshSession } = useAuth();
  const { character, updateCharacter } = useCharacter();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch initial skills data
  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function initializeSkills() {
      if (!isMounted) return;

      // If auth is still loading, wait
      if (isAuthLoading) {
        console.log('Auth is still loading, waiting...');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First ensure we have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, attempting to refresh...');
          const refreshed = await refreshSession();
          if (!refreshed) {
            throw new Error('Unable to establish session');
          }
        }

        // Double check authentication after potential refresh
        if (!isAuthenticated || !user?.id) {
          console.log('Not authenticated after session check:', { isAuthenticated, userId: user?.id });
          throw new Error('User must be authenticated');
        }

        // Now try to fetch skills
        console.log('Fetching skills for user:', user.id);
        const userSkills = await skillService.fetchUserSkills(user.id);
        
        if (userSkills.length === 0 && isMounted) {
          console.log('No existing skills found, initializing...');
          await skillService.initializeUserSkills(user.id);
          const initializedSkills = await skillService.fetchUserSkills(user.id);
          if (isMounted) {
            setSkills(initializedSkills);
            setRetryCount(0); // Reset retry count on success
          }
        } else if (isMounted) {
          console.log('Existing skills found:', userSkills.length);
          setSkills(userSkills);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error('Error in skill initialization:', err);
        if (isMounted) {
          setError(err as Error);
          
          // Increment retry count and attempt retry if under max
          const newRetryCount = retryCount + 1;
          if (newRetryCount < MAX_RETRIES) {
            setRetryCount(newRetryCount);
            console.log(`Retrying initialization (${newRetryCount}/${MAX_RETRIES})...`);
            retryTimeout = setTimeout(() => {
              if (isMounted) {
                initializeSkills();
              }
            }, RETRY_DELAY * Math.pow(2, newRetryCount - 1)); // Exponential backoff
          } else {
            if (err.message.includes('authenticated') || err.message.includes('session')) {
              toast.error('Please log in again to access your skills');
            } else {
              toast.error('Failed to load skills. Please try refreshing the page.');
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setInitializationAttempted(true);
        }
      }
    }

    // Only initialize if we haven't tried yet or if auth state changes
    if (!initializationAttempted || (user?.id && !isAuthLoading)) {
      initializeSkills();
    }

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user?.id, isAuthenticated, isAuthLoading, refreshSession, initializationAttempted, retryCount]);

  // Debounced function to update character stats based on skill levels
  const updateCharacterStats = useCallback(
    debounce(async (skillsData: UserSkill[]) => {
      if (!character || !isAuthenticated) return;

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

      try {
        // Try to ensure valid session with retries
        let isValid = false;
        for (let i = 0; i < MAX_RETRIES; i++) {
          isValid = await ensureValidSession();
          if (isValid) break;
          if (i < MAX_RETRIES - 1) {
            console.log(`Retry ${i + 1} of ${MAX_RETRIES} for session validation`);
            await wait(RETRY_DELAY);
          }
        }

        if (!isValid) {
          throw new Error('Unable to establish valid session after retries');
        }
        
        // Update character with new stats
        await updateCharacter({ stats: newStats });
      } catch (err) {
        console.error('Error updating character stats:', err);
        toast.error('Failed to update character stats. Please try again.');
      }
    }, 1000),
    [character, updateCharacter, isAuthenticated, ensureValidSession]
  );

  // Update skills XP and trigger stat recalculation
  const addSkillXP = useCallback(async (
    skillName: SkillName,
    xpAmount: number
  ) => {
    if (!user || !isAuthenticated) {
      toast.error('Must be logged in to update skills');
      return;
    }

    try {
      // Try to ensure valid session with retries
      let isValid = false;
      for (let i = 0; i < MAX_RETRIES; i++) {
        isValid = await ensureValidSession();
        if (isValid) break;
        if (i < MAX_RETRIES - 1) {
          console.log(`Retry ${i + 1} of ${MAX_RETRIES} for session validation`);
          await wait(RETRY_DELAY);
        }
      }

      if (!isValid) {
        throw new Error('Unable to establish valid session after retries');
      }

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
      toast.error('Failed to update skill. Please try again.');
    }
  }, [user, isAuthenticated, ensureValidSession, updateCharacterStats]);

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

  // Add a new skill
  const addSkill = useCallback(async (skillDefinition: SkillDefinition) => {
    if (!user || !isAuthenticated) {
      toast.error('Must be logged in to add skills');
      return null;
    }

    try {
      const isValid = await ensureValidSession();
      if (!isValid) {
        throw new Error('Unable to establish valid session');
      }

      const newSkill = await skillService.createSkill(user.id, {
        skill_name: skillDefinition.name as SkillName,
        description: skillDefinition.description,
        primary_stat: skillDefinition.primaryStat,
        xp: 0
      });

      setSkills(prev => [...prev, newSkill]);
      toast.success(`Added new skill: ${skillDefinition.name}`);
      return newSkill;
    } catch (err) {
      console.error('Error adding skill:', err);
      toast.error('Failed to add skill. Please try again.');
      return null;
    }
  }, [user, isAuthenticated, ensureValidSession]);

  // Update a skill's definition
  const updateSkill = useCallback(async (
    skillName: SkillName,
    updates: Partial<SkillDefinition>
  ) => {
    if (!user || !isAuthenticated) {
      toast.error('Must be logged in to update skills');
      return false;
    }

    try {
      const isValid = await ensureValidSession();
      if (!isValid) {
        throw new Error('Unable to establish valid session');
      }

      const updatedSkill = await skillService.updateSkillDefinition(
        user.id,
        skillName,
        updates
      );

      setSkills(prev => 
        prev.map(skill => 
          skill.skill_name === skillName ? updatedSkill : skill
        )
      );

      toast.success(`Updated skill: ${skillName}`);
      return true;
    } catch (err) {
      console.error('Error updating skill:', err);
      toast.error('Failed to update skill. Please try again.');
      return false;
    }
  }, [user, isAuthenticated, ensureValidSession]);

  // Delete a skill
  const deleteSkill = useCallback(async (skillName: SkillName) => {
    if (!user || !isAuthenticated) {
      toast.error('Must be logged in to delete skills');
      return false;
    }

    try {
      const isValid = await ensureValidSession();
      if (!isValid) {
        throw new Error('Unable to establish valid session');
      }

      await skillService.deleteSkill(user.id, skillName);
      setSkills(prev => prev.filter(skill => skill.skill_name !== skillName));
      toast.success(`Deleted skill: ${skillName}`);
      return true;
    } catch (err) {
      console.error('Error deleting skill:', err);
      toast.error('Failed to delete skill. Please try again.');
      return false;
    }
  }, [user, isAuthenticated, ensureValidSession]);

  return {
    skills,
    isLoading: isLoading || isAuthLoading,
    error,
    addSkillXP,
    getSkillProgress,
    // Add new management functions
    addSkill,
    updateSkill,
    deleteSkill,
    retry: useCallback(() => {
      setInitializationAttempted(false);
      setError(null);
      setIsLoading(true);
      setRetryCount(0);
    }, [])
  };
}
