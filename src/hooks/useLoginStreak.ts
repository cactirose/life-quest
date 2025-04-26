
import { useEffect } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useServerTime } from "./login-streak/useServerTime";
import { useStreakChecker } from "./login-streak/useStreakChecker";
import { useDailyBonus } from "./login-streak/useDailyBonus";

export const useLoginStreak = () => {
  const gameData = useGameData();
  const { character, setCharacter } = gameData;
  const { serverTime, fetchServerTime } = useServerTime();
  
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
    forceReset
  } = useDailyBonus({ 
    character
  });

  // Check login streak when component mounts
  useEffect(() => {
    if (character) {
      checkLoginStreak();
    }
  }, [character, checkLoginStreak]);

  // Adapted force reset that uses fetchServerTime
  const adaptedForceReset = async () => {
    await forceReset(fetchServerTime);
  };

  return { 
    claimDailyBonus,
    forceReset: adaptedForceReset,
    isCheckingLogin
  };
};
