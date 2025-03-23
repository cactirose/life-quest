
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

      const query = supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      // Only add abort signal if provided
      const { data, error } = signal 
        ? await query.abortSignal(signal)
        : await query;

      if (error) throw error;

      if (data) {
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
        return data;
      }

      // Create new character if none exists
      const { DEFAULT_CHARACTER } = await import('@/types/character');
      const { upsertCharacter } = await import('@/services/characterService');
      
      const newCharacterData = {
        ...DEFAULT_CHARACTER,
        user_id: user.id
      };
      
      const newCharacter = await upsertCharacter(newCharacterData);

      setGameData(prev => ({ ...prev, character: newCharacter }));
      updateStatus('character', 'loaded');
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
