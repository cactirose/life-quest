
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Character } from "@/types/character";
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
        setGameData(prev => ({ ...prev, character: data as Character }));
        updateStatus('character', 'loaded');
        return data as Character;
      }

      // Create new character if none exists
      const { DEFAULT_CHARACTER } = await import('@/types/character');
      const { upsertCharacter } = await import('@/services/characterService');
      
      const newCharacterData = {
        ...DEFAULT_CHARACTER,
        user_id: user.id
      };
      
      const newCharacter = await upsertCharacter(newCharacterData);

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
