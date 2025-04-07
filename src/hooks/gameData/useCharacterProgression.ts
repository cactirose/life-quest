import { useEffect } from "react";
import { useCharacter } from "@/contexts/CharacterContext";
import { toast } from "sonner";

export function useCharacterProgression() {
  const { character, updateStats } = useCharacter();

  useEffect(() => {
    if (!character?.id || !character || character.xp < character.nextLevelXp) {
      return;
    }

    const handleLevelUp = () => {
      const newLevel = character.level + 1;
      const remainingXp = character.xp - character.nextLevelXp;
      const newCoins = character.coins + 25; // Level up bonus

      // Update local state with optimistic update
      updateStats({
        level: newLevel,
        xp: remainingXp,
        coins: newCoins
      });
      
      // Display level up notification
      toast.success(`You've reached level ${newLevel}!`, {
        description: `+25 coins bonus!`
      });
    };

    handleLevelUp();
  }, [character?.xp]);

  return null;
}
