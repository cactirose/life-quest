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
    let completed = false;
    
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      completed = true;
      
      // Calculate streak
      const today = new Date();
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
      const isConsecutiveDay = lastCompleted && 
        today.getDate() - lastCompleted.getDate() === 1 &&
        today.getMonth() === lastCompleted.getMonth() &&
        today.getFullYear() === lastCompleted.getFullYear();
      
      const newStreak = isConsecutiveDay ? habit.streak + 1 : 1;
      
      // Update character XP and coins
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + habit.xpReward,
        coins: prevData.character.coins + habit.coinReward
      };
      
      // Update habit status
      const updatedHabit = {
        ...habit,
        streak: newStreak,
        lastCompleted: today.toISOString(),
        completionHistory: [
          ...habit.completionHistory,
          { date: today.toISOString().split('T')[0], completed: true }
        ]
      };
      
      // Update linked skill if exists
      let updatedSkills = [...prevData.skills];
      if (habit.skillId && habit.skillXpReward) {
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
        const updatedSkill = updatedSkills.find(s => s.id === habit.skillId);
        if (updatedSkill) {
          supabase
            .from("skills")
            .update({ xp: updatedSkill.xp })
            .eq("id", updatedSkill.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error updating skill XP in Supabase:", error);
              }
            });
        }
      }
      
      // Update linked achievement if exists
      let updatedAchievements = [...prevData.achievements];
      if (habit.achievementId && habit.achievementXpReward) {
        updatedAchievements = updatedAchievements.map(achievement => {
          if (achievement.id === habit.achievementId) {
            const newXp = achievement.currentXp + (habit.achievementXpReward || 0);
            const isCompleted = newXp >= achievement.requiredXp;
            
            // If achievement is newly completed, give rewards
            if (isCompleted && !achievement.unlocked) {
              updatedCharacter.xp += achievement.xpReward;
              updatedCharacter.coins += achievement.coinReward;
              
              // Show achievement completion message
              setTimeout(() => {
                toast.success(`Achievement unlocked: ${achievement.title}! You earned ${achievement.xpReward} XP and ${achievement.coinReward} coins.`);
              }, 1000);
            }
            
            return {
              ...achievement,
              currentXp: newXp,
              unlocked: isCompleted,
              dateUnlocked: isCompleted && !achievement.unlocked ? new Date().toISOString() : achievement.dateUnlocked
            };
          }
          return achievement;
        });

        // Update achievement in Supabase
        const updatedAchievement = updatedAchievements.find(a => a.id === habit.achievementId);
        if (updatedAchievement) {
          supabase
            .from("achievements")
            .update({
              current_xp: updatedAchievement.currentXp,
              unlocked: updatedAchievement.unlocked,
              date_unlocked: updatedAchievement.dateUnlocked
            })
            .eq("id", updatedAchievement.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error updating achievement in Supabase:", error);
              }
            });
        }
      }
      
      // Update character in Supabase
      supabase
        .from("characters")
        .update({
          xp: updatedCharacter.xp,
          coins: updatedCharacter.coins
        })
        .eq("user_id", prevData.character.userId || "")
        .then(({ error }) => {
          if (error) {
            console.error("Error updating character stats in Supabase:", error);
          }
        });
      
      return {
        ...prevData,
        character: updatedCharacter,
        habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
        skills: updatedSkills,
        achievements: updatedAchievements
      };
    });
    
    return completed;
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
