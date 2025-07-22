
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Character, Stats, DEFAULT_CHARACTER } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCharacterFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<GameData>>,
  updateStatus: (entity: string, status: string) => void
) => {
  const fetchCharacter = async (signal?: AbortSignal) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Create the query
      const query = supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      // Execute the query with or without signal
      const { data, error } = await query;
      
      // If aborted, return early
      if (signal?.aborted) {
        console.log('Character fetch aborted');
        return null;
      }

      if (error) throw error;

      if (data) {
        // Map database fields to Character type
        const character: Character = {
          id: data.id,
          name: data.name,
          level: data.level,
          xp: data.xp,
          nextLevelXp: data.next_level_xp,
          coins: data.coins,
          portrait: data.portrait,
          bio: data.bio,
          stats: data.stats as unknown as Stats,
          lastLoginDate: data.last_login_date,
          loginStreak: data.login_streak,
          dailyBonusClaimed: data.daily_bonus_claimed
        };
        
        setGameData(prev => ({ ...prev, character }));
        updateStatus('character', 'loaded');
        return character;
      }

      // Create new character if none exists
      const { upsertCharacter } = await import('@/services/characterService');
      
      const newCharacterData = {
        ...DEFAULT_CHARACTER,
        id: user.id
      };
      
      const newCharacter = await upsertCharacter(newCharacterData);
      
      // Only update game data if we have a character
      if (newCharacter) {
        setGameData(prev => ({ ...prev, character: newCharacter }));
        updateStatus('character', 'loaded');
      }
      
      return newCharacter;

    } catch (error) {
      console.error('Character fetch error:', error);
      updateStatus('character', 'error');
      toast.error(`Failed to load character: ${error.message}`);
      return null;
    }
  };

  return { fetchCharacter };
};
