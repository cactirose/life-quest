import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Character } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCharacterFetcher = (
  setGameData: GameDataUpdater,
  updateStatus: (entity: string, status: string) => void
) => {
  const fetchCharacter = async (signal?: AbortSignal) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .abortSignal(signal);

      if (error) throw error;

      if (data) {
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
        return data;
      }

      // Create new character if none exists
      const { DEFAULT_CHARACTER } = await import('@/types/character');
      const { upsertCharacter } = await import('@/services/characterService');
      
      const newCharacter = await upsertCharacter({
        ...DEFAULT_CHARACTER,
        user_id: user.id
      });

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
