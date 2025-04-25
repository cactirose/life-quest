
import { useGameData } from "@/contexts/DataContext";

const StatusBar = () => {
  const { gameData, isLoading } = useGameData();
  
  if (isLoading || !gameData.character) {
    return (
      <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel animate-pulse">
        <span>Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel">
      <span>Level: {gameData.character.level}</span>
      <span>XP: {gameData.character.xp}/{gameData.character.nextLevelXp}</span>
      <span>Coins: {gameData.character.coins}</span>
    </div>
  );
};

export default StatusBar;
