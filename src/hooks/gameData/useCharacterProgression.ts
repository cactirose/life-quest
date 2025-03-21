
import { useEffect } from "react";
import { GameData } from "@/types/gameData";
import { toast } from "sonner";

export function useCharacterProgression(
  gameData: GameData, 
  setGameData: React.Dispatch<React.SetStateAction<GameData>>
) {
  useEffect(() => {
    const { character } = gameData;
    if (character && character.xp >= character.nextLevelXp) {
      // Level up!
      setGameData(prevData => ({
        ...prevData,
        character: {
          ...prevData.character,
          level: prevData.character.level + 1,
          xp: prevData.character.xp - prevData.character.nextLevelXp,
          nextLevelXp: Math.floor(prevData.character.nextLevelXp * 1.5),
          coins: prevData.character.coins + 25 // Level up bonus
        }
      }));
      
      // Display level up notification
      toast(`You've reached level ${character.level + 1}!`);
    }
  }, [gameData.character?.xp, setGameData]);

  return null;
}
