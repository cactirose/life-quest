import { useState, useCallback, useEffect } from "react";
import { Character } from "@/types/character";
import { startOfDay, format, isSameDay, differenceInDays } from "date-fns";
import { toast } from "sonner";

interface UseStreakCheckerProps {
  character: Character | null;
  setCharacter: (character: Character) => void;
  fetchServerTime: () => Promise<Date>;
}

export const useStreakChecker = ({ 
  character, 
  setCharacter, 
  fetchServerTime 
}: UseStreakCheckerProps) => {
  const [lastCheckedDay, setLastCheckedDay] = useState<string | null>(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  const checkLoginStreak = useCallback(async () => {
    if (!character || isCheckingLogin) return;
    
    try {
      setIsCheckingLogin(true);
      
      // Get current server time
      const now = await fetchServerTime();
      const today = startOfDay(now);
      const todayString = today.toISOString();
      
      // Get last login date
      const lastLoginDate = character.lastLoginDate ? new Date(character.lastLoginDate) : null;
      const lastLoginDay = lastLoginDate ? startOfDay(lastLoginDate) : null;
      
      console.log(`Checking login streak - Today (server): ${todayString}, Last login: ${lastLoginDate?.toISOString()}`);
      
      // Check if we already processed this server day
      const lastResetTimeString = localStorage.getItem('lastStreakReset');
      const lastResetTime = lastResetTimeString ? new Date(lastResetTimeString) : null;
      const lastResetDay = lastResetTime ? startOfDay(lastResetTime) : null;
      
      // Already checked today based on server time
      if (lastResetDay && isSameDay(today, lastResetDay) && character.lastLoginDate) {
        console.log("Already checked login streak today (server time)");
        setIsCheckingLogin(false);
        return;
      }
      
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
        setIsCheckingLogin(false);
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
        setIsCheckingLogin(false);
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
        setIsCheckingLogin(false);
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
      
      setIsCheckingLogin(false);
    } catch (error) {
      console.error("Error checking login streak:", error);
      setIsCheckingLogin(false);
    }
  }, [character, setCharacter, fetchServerTime, isCheckingLogin]);

  // Set up midnight check
  useEffect(() => {
    // Re-check login streak at specific times (near midnight)
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

  // Check for day changes when server time updates
  useEffect(() => {
    if (character && lastCheckedDay) {
      // Initial check if needed
      checkLoginStreak();
    }
  }, [character, lastCheckedDay, checkLoginStreak]);

  return { 
    lastCheckedDay,
    checkLoginStreak,
    isCheckingLogin 
  };
};
