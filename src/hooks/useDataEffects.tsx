
import { useEffect } from "react";
import { CharacterContext } from "../contexts/CharacterContext";
import { ChallengeContext } from "../contexts/ChallengeContext";
import { useDailyLogin } from "../features/character/hooks/useDailyLogin";
import { useAchievements } from "../contexts/AchievementContext";
import { useGameData } from "../contexts/DataContext";
import { CharacterContextType, ChallengeContextType } from "../utils/contextTypes";

export const useDataEffects = (
  characterContext: CharacterContextType,
  challengeContext: ChallengeContextType
) => {
  const { achievements, checkAndUnlockAchievement } = useAchievements();
  const { setGameData } = useGameData();

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
          
          // Update the game data with the new character information
          if (setGameData) {
            setGameData(prevData => ({
              ...prevData,
              character: updatedCharacter
            }));
          }
        }
      };
      
      checkDailyLoginStatus();
    }
  // Use lastLoginDate instead of id since Character doesn't have an id property
  }, [characterContext.character?.lastLoginDate, characterContext.character, setGameData]); 

  // Check achievements when challenges or character changes
  useEffect(() => {
    if (characterContext.character && challengeContext.challenges.length > 0) {
      // Check for completed achievements based on character progress
      achievements.forEach(achievement => {
        // Basic checks for common achievement types
        if (!achievement.unlocked) {
          // Check level-based achievements
          if ('requiredLevel' in achievement && characterContext.character.level >= achievement.requiredLevel) {
            checkAndUnlockAchievement(achievement.id);
          }
          
          // Check coin-based achievements
          if ('requiredCoins' in achievement && characterContext.character.coins >= achievement.requiredCoins) {
            checkAndUnlockAchievement(achievement.id);
          }
          
          // Check challenge-based achievements
          if ('requiredChallenges' in achievement && 
              challengeContext.challenges.filter(c => c.status === "completed").length >= achievement.requiredChallenges) {
            checkAndUnlockAchievement(achievement.id);
          }
        }
      });
    }
  }, [
    characterContext.character?.level,
    characterContext.character?.coins,
    challengeContext.challenges.length,
    achievements,
    checkAndUnlockAchievement
  ]);

  return null;
};
