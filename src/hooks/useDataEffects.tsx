
import { useEffect } from "react";
import { CharacterContextType } from "../utils/contextTypes";
import { ChallengeContextType } from "../utils/contextTypes";

export function useDataEffects(
  characterContextValue: CharacterContextType,
  challengeContextValue: ChallengeContextType
) {
  // Check daily login on mount
  useEffect(() => {
    characterContextValue.checkDailyLogin();
  }, [characterContextValue]);

  // Daily reset challenges check
  useEffect(() => {
    challengeContextValue.resetChallenges();
  }, [challengeContextValue]);
}
