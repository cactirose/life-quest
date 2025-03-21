import { createContext, useContext } from "react";
import { Habit } from "../types/habits";
import { generateId } from "../utils/idGenerator";
import { 
  upsertHabit, 
  deleteHabit 
} from "@/services/habitService";
import { upsertCharacter } from "@/services/characterService";
import { upsertAchievement } from "@/services/achievementService";
import { upsertChallenge } from "@/services/challengeService";

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
}

export const HabitContext = createContext<HabitContextType>({} as HabitContextType);

export const useHabits = () => useContext(HabitContext);

export const createHabitContextValue = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): HabitContextType => {
  const addHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    const newHabit = {
      ...habit,
      id: generateId(),
      completionHistory: [],
      streak: 0
    };

    setGameData(prevData => ({
      ...prevData,
      habits: [...prevData.habits, newHabit]
    }));

    // Sync with Supabase
    upsertHabit(newHabit);
  };

  const updateHabit = (habit: Habit) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.map(h => 
        h.id === habit.id ? habit : h
      )
    }));

    // Sync with Supabase
    upsertHabit(habit);
  };

  const deleteHabitFromState = (habitId: string) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.filter(h => h.id !== habitId)
    }));

    // Sync with Supabase
    deleteHabit(habitId);
  };

  const completeHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      // Check if already completed for this date
      const existingCompletion = habit.completionHistory.find(c => c.date === date);
      if (existingCompletion?.completed) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = existingCompletion
        ? habit.completionHistory.map(c => c.date === date ? { ...c, completed: true } : c)
        : [...habit.completionHistory, { date, completed: true }];
      
      // Calculate new streak
      const sortedHistory = [...updatedCompletionHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let newStreak = 0;
      // Calculate streak based on frequency
      if (habit.frequency === "daily") {
        // For daily habits, check consecutive days
        for (let i = 0; i < sortedHistory.length; i++) {
          if (!sortedHistory[i].completed) break;
          
          const currentDate = new Date(sortedHistory[i].date);
          if (i > 0) {
            const prevDate = new Date(sortedHistory[i-1].date);
            const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff !== 1) break;
          }
          
          newStreak++;
        }
      } else if (habit.frequency === "weekly") {
        // For weekly habits, count weeks with completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      } else {
        // For other frequencies, just count completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      }
      
      // Update habit
      const updatedHabit = {
        ...habit,
        completionHistory: updatedCompletionHistory,
        streak: newStreak
      };
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + habit.xpReward,
        coins: prevData.character.coins + habit.coinReward
      };
      
      // Check if any challenges should be updated
      let updatedChallenges = [...prevData.challenges];
      const habitChallenges = updatedChallenges.filter(
        c => c.status === "active" && 
        (c.title.toLowerCase().includes("habit") || c.description.toLowerCase().includes("habit"))
      );
      
      if (habitChallenges.length > 0) {
        updatedChallenges = updatedChallenges.map(challenge => {
          if (habitChallenges.find(c => c.id === challenge.id)) {
            const newCount = challenge.currentCount + 1;
            const updatedChallenge = {
              ...challenge,
              currentCount: newCount,
              status: newCount >= challenge.requiredCount ? "completed" as const : challenge.status
            };
            
            // Sync challenge with Supabase
            upsertChallenge(updatedChallenge);
            
            return updatedChallenge;
          }
          return challenge;
        });
      }
      
      // Check if any achievements should be updated
      let updatedAchievements = [...prevData.achievements];
      const habitAchievements = updatedAchievements.filter(
        a => !a.unlocked && a.category === "habits" && a.requiredCount && a.currentCount !== undefined
      );
      
      if (habitAchievements.length > 0) {
        updatedAchievements = updatedAchievements.map(achievement => {
          if (habitAchievements.find(a => a.id === achievement.id)) {
            let updatedAchievement = achievement;
            
            if (achievement.title === "Habit Master" && newStreak >= (achievement.requiredCount || 0)) {
              updatedAchievement = {
                ...achievement,
                unlocked: true,
                dateUnlocked: new Date().toISOString(),
                currentCount: newStreak
              };
            } else if (achievement.currentCount !== undefined) {
              const newCount = achievement.currentCount + 1;
              const newUnlocked = newCount >= (achievement.requiredCount || 0);
              
              updatedAchievement = {
                ...achievement,
                currentCount: newCount,
                unlocked: newUnlocked,
                dateUnlocked: newUnlocked ? new Date().toISOString() : undefined
              };
            }
            
            // Sync achievement with Supabase
            if (updatedAchievement !== achievement) {
              upsertAchievement(updatedAchievement);
            }
            
            return updatedAchievement;
          }
          return achievement;
        });
      }
      
      // Sync with Supabase
      upsertHabit(updatedHabit);
      upsertCharacter(updatedCharacter);
      
      return {
        ...prevData,
        character: updatedCharacter,
        habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
        challenges: updatedChallenges,
        achievements: updatedAchievements
      };
    });
  };
  
  const uncompleteHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      // Check if completed for this date
      const existingCompletion = habit.completionHistory.find(c => c.date === date);
      if (!existingCompletion?.completed) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = habit.completionHistory.map(c => 
        c.date === date ? { ...c, completed: false } : c
      );
      
      // Recalculate streak
      const sortedHistory = [...updatedCompletionHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let newStreak = 0;
      // Calculate streak based on frequency
      if (habit.frequency === "daily") {
        // For daily habits, check consecutive days
        for (let i = 0; i < sortedHistory.length; i++) {
          if (!sortedHistory[i].completed) break;
          
          const currentDate = new Date(sortedHistory[i].date);
          if (i > 0) {
            const prevDate = new Date(sortedHistory[i-1].date);
            const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff !== 1) break;
          }
          
          newStreak++;
        }
      } else if (habit.frequency === "weekly") {
        // For weekly habits, count weeks with completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      } else {
        // For other frequencies, just count completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      }
      
      // Update habit
      const updatedHabit = {
        ...habit,
        completionHistory: updatedCompletionHistory,
        streak: newStreak
      };
      
      // Remove rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: Math.max(0, prevData.character.xp - habit.xpReward),
        coins: Math.max(0, prevData.character.coins - habit.coinReward)
      };
      
      // Sync with Supabase
      upsertHabit(updatedHabit);
      upsertCharacter(updatedCharacter);
      
      return {
        ...prevData,
        character: updatedCharacter,
        habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
      };
    });
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit: deleteHabitFromState,
    completeHabit,
    uncompleteHabit
  };
};
