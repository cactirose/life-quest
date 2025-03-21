
import { Habit } from "@/types/habits";
import { upsertHabit } from "@/services/habitService";
import { upsertCharacter } from "@/services/characterService";
import { upsertAchievement } from "@/services/achievementService";
import { upsertChallenge } from "@/services/challengeService";
import { isCompletedForDate, recalculateStreak } from "../utils/habitCompletionUtils";

export const useHabitCompletion = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const completeHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      // Check if already completed for this date
      if (isCompletedForDate(habit, date)) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = habit.completionHistory.find(c => c.date === date)
        ? habit.completionHistory.map(c => c.date === date ? { ...c, completed: true } : c)
        : [...habit.completionHistory, { date, completed: true }];
      
      // Calculate new streak
      const newStreak = recalculateStreak(habit, updatedCompletionHistory);
      
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
      if (!isCompletedForDate(habit, date)) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = habit.completionHistory.map(c => 
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
    completeHabit,
    uncompleteHabit
  };
};
