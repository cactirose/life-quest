
// This hook now returns a function to process character progression instead of using useCharacter directly
export function useCharacterProgression() {
  // Process character progression based on XP
  const processCharacterProgression = (gameData) => {
    if (!gameData?.character) {
      return gameData;
    }
    
    const character = gameData.character;
    
    // Check if the character has enough XP to level up
    if (character.xp >= character.nextLevelXp) {
      // Calculate new level and remaining XP
      const newLevel = character.level + 1;
      const remainingXp = character.xp - character.nextLevelXp;
      const newCoins = character.coins + 25; // Level up bonus
      const nextLevelXp = Math.floor(character.nextLevelXp * 1.2); // Increase XP needed for next level
      
      // Update character with new values
      const updatedCharacter = {
        ...character,
        level: newLevel,
        xp: remainingXp,
        coins: newCoins,
        nextLevelXp
      };
      
      // Return updated gameData
      return {
        ...gameData,
        character: updatedCharacter
      };
    }
    
    return gameData;
  };
  
  return { processCharacterProgression };
}
