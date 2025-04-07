
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { Challenge, ChallengeFrequency, ChallengeStatus } from '@/types/challenges';
import { StatName } from '@/types/character';

export const useChallengesFetcher = (userId: string | null) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!userId) {
        setChallenges([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        // Map database results to Challenge type
        const mappedChallenges: Challenge[] = data.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description || "",
          frequency: challenge.frequency as ChallengeFrequency, 
          status: challenge.status as ChallengeStatus,
          currentCount: challenge.current_count || 0,
          requiredCount: challenge.required_count || 1,
          xpReward: challenge.xp_reward || 0,
          coinReward: challenge.coin_reward || 0,
          statRewards: challenge.stat_rewards as Partial<Record<StatName, number>> || {},
          specialReward: challenge.special_reward,
          resetDate: challenge.reset_date
        }));

        setChallenges(mappedChallenges);
      } catch (error) {
        console.error('Error fetching challenges: ', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userId]);

  return {
    challenges,
    loading,
    error
  };
};
