
import { useState, useEffect } from "react";
import { Character } from "@/types/character";
import { GameDataUpdater } from "@/utils/contextTypes";
import { upsertCharacter } from "@/services/characterService";
import { upsertInventoryItem } from "@/services/inventoryService";
import { checkConsecutiveLogin, calculateDailyBonus, createStreakTrophy } from "../utils/dailyLoginUtils";
import { startOfDay, format } from "date-fns";
import { toast } from "sonner";

export const useDailyLogin = (
  character: Character, 
  setGameData: GameDataUpdater
) => {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  // Re-check daily login status at midnight
  useEffect(() => {
    // Only set up timer if character exists
    if (character && Object.keys(character).length > 0) {
      // Calculate time until midnight
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();
      
      // Set a timer to auto-check login status at midnight
      const midnightTimer = setTimeout(() => {
        checkDailyLogin();
      }, msUntilMidnight);
      
      return () => clearTimeout(midnightTimer);
    }
  }, [character?.lastLoginDate]);

  const checkDailyLogin = async () => {
    if (!character || isCheckingLogin) return;
    
    try {
      setIsCheckingLogin(true);
      
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
      const lastLoginDate = character.lastLoginDate 
        ? format(startOfDay(new Date(character.lastLoginDate)), 'yyyy-MM-dd')
        : null;
      
      console.log(`Checking daily login - Today: ${today}, Last login: ${lastLoginDate}`);
      
      const { isConsecutive, isFirstLogin, isSameDay } = checkConsecutiveLogin(character.lastLoginDate);
      
      // Same day login, do nothing
      if (isSameDay) {
        console.log("Same day login, no updates needed");
        setIsCheckingLogin(false);
        return;
      }
      
      // Update character based on login status
      let updatedCharacter;
      
      // First login ever
      if (isFirstLogin) {
        updatedCharacter = {
          ...character,
          lastLoginDate: new Date().toISOString(),
          loginStreak: 1,
          dailyBonusClaimed: false
        };
        toast.success("Welcome to your first day!");
      }
      // Consecutive day
      else if (isConsecutive) {
        updatedCharacter = {
          ...character,
          lastLoginDate: new Date().toISOString(),
          loginStreak: character.loginStreak + 1,
          dailyBonusClaimed: false
        };
        toast.success(`Welcome back! You're on a ${character.loginStreak + 1} day streak!`);
      }
      // Not consecutive, reset streak
      else {
        updatedCharacter = {
          ...character,
          lastLoginDate: new Date().toISOString(),
          loginStreak: 1,
          dailyBonusClaimed: false
        };
        toast.info("Welcome back! Your login streak has been reset.");
      }
      
      // Sync with Supabase
      await upsertCharacter(updatedCharacter);
      
      // Update local state
      setGameData(prevData => ({
        ...prevData,
        character: updatedCharacter
      }));
      
    } catch (error) {
      console.error("Error checking daily login:", error);
      toast.error("Failed to update login status. Please refresh the page.");
    } finally {
      setIsCheckingLogin(false);
    }
  };
  
  const claimDailyBonus = async () => {
    if (!character || character.dailyBonusClaimed || isClaimingBonus) return;
    
    try {
      setIsClaimingBonus(true);
      
      // Calculate bonus based on streak
      const streak = character.loginStreak;
      const { xpBonus, coinBonus } = calculateDailyBonus(streak);
      
      // Every 7 days, give a special bonus
      let specialItem = null;
      if (streak % 7 === 0) {
        specialItem = createStreakTrophy(streak);
        
        // Sync new inventory item with Supabase
        if (specialItem) {
          await upsertInventoryItem(specialItem);
          toast.success(`You received a special trophy for your ${streak}-day streak!`);
        }
      }
      
      // Update character
      const updatedCharacter = {
        ...character,
        xp: character.xp + xpBonus,
        coins: character.coins + coinBonus,
        dailyBonusClaimed: true
      };
      
      // Sync with Supabase
      await upsertCharacter(updatedCharacter);
      
      // Update local state
      setGameData(prevData => {
        // Update inventory if special item
        const updatedInventory = specialItem
          ? [...prevData.inventory, specialItem]
          : prevData.inventory;
        
        return {
          ...prevData,
          character: updatedCharacter,
          inventory: updatedInventory
        };
      });
      
      toast.success(`Daily bonus claimed! +${xpBonus} XP, +${coinBonus} coins`);
    } catch (error) {
      console.error("Error claiming daily bonus:", error);
      toast.error("Failed to claim daily bonus. Please try again.");
    } finally {
      setIsClaimingBonus(false);
    }
  };

  return {
    checkDailyLogin,
    claimDailyBonus,
    isCheckingLogin,
    isClaimingBonus
  };
};
