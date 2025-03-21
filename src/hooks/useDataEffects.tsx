
import { useEffect } from "react";
import { CharacterContextProps } from "../contexts/CharacterContext";
import { ChallengeContextProps } from "../contexts/ChallengeContext";
import { checkDailyLogin } from "../features/character/hooks/useDailyLogin";
import { useAchievementManager } from "../features/achievements/hooks/useAchievementManager";

export const useDataEffects = (
  characterContext: CharacterContextProps,
  challengeContext: ChallengeContextProps
) => {
  const { checkCompletedAchievements } = useAchievementManager();

  // Check daily login only once when the component mounts
  useEffect(() => {
    // Only check daily login if character data is available
    if (characterContext.character) {
      checkDailyLogin(characterContext);
    }
  }, [characterContext.character?.id]); // Only depend on character ID, not the full context

  // Check achievements when challenges or character changes
  useEffect(() => {
    if (characterContext.character && challengeContext.challenges.length > 0) {
      checkCompletedAchievements();
    }
  }, [
    characterContext.character?.level,
    characterContext.character?.coins,
    challengeContext.challenges.length,
    checkCompletedAchievements
  ]);

  return null;
};
