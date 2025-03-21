
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Character, StatName } from "@/types/character";

// Character methods
export const fetchCharacter = async (): Promise<Character | null> => {
  try {
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
  } catch (error) {
    console.error("Error in fetchCharacter:", error);
    return null;
  }
};

export const upsertCharacter = async (character: Character): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("characters")
      .upsert({
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
      });

    if (error) {
      console.error("Error upserting character:", error);
      toast.error("Failed to save character data");
    }
  } catch (error) {
    console.error("Error in upsertCharacter:", error);
    toast.error("Failed to save character data");
  }
};
