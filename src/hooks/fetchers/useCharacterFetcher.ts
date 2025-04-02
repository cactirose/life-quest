import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Character, Stats } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DEFAULT_CHARACTER } from "@/types/character";

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
          name: data.name,
          level: data.level,
          xp: data.xp,
          nextLevelXp: data.next_level_xp,
          coins: data.coins,
          portrait: data.portrait,
          bio: data.bio,
          stats: data.stats as Stats,
          lastLoginDate: data.last_login_date,
          loginStreak: data.login_streak,
          dailyBonusClaimed: data.daily_bonus_claimed
        };
        
        setGameData(prev => ({ ...prev, character }));
        updateStatus('character', 'loaded');
        return character;
      }

      // Create new character if none exists
      console.log('Creating new character for user:', user.id);
      
      // Insert the new character directly
      const { data: newCharacter, error: insertError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: DEFAULT_CHARACTER.name,
          level: DEFAULT_CHARACTER.level,
          xp: DEFAULT_CHARACTER.xp,
          next_level_xp: DEFAULT_CHARACTER.nextLevelXp,
          coins: DEFAULT_CHARACTER.coins,
          portrait: DEFAULT_CHARACTER.portrait,
          bio: DEFAULT_CHARACTER.bio,
          stats: DEFAULT_CHARACTER.stats,
          last_login_date: null,
          login_streak: 0,
          daily_bonus_claimed: false
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating character:', insertError);
        throw insertError;
      }

      if (newCharacter) {
        // Map the new character data to our Character type
        const character: Character = {
          name: newCharacter.name,
          level: newCharacter.level,
          xp: newCharacter.xp,
          nextLevelXp: newCharacter.next_level_xp,
          coins: newCharacter.coins,
          portrait: newCharacter.portrait,
          bio: newCharacter.bio,
          stats: newCharacter.stats as Stats,
          lastLoginDate: newCharacter.last_login_date,
          loginStreak: newCharacter.login_streak,
          dailyBonusClaimed: newCharacter.daily_bonus_claimed
        };

        setGameData(prev => ({ ...prev, character }));
        updateStatus('character', 'loaded');
        toast.success('Created your new character!');
        return character;
      }

      throw new Error('Failed to create character');
    } catch (error) {
      console.error('Character fetch error:', error);
      updateStatus('character', 'error');
      toast.error(`Failed to load character: ${error.message}`);
      return null;
    }
  };

  return { fetchCharacter };
};
