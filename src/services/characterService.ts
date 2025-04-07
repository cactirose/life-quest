import { supabase } from "@/integrations/supabase/client";
import { Character, Stats } from "@/types/character";
import { toast } from "sonner";

export const fetchCharacter = async (): Promise<Character | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return null;

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      console.error("Error fetching character:", error);
      return null;
    }

    if (!data) {
      console.warn("No character data found");
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      level: data.level,
      xp: data.xp,
      nextLevelXp: data.next_level_xp || 100,
      coins: data.coins,
      portrait: data.portrait || "/placeholder.svg",
      bio: data.bio || "A brave adventurer ready to conquer life's challenges.",
      stats: data.stats as Stats,
      lastLoginDate: data.last_login_date,
      loginStreak: data.login_streak || 0,
      dailyBonusClaimed: data.daily_bonus_claimed || false
    };
  } catch (error) {
    console.error("Error in fetchCharacter:", error);
    return null;
  }
};

export const updateCharacter = async (character: Character): Promise<Character | null> => {
  try {
    const { error } = await supabase
      .from("characters")
      .update({
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
      })
      .eq("id", character.id);

    if (error) {
      console.error("Error updating character:", error);
      toast.error("Failed to update character");
      return null;
    }

    return character;
  } catch (error) {
    console.error("Error in updateCharacter:", error);
    toast.error("Failed to update character");
    return null;
  }
};

export const upsertCharacter = async (character: Character): Promise<Character | null> => {
  try {
    // Check if character already exists
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    const { data } = await supabase
      .from("characters")
      .select("id")
      .eq("id", character.id)
      .single();

    // If character exists, update it, otherwise create it
    if (data) {
      return updateCharacter(character);
    } else {
      // Create character
      const { error } = await supabase
        .from("characters")
        .insert([
          {
            id: character.id,
            user_id: user.user.id,
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
          },
        ]);

      if (error) {
        console.error("Error creating character:", error);
        toast.error("Failed to create character");
        return null;
      }

      return character;
    }
  } catch (error) {
    console.error("Error in upsertCharacter:", error);
    toast.error("Failed to save character");
    return null;
  }
};

export const updateCharacterStats = async (
  characterId: string,
  updates: {
    xp?: number;
    coins?: number;
    level?: number;
    nextLevelXp?: number;
  }
): Promise<Character | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      console.error("No authenticated user");
      return null;
    }

    // First get the current character data to ensure we have the latest state
    const { data: currentChar, error: fetchError } = await supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .single();

    if (fetchError) {
      console.error("Error fetching current character state:", fetchError);
      return null;
    }

    // Merge current values with updates
    const updatedValues = {
      xp: updates.xp ?? currentChar.xp,
      coins: updates.coins ?? currentChar.coins,
      level: updates.level ?? currentChar.level,
      next_level_xp: updates.nextLevelXp ?? currentChar.next_level_xp,
      updated_at: new Date().toISOString()
    };

    // Perform the update
    const { data: updatedChar, error: updateError } = await supabase
      .from("characters")
      .update(updatedValues)
      .eq("id", characterId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating character stats:", updateError);
      return null;
    }

    // Map the database response to our Character type
    return {
      id: updatedChar.id,
      name: updatedChar.name,
      level: updatedChar.level,
      xp: updatedChar.xp,
      nextLevelXp: updatedChar.next_level_xp,
      coins: updatedChar.coins,
      portrait: updatedChar.portrait || "/placeholder.svg",
      bio: updatedChar.bio || "A brave adventurer ready to conquer life's challenges.",
      stats: updatedChar.stats as Stats,
      lastLoginDate: updatedChar.last_login_date,
      loginStreak: updatedChar.login_streak || 0,
      dailyBonusClaimed: updatedChar.daily_bonus_claimed || false
    };
  } catch (error) {
    console.error("Error in updateCharacterStats:", error);
    return null;
  }
};
