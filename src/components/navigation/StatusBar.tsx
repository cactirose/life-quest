import { useGameData } from "@/contexts/DataContext";
import { useAuth } from "@/features/auth/context/AuthContext";

const StatusBar = () => {
  const { character } = useGameData();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  // Make sure character data is available
  if (!character || !character.level) {
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
