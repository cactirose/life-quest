import { useEffect, useCallback } from "react";
import { useGameData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { isSameDay, differenceInDays, startOfDay } from "date-fns";
import { upsertCharacter } from "@/services/characterService";

export const useLoginStreak = () => {
  const { character, setCharacter } = useGameData();

  const checkLoginStreak = useCallback(() => {
    if (!character) return;

    const now = new Date();
    const today = startOfDay(now);
    const lastLoginDate = character.lastLoginDate ? new Date(character.lastLoginDate) : null;
    const lastLoginDay = lastLoginDate ? startOfDay(lastLoginDate) : null;
    
    // If this is the first login or the last login was more than 2 days ago, reset streak
    if (!lastLoginDate || differenceInDays(today, lastLoginDay!) > 1) {
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: 1,
        dailyBonusClaimed: false
      });
      
      // Store the last successful reset time to prevent issues with timezone differences
      localStorage.setItem('lastStreakReset', today.toISOString());
      
      console.log("Login streak reset to 1");
      return;
    }

    // If the last login was yesterday, increment the streak
    if (differenceInDays(today, lastLoginDay!) === 1) {
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: character.loginStreak + 1,
        dailyBonusClaimed: false
      });
      console.log("Login streak incremented to", character.loginStreak + 1);
      return;
    }

    // If the last login was today but we haven't checked if it's a new day at midnight
    if (isSameDay(today, lastLoginDay!)) {
      // Check if we've crossed midnight since the last check
      const lastResetTime = localStorage.getItem('lastStreakReset');
      
      if (lastResetTime) {
        const resetDate = startOfDay(new Date(lastResetTime));
        
        // If the last reset was before today, it's a new day
        if (differenceInDays(today, resetDate) >= 1) {
          // Update the last login date but keep the same streak
          setCharacter({
            ...character,
            lastLoginDate: now.toISOString(),
            dailyBonusClaimed: false
          });
          
          // Update the last reset time
          localStorage.setItem('lastStreakReset', today.toISOString());
          console.log("New day detected, reset daily bonus claim status");
        }
      } else {
        // If we don't have a last reset time, set it now
        localStorage.setItem('lastStreakReset', today.toISOString());
      }
    }
  }, [character, setCharacter]);

  const claimDailyBonus = useCallback(() => {
    if (!character || character.dailyBonusClaimed) return;

    const bonusCoins = Math.min(10 + (character.loginStreak * 2), 50);
    const bonusXp = Math.min(5 + (character.loginStreak), 25);

    const updatedCharacter = {
      ...character,
      coins: character.coins + bonusCoins,
      xp: character.xp + bonusXp,
      dailyBonusClaimed: true
    };

    setCharacter(updatedCharacter);
    upsertCharacter(updatedCharacter).catch(err => 
      console.error("Error saving character after claiming daily bonus:", err)
    );

    toast.success(`Daily Bonus Claimed!`, {
      description: `+${bonusCoins} coins, +${bonusXp} XP. Streak: ${character.loginStreak} day${character.loginStreak !== 1 ? 's' : ''}`,
    });
  }, [character, setCharacter]);

  // Check login streak when component mounts
  useEffect(() => {
    checkLoginStreak();
    
    // Set up a timer to check for day changes
    const midnightCheck = setInterval(() => {
      const now = new Date();
      // Check for the next midnight
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        console.log("Midnight detected, checking login streak");
        checkLoginStreak();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(midnightCheck);
  }, [checkLoginStreak]);

  return { claimDailyBonus };
};
