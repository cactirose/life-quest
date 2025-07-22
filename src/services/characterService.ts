
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Character, StatName } from "@/types/character";

// Character methods
export const fetchCharacter = async (signal?: AbortSignal): Promise<Character | null> => {
  try {
    // Create a timeout promise that will reject after 10 seconds
    const timeoutPromise = new Promise<null>((_, reject) => {
      const id = setTimeout(() => {
        reject(new Error("Character fetch timeout"));
      }, 10000);
      
      // If the signal is aborted, clear the timeout
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(id);
          reject(new Error("Character fetch aborted"));
        });
      }
    });
    
    // Create the actual fetch promise
    const fetchPromise = (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching character:", error);
        return null;
      }

      if (!data) return null;

      // Map database fields to Character type
      return {
        id: data.id,
        name: data.name,
        level: data.level,
        xp: data.xp,
        nextLevelXp: data.next_level_xp,
        coins: data.coins,
        portrait: data.portrait || "/placeholder.svg",
        bio: data.bio || "A brave adventurer ready to conquer life's challenges.",
        stats: data.stats as any,
        lastLoginDate: data.last_login_date,
        loginStreak: data.login_streak,
        dailyBonusClaimed: data.daily_bonus_claimed
      } as Character;
    })();
    
    // Race between the timeout and the fetch
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    // If the error is due to an aborted request, don't log it as an error
    if (signal?.aborted || (error as Error).message === "Character fetch aborted") {
      console.log("Character fetch was aborted");
      return null;
    }
    
    console.error("Error in fetchCharacter:", error);
    return null;
  }
};

export const upsertCharacter = async (character: Character): Promise<Character | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // First check if the user already has a character
    const { data: existingCharacter, error: checkError } = await supabase
      .from("characters")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing character:", checkError);
      throw checkError;
    }

    // Prepare the data for upsert
    const characterData = {
      user_id: user.id,
      name: character.name,
      level: character.level,
      xp: character.xp,
      next_level_xp: character.nextLevelXp,
      coins: character.coins,
      portrait: character.portrait,
      bio: character.bio,
      stats: character.stats,
      last_login_date: character.lastLoginDate,
      login_streak: character.loginStreak,
      daily_bonus_claimed: character.dailyBonusClaimed
    };

    // If character exists, do an update instead of upsert to avoid conflicts
    if (existingCharacter) {
      console.log("Existing character found, updating instead of inserting");
      const { error: updateError } = await supabase
        .from("characters")
        .update(characterData)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating character:", updateError);
        toast.error("Failed to update character data");
        return null;
      }
    } else {
      // Only try to insert if no existing character
      console.log("No existing character found, inserting new record");
      const { error: insertError } = await supabase
        .from("characters")
        .insert([characterData]);

      if (insertError) {
        // Check for duplicate key violation
        if (insertError.code === '23505') {
          console.log("Duplicate character detected. Another process may have created it. Updating instead.");
          
          // Try updating instead
          const { error: updateError } = await supabase
            .from("characters")
            .update(characterData)
            .eq("user_id", user.id);
            
          if (updateError) {
            console.error("Error updating character after duplicate detection:", updateError);
            toast.error("Failed to save character data");
            return null;
          }
        } else {
          console.error("Error inserting character:", insertError);
          toast.error("Failed to save character data");
          return null;
        }
      }
      console.log("Character data saved successfully");
    }
    
    // After successful update/insert, return the character
    return character;
  } catch (error) {
    console.error("Error in upsertCharacter:", error);
    toast.error("Failed to save character data");
    return null;
  }
};
