
import { useEffect, useCallback, useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { isSameDay, differenceInDays, startOfDay, addDays } from "date-fns";
import { upsertCharacter } from "@/services/characterService";
import { supabase } from "@/integrations/supabase/client";

export const useLoginStreak = () => {
  const { character, setCharacter } = useGameData();
  const [lastCheckedDay, setLastCheckedDay] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<Date | null>(null);

  // Fetch server time from Supabase
  const fetchServerTime = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_server_time');
      if (error) throw error;
      
      // Data should be a timestamp string like '2023-08-01T12:00:00Z'
      if (data) {
        const serverDate = new Date(data);
        console.log("Server time:", serverDate.toISOString());
        setServerTime(serverDate);
        return serverDate;
      }
      
      return new Date(); // Fallback to local time if server time unavailable
    } catch (error) {
      console.error("Error fetching server time:", error);
      return new Date(); // Fallback to local time
    }
  }, []);

  const checkLoginStreak = useCallback(async () => {
    if (!character) return;

    // Get current server time
    const now = await fetchServerTime();
    const today = startOfDay(now);
    const todayString = today.toISOString();
    
    // Get last login date
    const lastLoginDate = character.lastLoginDate ? new Date(character.lastLoginDate) : null;
    const lastLoginDay = lastLoginDate ? startOfDay(lastLoginDate) : null;
    
    console.log(`Checking login streak - Today (server): ${todayString}, Last login: ${lastLoginDate?.toISOString()}`);
    
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

    // Check if we already processed this server day
    const lastResetTimeString = localStorage.getItem('lastStreakReset');
    const lastResetTime = lastResetTimeString ? new Date(lastResetTimeString) : null;
    const lastResetDay = lastResetTime ? startOfDay(lastResetTime) : null;
    
    // Already checked today based on server time
    if (lastResetDay && isSameDay(today, lastResetDay) && character.lastLoginDate) {
      console.log("Already checked login streak today (server time)");
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
      
      toast.info("Welcome back! Your login streak has been reset to 1.");
      console.log("Login streak reset to 1 - too many days since last login");
      return;
    }

    // If the last login was yesterday, increment the streak
    if (lastLoginDay && differenceInDays(today, lastLoginDay) === 1) {
      const newStreak = character.loginStreak + 1;
      setCharacter({
        ...character,
        lastLoginDate: now.toISOString(),
        loginStreak: newStreak,
        dailyBonusClaimed: false
      });
      
      localStorage.setItem('lastStreakReset', todayString);
      setLastCheckedDay(todayString);
      
      toast.success(`Login streak increased to ${newStreak} days!`);
      console.log(`Login streak incremented to ${newStreak}`);
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
  }, [character, setCharacter, fetchServerTime]);

  const claimDailyBonus = useCallback(() => {
    if (!character || character.dailyBonusClaimed) {
      toast.error("You've already claimed today's bonus!");
      return;
    }

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
  const forceReset = useCallback(async () => {
    if (!character) return;
    
    const now = await fetchServerTime();
    setCharacter({
      ...character,
      lastLoginDate: now.toISOString(),
      dailyBonusClaimed: false
    });
    
    localStorage.setItem('lastStreakReset', startOfDay(now).toISOString());
    setLastCheckedDay(startOfDay(now).toISOString());
    
    console.log("Forced reset of daily login status");
  }, [character, setCharacter, fetchServerTime]);

  // Check login streak when component mounts
  useEffect(() => {
    checkLoginStreak();
    
    // Set up a timer to check for day changes (check every minute)
    const midnightCheck = setInterval(() => {
      fetchServerTime().then(serverTime => {
        const now = serverTime;
        // Check if it's around midnight (between 12:00 AM and 12:05 AM)
        if (now.getHours() === 0 && now.getMinutes() < 5) {
          console.log("Midnight detected (server time), checking login streak");
          checkLoginStreak();
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(midnightCheck);
  }, [checkLoginStreak, fetchServerTime]);

  // Force recheck at specific times
  useEffect(() => {
    // Update the server time every 10 minutes
    const serverTimeInterval = setInterval(() => {
      fetchServerTime();
    }, 600000); // 10 minutes
    
    return () => clearInterval(serverTimeInterval);
  }, [fetchServerTime]);

  // Check for day changes when server time updates
  useEffect(() => {
    if (serverTime) {
      const today = startOfDay(serverTime).toISOString();
      if (lastCheckedDay !== today) {
        checkLoginStreak();
      }
    }
  }, [serverTime, lastCheckedDay, checkLoginStreak]);

  return { claimDailyBonus, forceReset };
};
