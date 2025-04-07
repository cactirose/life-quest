import { useCharacter } from "@/contexts/CharacterContext";

const StatusBar = () => {
  const { character, isLoading } = useCharacter();
  
  if (isLoading || !character) {
    return (
      <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel animate-pulse">
        <span>Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel">
      <span>Level: {character.level}</span>
      <span>XP: {character.xp}/{character.nextLevelXp}</span>
      <span>Coins: {character.coins}</span>
    </div>
  );
};

export default StatusBar;
