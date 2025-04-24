import { useEffect } from "react";
import { useAchievements } from "../contexts/AchievementContext";
import { GameData } from "@/types/gameData";
import { CharacterContextValue } from "../utils/contextTypes";
import { toast } from "sonner";
import { DEFAULT_CHARACTER } from "@/types/character";

export const useDataEffects = (
  gameData: GameData,
  setGameData: (newData: Partial<GameData>, changedFields: Set<string>) => void,
  characterContext?: CharacterContextValue
) => {
  const { achievements, checkAndUnlockAchievement } = useAchievements();

  // Use the character from the context if provided, otherwise use the one from GameData, falling back to DEFAULT_CHARACTER
  const characterData = characterContext?.character || gameData?.character || DEFAULT_CHARACTER;

  // Check daily login only once when the component mounts
  useEffect(() => {
    // Only check daily login if character data is available
    if (characterData) {
      // Create a function to check daily login within the effect
      const checkDailyLoginStatus = () => {
        // Get the current date as a string
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = characterData.lastLoginDate 
          ? new Date(characterData.lastLoginDate).toISOString().split('T')[0]
          : null;
        
        // Only update if it's a new day (player hasn't logged in today)
        if (lastLogin !== today) {
          // Update the character's lastLoginDate and streak
          const updatedCharacter = {
            ...characterData,
            lastLoginDate: new Date().toISOString(),
            loginStreak: lastLogin ? characterData.loginStreak + 1 : 1,
            dailyBonusClaimed: false
          };
          
          // Update the game data with the new character information
          setGameData({ character: updatedCharacter }, new Set(['character']));
        }
      };
      
      try {
        checkDailyLoginStatus();
      } catch (error) {
        console.error("Error during daily login check:", error);
        // Don't block the app if this fails
      }
    }
  }, [characterData?.lastLoginDate, characterData, setGameData]);

  // Check achievements when character changes
  useEffect(() => {
    if (characterData && achievements && Array.isArray(achievements)) {
      // Check for completed achievements based on character progress
      try {
        achievements.forEach(achievement => {
          // Basic checks for common achievement types
          if (achievement && !achievement.unlocked) {
            // Check level-based achievements
            if ('requiredLevel' in achievement && characterData.level >= achievement.requiredLevel) {
              checkAndUnlockAchievement(achievement.id);
            }
            
            // Check coin-based achievements
            if ('requiredCoins' in achievement && characterData.coins >= achievement.requiredCoins) {
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
    characterData?.level,
    characterData?.coins,
    achievements,
    checkAndUnlockAchievement
  ]);

  return null;
};
