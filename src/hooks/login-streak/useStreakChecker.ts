
import { useCallback, useState } from 'react';
import { Character } from '@/types/character';
import { differenceInCalendarDays, format } from 'date-fns';
import { toast } from 'sonner';

interface StreakCheckerProps {
  character: Character;
  setCharacter: (character: Character) => void;
  fetchServerTime: () => Promise<Date>;
}

export function useStreakChecker({ 
  character, 
  setCharacter,
  fetchServerTime
}: StreakCheckerProps) {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  const checkLoginStreak = useCallback(async () => {
    if (!character) return;
    
    try {
      setIsCheckingLogin(true);
      
      // Get the current date from the server to prevent client-side manipulation
      const serverTime = await fetchServerTime();
      const today = format(serverTime, 'yyyy-MM-dd');
      
      // Get the last login date from character data
      const lastLoginDate = character.lastLoginDate 
        ? format(new Date(character.lastLoginDate), 'yyyy-MM-dd')
        : null;
      
      // If they've already logged in today, nothing to do
      if (lastLoginDate === today) {
        console.log("Already logged in today");
        return;
      }

      // Calculate the number of days since last login
      const daysSinceLastLogin = lastLoginDate
        ? differenceInCalendarDays(
            new Date(today),
            new Date(lastLoginDate)
          )
        : null;

      let updatedStreak = character.loginStreak;
      let streakBroken = false;
      
      // First time login
      if (!lastLoginDate) {
        updatedStreak = 1;
      } 
      // Consecutive day login (streak continues)
      else if (daysSinceLastLogin === 1) {
        updatedStreak += 1;
        toast.success(`Login streak: ${updatedStreak} days!`);
      } 
      // Missed a day or more (streak breaks)
      else if (daysSinceLastLogin > 1) {
        updatedStreak = 1; // Reset streak
        streakBroken = true;
        toast.info("Starting a new login streak!");
      }
      
      // Update the character data
      const updatedCharacter = {
        ...character,
        lastLoginDate: new Date(today).toISOString(),
        loginStreak: updatedStreak,
        dailyBonusClaimed: false // Reset the daily bonus claimed flag for the new day
      };
      
      setCharacter(updatedCharacter);
      
      if (streakBroken && character.loginStreak > 1) {
        toast.warning(`Previous streak of ${character.loginStreak} days was broken`);
      }
      
    } catch (error) {
      console.error("Error checking login streak:", error);
    } finally {
      setIsCheckingLogin(false);
    }
  }, [character, setCharacter, fetchServerTime]);

  return {
    checkLoginStreak,
    isCheckingLogin
  };
}
