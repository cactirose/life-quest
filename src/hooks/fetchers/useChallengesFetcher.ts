
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Challenge, ChallengeFrequency, ChallengeStatus } from "@/types/challenges";
import { toast } from "sonner";

export const useChallengesFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchChallenges = async (signal?: AbortSignal) => {
    try {
      updateStatus('challenges', 'loading');
      
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        updateStatus('challenges', 'error');
        return null;
      }
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) {
        console.error("Error loading challenges:", error);
        updateStatus('challenges', 'error');
        return null;
      }
      
      // Check if the signal was aborted
      if (signal?.aborted) {
        console.log("Challenges fetch aborted");
        return null;
      }
      
      // Map database fields to challenge object structure with proper type casting
      const challenges: Challenge[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        frequency: item.frequency as ChallengeFrequency, // Cast to the enum type
        status: item.status as ChallengeStatus, // Cast to the enum type
        currentCount: item.current_count,
        requiredCount: item.required_count,
        xpReward: item.xp_reward,
        coinReward: item.coin_reward,
        statRewards: item.stat_rewards,
        specialReward: item.special_reward,
        resetDate: item.reset_date
      }));
      
      setGameData(prev => ({ ...prev, challenges }));
      updateStatus('challenges', 'loaded');
      return challenges;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Challenges fetch aborted");
        return null;
      }
      
      console.error("Error loading challenges:", error);
      toast.error("Failed to load challenges");
      updateStatus('challenges', 'error');
      return null;
    }
  };

  return { fetchChallenges };
};
