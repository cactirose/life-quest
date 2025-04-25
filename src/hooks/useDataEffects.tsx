
import { useEffect } from "react";
import { useAchievements } from "../contexts/AchievementContext";
import { useGameData } from "../contexts/DataContext";
import { CharacterContextType } from "../utils/contextTypes";
import { toast } from "sonner";

export const useDataEffects = (
  characterContext: CharacterContextType
) => {
  const { achievements, checkAndUnlockAchievement } = useAchievements();
  const gameData = useGameData();

  // Check daily login only once when the component mounts
  useEffect(() => {
    // Only check daily login if character data is available
    if (characterContext.character) {
      // Create a function to check daily login within the effect
      const checkDailyLoginStatus = () => {
        // Get the current date as a string
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = characterContext.character?.lastLoginDate 
          ? new Date(characterContext.character.lastLoginDate).toISOString().split('T')[0]
          : null;
        
        // Only update if it's a new day (player hasn't logged in today)
        if (lastLogin !== today) {
          // Update the character's lastLoginDate and streak
          const updatedCharacter = {
            ...characterContext.character,
            lastLoginDate: new Date().toISOString(),
            loginStreak: lastLogin ? characterContext.character.loginStreak + 1 : 1,
            dailyBonusClaimed: false
          };
          
          // Update the character information
          if (characterContext.setCharacter) {
            characterContext.setCharacter(updatedCharacter);
          }
        }
      };
      
      try {
        checkDailyLoginStatus();
      } catch (error) {
        console.error("Error during daily login check:", error);
        // Don't block the app if this fails
      }
    }
  // Use lastLoginDate instead of id since Character doesn't have an id property
  }, [characterContext.character?.lastLoginDate, characterContext.character, characterContext.setCharacter]); 

  // Check achievements when character changes
  useEffect(() => {
    if (characterContext.character && 
        achievements && 
        Array.isArray(achievements)) {
      
      // Check for completed achievements based on character progress
      try {
        achievements.forEach(achievement => {
          // Basic checks for common achievement types
          if (achievement && !achievement.unlocked) {
            // Check level-based achievements
            if ('requiredLevel' in achievement && characterContext.character.level >= achievement.requiredLevel) {
              checkAndUnlockAchievement(achievement.id);
            }
            
            // Check coin-based achievements
            if ('requiredCoins' in achievement && characterContext.character.coins >= achievement.requiredCoins) {
              checkAndUnlockAchievement(achievement.id);
            }
          }
        });
      } catch (error) {
        console.error("Error checking achievements:", error);
        // Don't block the app if this fails
      }
    }
  }, [
    characterContext.character?.level,
    characterContext.character?.coins,
    achievements,
    checkAndUnlockAchievement
  ]);

  return null;
};
