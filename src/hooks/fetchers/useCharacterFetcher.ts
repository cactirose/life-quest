
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Character } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCharacterFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchCharacter = async (signal?: AbortSignal) => {
    try {
      updateStatus('character', 'loading');
      
      const { fetchCharacter } = await import('@/services/characterService');
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Character fetch aborted");
        return null;
      }
      
      const data = await fetchCharacter(signal);
      
      if (data) {
        console.log("Loaded character data from Supabase:", data);
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
        return data;
      } else {
        console.log("No character data returned from Supabase, checking if we need to create one");
        
        // Check if we need to create a character for this user
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.log("No authenticated user, can't create character");
            updateStatus('character', 'error');
            return null;
          }
          
          // Check if we have a character record but failed to fetch it
          const { data: existingCharacter, error: checkError } = await supabase
            .from("characters")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking for existing character:", checkError);
            updateStatus('character', 'error');
            return null;
          }
          
          if (existingCharacter) {
            console.error("Character exists but couldn't be fetched properly. Database error.");
            toast.error("Error loading your character data. Please try again.");
            updateStatus('character', 'error');
            return null;
          }
          
          // If we reach here, there's no character record, so we'll create the default one
          const { DEFAULT_CHARACTER } = await import('@/types/character');
          console.log("Creating default character for new user");
          
          const { upsertCharacter } = await import('@/services/characterService');
          await upsertCharacter(DEFAULT_CHARACTER);
          
          setGameData(prev => ({ ...prev, character: DEFAULT_CHARACTER }));
          updateStatus('character', 'loaded');
          return DEFAULT_CHARACTER;
        } catch (innerError) {
          console.error("Error during character creation check:", innerError);
          updateStatus('character', 'error');
          return null;
        }
      }
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Character fetch aborted");
        return null;
      }
      
      console.error("Error loading character from Supabase:", error);
      updateStatus('character', 'error');
      return null;
    }
  };

  return { fetchCharacter };
};
