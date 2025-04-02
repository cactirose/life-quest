
import { Habit } from "@/types/habits";
import { upsertHabit } from "@/services/habitService";
import { upsertCharacter } from "@/services/characterService";
import { upsertAchievement } from "@/services/achievementService";
import { upsertChallenge } from "@/services/challengeService";
import { isCompletedForDate, recalculateStreak } from "../utils/habitCompletionUtils";
import { toast } from "sonner";

export const useHabitCompletion = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const completeHabit = (habitId: string, date: string) => {
    try {
      setGameData(prevData => {
        // Safety check for invalid data
        if (!prevData || !prevData.habits || !Array.isArray(prevData.habits)) {
          console.error("Invalid game data for habits:", prevData);
          return prevData;
        }
        
        const habit = prevData.habits.find(h => h.id === habitId);
        if (!habit) {
          console.warn(`Habit with ID ${habitId} not found`);
          return prevData;
        }
        
        // Ensure completionHistory always exists
        const completionHistory = habit.completionHistory || [];
        
        // Check if already completed for this date
        if (isCompletedForDate(habit, date)) return prevData;
        
        // Update completion history
        const updatedCompletionHistory = completionHistory.find(c => c.date === date)
          ? completionHistory.map(c => c.date === date ? { ...c, completed: true } : c)
          : [...completionHistory, { date, completed: true }];
        
        // Calculate new streak
        const newStreak = recalculateStreak(habit, updatedCompletionHistory);
        
        // Update habit
        const updatedHabit = {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak: newStreak
        };
        
        // Apply rewards - ensure character exists
        if (!prevData.character) {
          console.error("Character data is missing");
          return {
            ...prevData,
            habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
          };
        }
        
        const updatedCharacter = {
          ...prevData.character,
          xp: (prevData.character.xp || 0) + (habit.xpReward || 0),
          coins: (prevData.character.coins || 0) + (habit.coinReward || 0)
        };
        
        // Check if any challenges should be updated
        let updatedChallenges = prevData.challenges || [];
        if (Array.isArray(updatedChallenges)) {
          const habitChallenges = updatedChallenges.filter(
            c => c && c.status === "active" && 
            (c.title.toLowerCase().includes("habit") || c.description?.toLowerCase().includes("habit"))
          );
          
          if (habitChallenges.length > 0) {
            updatedChallenges = updatedChallenges.map(challenge => {
              if (!challenge) return challenge;
              
              if (habitChallenges.find(c => c.id === challenge.id)) {
                const newCount = (challenge.currentCount || 0) + 1;
                const updatedChallenge = {
                  ...challenge,
                  currentCount: newCount,
                  status: newCount >= (challenge.requiredCount || 0) ? "completed" : challenge.status
                };
                
                // Safely sync challenge with Supabase
                try {
                  upsertChallenge(updatedChallenge).catch(err => 
                    console.error("Error syncing challenge:", err, updatedChallenge)
                  );
                } catch (err) {
                  console.error("Error preparing challenge for upsert:", err);
                }
                
                return updatedChallenge;
              }
              return challenge;
            });
          }
        }
        
        // Check if any achievements should be updated
        let updatedAchievements = prevData.achievements || [];
        if (Array.isArray(updatedAchievements)) {
          const habitAchievements = updatedAchievements.filter(
            a => a && !a.unlocked && a.category === "habits" && a.requiredCount && a.currentCount !== undefined
          );
          
          if (habitAchievements.length > 0) {
            updatedAchievements = updatedAchievements.map(achievement => {
              if (!achievement) return achievement;
              
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
                
                // Safely sync achievement with Supabase
                if (updatedAchievement !== achievement) {
                  try {
                    upsertAchievement(updatedAchievement).catch(err => 
                      console.error("Error syncing achievement:", err, updatedAchievement)
                    );
                  } catch (err) {
                    console.error("Error preparing achievement for upsert:", err);
                  }
                }
                
                return updatedAchievement;
              }
              return achievement;
            });
          }
        }
        
        // Sync with Supabase (safe upserts)
        try {
          upsertHabit(updatedHabit).catch(err => 
            console.error("Error syncing habit:", err, updatedHabit)
          );
          upsertCharacter(updatedCharacter).catch(err => 
            console.error("Error syncing character:", err, updatedCharacter)
          );
        } catch (err) {
          console.error("Error preparing data for upsert:", err);
        }
        
        return {
          ...prevData,
          character: updatedCharacter,
          habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
          challenges: updatedChallenges,
          achievements: updatedAchievements
        };
      });
      
      toast.success("Habit completed!");
    } catch (error) {
      console.error("Error in completeHabit:", error);
      toast.error("Failed to complete habit");
    }
  };
  
  const uncompleteHabit = (habitId: string, date: string) => {
    try {
      setGameData(prevData => {
        // Safety check for invalid data
        if (!prevData || !prevData.habits || !Array.isArray(prevData.habits)) {
          console.error("Invalid game data for habits:", prevData);
          return prevData;
        }
        
        const habit = prevData.habits.find(h => h.id === habitId);
        if (!habit) {
          console.warn(`Habit with ID ${habitId} not found`);
          return prevData;
        }
        
        // Ensure completionHistory always exists
        const completionHistory = habit.completionHistory || [];
        
        // Check if completed for this date
        if (!isCompletedForDate(habit, date)) return prevData;
        
        // Update completion history
        const updatedCompletionHistory = completionHistory.map(c => 
          c.date === date ? { ...c, completed: false } : c
        );
        
        // Recalculate streak
        const newStreak = recalculateStreak(habit, updatedCompletionHistory);
        
        // Update habit
        const updatedHabit = {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak: newStreak
        };
        
        // Remove rewards - ensure character exists
        if (!prevData.character) {
          console.error("Character data is missing");
          return {
            ...prevData,
            habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
          };
        }
        
        const updatedCharacter = {
          ...prevData.character,
          xp: Math.max(0, (prevData.character.xp || 0) - (habit.xpReward || 0)),
          coins: Math.max(0, (prevData.character.coins || 0) - (habit.coinReward || 0))
        };
        
        // Sync with Supabase (safe upserts)
        try {
          upsertHabit(updatedHabit).catch(err => 
            console.error("Error syncing habit:", err, updatedHabit)
          );
          upsertCharacter(updatedCharacter).catch(err => 
            console.error("Error syncing character:", err, updatedCharacter)
          );
        } catch (err) {
          console.error("Error preparing data for upsert:", err);
        }
        
        return {
          ...prevData,
          character: updatedCharacter,
          habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
        };
      });
      
      toast.info("Habit marked as incomplete");
    } catch (error) {
      console.error("Error in uncompleteHabit:", error);
      toast.error("Failed to update habit");
    }
  };

  return {
    completeHabit,
    uncompleteHabit
  };
};
