
import { createContext, useContext } from "react";
import { Challenge, ChallengeStatus } from "../types/challenges";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";

interface ChallengeContextType {
  challenges: Challenge[];
  addChallenge: (challenge: Omit<Challenge, "id">) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
  incrementChallengeProgress: (challengeId: string) => void;
  resetChallenges: () => void;
  completeChallenge: (challengeId: string) => void;
}

export const ChallengeContext = createContext<ChallengeContextType>({} as ChallengeContextType);

export const useChallenges = () => useContext(ChallengeContext);

export const createChallengeContextValue = (
  challenges: Challenge[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): ChallengeContextType => {
  const addChallenge = (challenge: Omit<Challenge, "id">) => {
    const newChallenge = {
      ...challenge,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      challenges: [...prevData.challenges, newChallenge]
    }));
  };

  const updateChallenge = (challenge: Challenge) => {
    setGameData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.map(c => 
        c.id === challenge.id ? challenge : c
      )
    }));
  };

  const deleteChallenge = (challengeId: string) => {
    setGameData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.filter(c => c.id !== challengeId)
    }));
  };

  const incrementChallengeProgress = (challengeId: string) => {
    setGameData(prevData => {
      const updatedChallenges = prevData.challenges.map(challenge => {
        if (challenge.id !== challengeId || challenge.status === "completed") return challenge;
        
        const newCount = challenge.currentCount + 1;
        return {
          ...challenge,
          currentCount: newCount,
          status: newCount >= challenge.requiredCount ? "completed" as ChallengeStatus : challenge.status
        };
      });
      
      return { ...prevData, challenges: updatedChallenges };
    });
  };
  
  const resetChallenges = () => {
    const today = new Date();
    
    setGameData(prevData => {
      const updatedChallenges = prevData.challenges.map(challenge => {
        const resetDate = new Date(challenge.resetDate);
        
        // If this challenge needs to be reset
        if (today >= resetDate) {
          let newResetDate: Date;
          
          // Calculate next reset date based on frequency
          switch (challenge.frequency) {
            case "daily":
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + 1);
              newResetDate.setHours(0, 0, 0, 0);
              break;
            case "weekly":
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + (7 - today.getDay()));
              newResetDate.setHours(0, 0, 0, 0);
              break;
            case "monthly":
              newResetDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
              break;
            default:
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + 1);
          }
          
          return {
            ...challenge,
            status: "active" as ChallengeStatus,
            currentCount: 0,
            resetDate: newResetDate.toISOString()
          };
        }
        
        return challenge;
      });
      
      return { ...prevData, challenges: updatedChallenges };
    });
  };
  
  const completeChallenge = (challengeId: string) => {
    setGameData(prevData => {
      const challenge = prevData.challenges.find(c => c.id === challengeId);
      if (!challenge || challenge.status === "completed") return prevData;
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + challenge.xpReward,
        coins: prevData.character.coins + challenge.coinReward,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(challenge.statRewards).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Record<StatName, number>)
        }
      };
      
      // Add special reward to inventory if provided
      let updatedInventory = [...prevData.inventory];
      if (challenge.specialReward) {
        updatedInventory = [...updatedInventory, {
          ...challenge.specialReward,
          id: challenge.specialReward.id || generateId()
        }];
      }
      
      // Update challenge status
      const updatedChallenges = prevData.challenges.map(c => 
        c.id === challengeId ? { ...c, status: "completed" as ChallengeStatus } : c
      );
      
      return { 
        ...prevData, 
        character: updatedCharacter,
        inventory: updatedInventory,
        challenges: updatedChallenges
      };
    });
  };

  return {
    challenges,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    incrementChallengeProgress,
    resetChallenges,
    completeChallenge
  };
};
