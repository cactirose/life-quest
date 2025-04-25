
import { createContext, useContext, ReactNode } from "react";
import { Character, StatName, DEFAULT_CHARACTER } from "../types/character";
import { useCharacterStats } from "@/features/character/hooks/useCharacterStats";
import { useDailyLogin } from "@/features/character/hooks/useDailyLogin";
import { useCharacterReset } from "@/features/character/hooks/useCharacterReset";

interface CharacterContextType {
  character: Character;
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  checkDailyLogin: () => void;
  claimDailyBonus: () => void;
  resetCharacter: () => void;
}

export const CharacterContext = createContext<CharacterContextType>({} as CharacterContextType);

export const useCharacter = () => useContext(CharacterContext);

export const createCharacterContextValue = (
  character: Character,
  setGameData: React.Dispatch<React.SetStateAction<any>>
): CharacterContextType => {
  // Character stats management
  const { setCharacter, updateCharacterStat } = useCharacterStats(character, setGameData);
  
  // Daily login functionality
  const { checkDailyLogin, claimDailyBonus } = useDailyLogin(character, setGameData);
  
  // Character reset functionality
  const { resetCharacter } = useCharacterReset(character, setGameData);

  return {
    character,
    setCharacter,
    updateCharacterStat,
    checkDailyLogin,
    claimDailyBonus,
    resetCharacter
  };
};
