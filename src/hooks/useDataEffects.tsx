
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
      const { checkDailyLogin } = useDailyLogin(characterContext.character, setGameData);
      checkDailyLogin();
    }
  }, [characterContext.character?.id]); // Only depend on character ID, not the full context

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
