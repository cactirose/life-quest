
import { useEffect, useCallback } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useServerTime } from "./login-streak/useServerTime";
import { useStreakChecker } from "./login-streak/useStreakChecker";
import { useDailyBonus } from "./login-streak/useDailyBonus";

export const useLoginStreak = () => {
  const { gameData, setGameData } = useGameData();
  const { character } = gameData;
  
  const { serverTime, fetchServerTime } = useServerTime();
  
  // Create a wrapper for setCharacter to update through GameData
  const setCharacter = useCallback((updatedCharacter) => {
    setGameData({ character: updatedCharacter }, new Set(['character']));
  }, [setGameData]);
  
  const { 
    checkLoginStreak,
    isCheckingLogin
  } = useStreakChecker({ 
    character, 
    setCharacter,
    fetchServerTime 
  });
  
  const { 
    claimDailyBonus,
    forceReset,
    isClaimingBonus
  } = useDailyBonus({ 
    character, 
    setGameData 
  });

  // Check login streak when component mounts or when character changes
  useEffect(() => {
    if (character && !isCheckingLogin) {
      checkLoginStreak();
    }
  }, [character?.id, checkLoginStreak, isCheckingLogin]);

  return { 
    claimDailyBonus,
    forceReset,
    isCheckingLogin,
    isClaimingBonus,
    streak: character?.loginStreak || 0,
    canClaimBonus: character && !character.dailyBonusClaimed
  };
};
