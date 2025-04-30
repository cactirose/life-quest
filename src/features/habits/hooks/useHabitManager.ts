import { Habit } from "@/types/habits";
import { GameDataUpdater } from "@/utils/contextTypes";
import { generateId } from "@/utils/idGenerator";
import { 
  upsertHabit, 
  deleteHabit as deleteHabitService
} from "@/services/habitService";
import { supabase } from "@/integrations/supabase/client";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";
import { toast } from "sonner";
import { addXPToSkill } from "@/services/skillService";

export const useHabitManager = (
  gameData: any, // GameData type
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const achievementManager = useAchievementManager([], setGameData);

  const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "streak" | "lastCompleted" | "completionHistory">) => {
    const newHabit = {
      ...habit,
      id: generateId(),
      createdAt: new Date(),
      streak: 0,
      lastCompleted: null,
      completionHistory: []
    };

    console.log("Creating new habit with ID:", newHabit.id);

    setGameData(prevData => ({
      ...prevData,
      habits: [...(prevData.habits || []), newHabit]
    }));

    // Sync with Supabase
    upsertHabit(newHabit as Habit).catch(error => {
      console.error("Error saving new habit:", error);
      toast.error("Failed to save habit");
    });
  };

  const updateHabit = (habit: Habit) => {
    // Validate UUID format before updating
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habit.id)) {
      console.error("Invalid UUID format for habit, cannot update:", habit.id);
      return;
    }

    setGameData(prevData => ({
      ...prevData,
      habits: (prevData.habits || []).map(h => 
        h.id === habit.id ? habit : h
      )
    }));

    // Sync with Supabase with more verbose error handling
    upsertHabit(habit).catch(error => {
      console.error("Error updating habit:", error, "Habit data:", habit);
    });
  };

  const deleteHabit = (habitId: string) => {
    console.log("useHabitManager: Starting habit deletion for ID:", habitId);
    
    // Validate UUID format before deleting
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habitId)) {
      console.error("useHabitManager: Invalid UUID format for habit, cannot delete:", habitId);
      return;
    }

    console.log("useHabitManager: Updating local state to remove habit");
    setGameData(prevData => {
      const newHabits = (prevData.habits || []).filter(h => h.id !== habitId);
      console.log("useHabitManager: New habits count:", newHabits.length);
      return {
        ...prevData,
        habits: newHabits
      };
    });

    // Sync with Supabase
    console.log("useHabitManager: Calling deleteHabitService");
    deleteHabitService(habitId).catch(error => {
      console.error("useHabitManager: Error deleting habit:", error, "Habit ID:", habitId);
    });
  };

  const completeHabit = async (habitId: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;

      let updatedSkills = [...prevData.skills];

      // Update habit completion
      const updatedHabits = prevData.habits.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            lastCompletedAt: new Date(),
            completionCount: (h.completionCount || 0) + 1
          };
        }
        return h;
      });

      // If habit has skill reward, update skill XP
      if (habit.skillId && habit.skillXpReward) {
        // Update local state immediately for UI responsiveness
        updatedSkills = updatedSkills.map(skill => {
          if (skill.id === habit.skillId) {
            return {
              ...skill,
              xp: skill.xp + habit.skillXpReward
            };
          }
          return skill;
        });

        // Update skill in Supabase
        addXPToSkill(habit.skillId, habit.skillXpReward).catch(error => {
          console.error("Error updating skill XP:", error);
          toast.error("Failed to update skill XP");
          
          // Revert local state on error
          setGameData(currentData => ({
            ...currentData,
            skills: currentData.skills.map(skill => {
              if (skill.id === habit.skillId) {
                return {
                  ...skill,
                  xp: skill.xp - habit.skillXpReward
                };
              }
              return skill;
            })
          }));
        });
      }

      return {
        ...prevData,
        habits: updatedHabits,
        skills: updatedSkills
      };
    });
  };

  const uncompleteHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habits = prevData.habits || [];
      const updatedHabits = habits.map(habit => {
        if (habit.id !== habitId) return habit;
        // Remove completion for this date
        const newCompletionHistory = (habit.completionHistory || []).filter(
          c => !(c.date === date && c.completed)
        );
        // Recalculate streak (simple: -1, or recalc if needed)
        const newStreak = Math.max((habit.streak || 1) - 1, 0);
        const updatedHabit = {
          ...habit,
          completionHistory: newCompletionHistory,
          streak: newStreak
        };
        // Sync with Supabase
        upsertHabit(updatedHabit).catch(error => {
          console.error("Error uncompleting habit:", error, updatedHabit);
        });
        return updatedHabit;
      });
      return { ...prevData, habits: updatedHabits };
    });
  };

  return {
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit
  };
};
