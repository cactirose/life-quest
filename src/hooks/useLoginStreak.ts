import { useEffect, useCallback, useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { isSameDay, differenceInDays, startOfDay, addDays } from "date-fns";
import { upsertCharacter } from "@/services/characterService";

export const useLoginStreak = () => {
  const { character, setCharacter } = useGameData();
  const [lastCheckedDay, setLastCheckedDay] = useState<string | null>(null);

  const checkLoginStreak = useCallback(() => {
    if (!character) return;

    // Get current date (server time)
    const now = new Date();
    const today = startOfDay(now);
    const todayString = today.toISOString();
    
    // Get last login date
    const lastLoginDate = character.lastLoginDate ? new Date(character.lastLoginDate) : null;
    const lastLoginDay = lastLoginDate ? startOfDay(lastLoginDate) : null;
    
    console.log(`Checking login streak - Today: ${todayString}, Last login: ${lastLoginDate?.toISOString()}`);
    
    // If this is the first login ever
    if (!lastLoginDate) {
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: 1,
        dailyBonusClaimed: false
      });
      
      // Store the current day as the last checked day
      localStorage.setItem('lastStreakReset', todayString);
      setLastCheckedDay(todayString);
      
      console.log("First login ever. Set streak to 1");
      return;
    }

    // Get the stored last reset time to prevent issues with timezone differences
    const lastResetTimeString = localStorage.getItem('lastStreakReset');
    const lastResetTime = lastResetTimeString ? new Date(lastResetTimeString) : null;
    const lastResetDay = lastResetTime ? startOfDay(lastResetTime) : null;
    
    // Already checked today
    if (lastResetDay && isSameDay(today, lastResetDay) && character.lastLoginDate) {
      console.log("Already checked login streak today");
      return;
    }
    
    // If the last login was more than 2 days ago, reset streak
    if (lastLoginDay && differenceInDays(today, lastLoginDay) > 1) {
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: 1,
        dailyBonusClaimed: false
      });
      
      localStorage.setItem('lastStreakReset', todayString);
      setLastCheckedDay(todayString);
      
      console.log("Login streak reset to 1 - too many days since last login");
      return;
    }

    // If the last login was yesterday, increment the streak
    if (lastLoginDay && differenceInDays(today, lastLoginDay) === 1) {
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: character.loginStreak + 1,
        dailyBonusClaimed: false
      });
      
      localStorage.setItem('lastStreakReset', todayString);
      setLastCheckedDay(todayString);
      
      console.log(`Login streak incremented to ${character.loginStreak + 1}`);
      return;
    }

    // If it's the same day as the last login but after midnight since the last reset
    if (lastLoginDay && isSameDay(today, lastLoginDay) && 
        (!lastResetDay || !isSameDay(today, lastResetDay))) {
      // Keep the streak but reset the daily bonus claim status
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        dailyBonusClaimed: false
      });
      
      localStorage.setItem('lastStreakReset', todayString);
      setLastCheckedDay(todayString);
      
      console.log("Same day login but after midnight reset. Reset daily bonus claim status");
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

  // Function to force a reset for testing purposes
  const forceReset = useCallback(() => {
    if (!character) return;
    
    const now = new Date();
    setCharacter({
      ...character,
      lastLoginDate: now.toISOString(),
      dailyBonusClaimed: false
    });
    
    localStorage.setItem('lastStreakReset', startOfDay(now).toISOString());
    setLastCheckedDay(startOfDay(now).toISOString());
    
    console.log("Forced reset of daily login status");
  }, [character, setCharacter]);

  // Check login streak when component mounts
  useEffect(() => {
    checkLoginStreak();
    
    // Set up a timer to check for day changes (check every minute)
    const midnightCheck = setInterval(() => {
      const now = new Date();
      // Check if it's around midnight (between 12:00 AM and 12:05 AM)
      if (now.getHours() === 0 && now.getMinutes() < 5) {
        console.log("Midnight detected, checking login streak");
        checkLoginStreak();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(midnightCheck);
  }, [checkLoginStreak]);

  // Force recheck at specific times
  useEffect(() => {
    // Only check once per day to prevent excessive checks
    const today = startOfDay(new Date()).toISOString();
    if (lastCheckedDay !== today) {
      checkLoginStreak();
    }
  }, [lastCheckedDay, checkLoginStreak]);

  return { claimDailyBonus, forceReset };
};
