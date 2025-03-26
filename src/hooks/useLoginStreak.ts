
import { useEffect } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useServerTime } from "./login-streak/useServerTime";
import { useStreakChecker } from "./login-streak/useStreakChecker";
import { useDailyBonus } from "./login-streak/useDailyBonus";
import { startOfDay } from "date-fns";

export const useLoginStreak = () => {
  const { character, setCharacter, setGameData } = useGameData();
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
    forceReset,
    isClaimingBonus
  } = useDailyBonus({ 
    character, 
    setGameData 
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
    isCheckingLogin,
    isClaimingBonus
  };
};
