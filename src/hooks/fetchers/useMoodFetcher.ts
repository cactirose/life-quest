
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { MoodEntry, MoodType } from "@/types/mood";
import { fetchMoods } from "@/services/moodService";

export const useMoodFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchMoods = async (signal?: AbortSignal): Promise<MoodEntry[]> => {
    try {
      updateStatus('moods', 'loading');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        updateStatus('moods', 'error');
        return [];
      }
      
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching mood entries:", error);
        updateStatus('moods', 'error');
        return [];
      }

      const moods = data.map(entry => ({
        id: entry.id,
        mood: entry.mood as MoodType,
        date: entry.date,
        notes: entry.notes || "",
        factors: [] as string[],  // Default empty arrays for optional fields
        activities: [] as string[]
      }));

      setGameData(prevData => ({
        ...prevData,
        moods: moods
      }));
      
      updateStatus('moods', 'loaded');
      return moods;
    } catch (error) {
      console.error("Error in fetchMoods:", error);
      updateStatus('moods', 'error');
      return [];
    }
  };

  return { fetchMoods };
};
