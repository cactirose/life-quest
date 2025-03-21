
import { useGameData } from "@/contexts/DataContext";

const StatusBar = () => {
  const { character } = useGameData();
  
  return (
    <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel">
      <span>Level: {character.level}</span>
      <span>XP: {character.xp}/{character.nextLevelXp}</span>
      <span>Coins: {character.coins}</span>
    </div>
  );
};

export default StatusBar;
