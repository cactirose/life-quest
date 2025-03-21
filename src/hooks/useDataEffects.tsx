
import { useEffect } from "react";
import { CharacterContext } from "../contexts/CharacterContext";
import { ChallengeContext } from "../contexts/ChallengeContext";
import { useDailyLogin } from "../features/character/hooks/useDailyLogin";
import { useAchievementManager } from "../features/achievements/hooks/useAchievementManager";
import { useAchievements } from "../contexts/AchievementContext";
import { useGameData } from "../contexts/DataContext";

export const useDataEffects = (
  characterContext: ReturnType<typeof CharacterContext.Provider>["props"]["value"],
  challengeContext: ReturnType<typeof ChallengeContext.Provider>["props"]["value"]
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
          if (achievement.trackLevel && characterContext.character.level >= achievement.trackLevel) {
            checkAndUnlockAchievement(achievement.id);
          }
          
          // Check coin-based achievements
          if (achievement.trackCoins && characterContext.character.coins >= achievement.trackCoins) {
            checkAndUnlockAchievement(achievement.id);
          }
          
          // Check challenge-based achievements
          if (achievement.trackChallenges && challengeContext.challenges.filter(c => c.status === "completed").length >= achievement.trackChallenges) {
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
