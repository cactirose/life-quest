
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/types/character";
import { GameData } from "@/types/gameData";
import { retrySyncOperation } from "./syncUtils";

export const syncCharacterData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has("character")) {
    return true; // Nothing to sync
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) {
    console.error("No authenticated user for character sync");
    return false;
  }

  try {
    // Check if character exists
    const { data: existingChar } = await supabase
      .from("characters")
      .select("id")
      .eq("user_id", user.user.id)
      .single();

    const characterData = {
      name: gameData.character.name,
      level: gameData.character.level,
      xp: gameData.character.xp,
      next_level_xp: gameData.character.nextLevelXp,
      coins: gameData.character.coins,
      portrait: gameData.character.portrait,
      bio: gameData.character.bio,
      stats: gameData.character.stats,
      last_login_date: gameData.character.lastLoginDate,
      login_streak: gameData.character.loginStreak,
      daily_bonus_claimed: gameData.character.dailyBonusClaimed
    };

    if (existingChar) {
      // Update existing character
      const { error } = await supabase
        .from("characters")
        .update(characterData)
        .eq("user_id", user.user.id);

      if (error) {
        console.error("Error updating character:", error);
        return false;
      }
    } else {
      // Insert new character
      const { error } = await supabase
        .from("characters")
        .insert({
          ...characterData,
          user_id: user.user.id
        });

      if (error) {
        console.error("Error inserting character:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error syncing character data:", error);
    return false;
  }
};
