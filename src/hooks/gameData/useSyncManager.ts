
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GameData } from '@/types/gameData';
import {
  syncCharacterData,
  syncQuestsData,
  syncInventoryData,
  syncSkillTreeData,
  syncHabitsData,
  syncMoodsData,
  syncAchievementsData,
} from './persistence/entitySync';

// Types
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

// Initial throttle time in ms
const INITIAL_THROTTLE_TIME = 5000;
const MAX_THROTTLE_TIME = 30000; // 30 seconds max throttle time
const THROTTLE_INCREASE_FACTOR = 1.5;

export const useSyncManager = (
  gameData: GameData, 
  onChange: Set<string>
) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [throttleTime, setThrottleTime] = useState<number>(INITIAL_THROTTLE_TIME);

  // Manual save function with visual feedback
  const manualSave = async (): Promise<boolean> => {
    if (syncStatus === 'syncing') {
      toast.info("Already saving your progress...");
      return false;
    }

    if (onChange.size === 0) {
      toast.info("No changes to save.");
      return true;
    }

    try {
      setSyncStatus('syncing');
      
      const saveToast = toast.loading("Saving your progress...");
      const success = await syncAllData(gameData, onChange);
      toast.dismiss(saveToast);
      
      if (success) {
        setSyncStatus('success');
        setLastSyncTime(Date.now());
        toast.success("Progress saved successfully!");
        return true;
      } else {
        setSyncStatus('error');
        toast.error("Some data failed to save. Try again later.");
        return false;
      }
    } catch (error) {
      console.error("Error during manual save:", error);
      setSyncStatus('error');
      toast.error("Failed to save progress. Try again later.");
      return false;
    }
  };

  // Auto-sync effect
  useEffect(() => {
    // Skip if no changes or currently syncing
    if (onChange.size === 0 || syncStatus === 'syncing') {
      return;
    }

    // Check if enough time has passed since the last sync
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTime;
    
    if (timeSinceLastSync < throttleTime) {
      const delayTime = throttleTime - timeSinceLastSync;
      
      // Set a timer to sync after the throttle time
      const timerId = setTimeout(() => {
        syncAllData(gameData, onChange)
          .then(success => {
            if (success) {
              setSyncStatus('success');
              setLastSyncTime(Date.now());
              // Reset throttle time on success
              setThrottleTime(INITIAL_THROTTLE_TIME);
            } else {
              setSyncStatus('error');
              // Increase throttle time on failure
              setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
            }
          })
          .catch(error => {
            console.error("Auto sync failed:", error);
            setSyncStatus('error');
            // Increase throttle time on error
            setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
          });
      }, delayTime);
      
      // Clean up the timer if the component is unmounted
      return () => clearTimeout(timerId);
    } else {
      // If sufficient time has passed, sync immediately
      setSyncStatus('syncing');
      
      syncAllData(gameData, onChange)
        .then(success => {
          if (success) {
            setSyncStatus('success');
            setLastSyncTime(Date.now());
            // Reset throttle time on success
            setThrottleTime(INITIAL_THROTTLE_TIME);
          } else {
            setSyncStatus('error');
            // Increase throttle time on failure
            setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
          }
        })
        .catch(error => {
          console.error("Immediate sync failed:", error);
          setSyncStatus('error');
          // Increase throttle time on error
          setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
        });
    }
  }, [gameData, onChange, syncStatus, lastSyncTime, throttleTime]);
  
  return {
    syncStatus,
    lastSyncTime,
    manualSave
  };
};

// Helper function to sync all data
const syncAllData = async (
  gameData: GameData,
  changedFields: Set<string>
): Promise<boolean> => {
  console.log("Starting sync with changed fields:", Array.from(changedFields));
  
  try {
    // Sync each entity type when it's changed
    const promises: Promise<boolean>[] = [];
    
    if (changedFields.has('character') && gameData.character) {
      promises.push(syncCharacterData(gameData, changedFields));
    }
    
    if (changedFields.has('quests') && gameData.quests) {
      promises.push(syncQuestsData(gameData, changedFields));
    }
    
    if (changedFields.has('inventory') && gameData.inventory) {
      promises.push(syncInventoryData(gameData, changedFields));
    }
    
    if (changedFields.has('skillTree') && gameData.skillTree) {
      promises.push(syncSkillTreeData(gameData, changedFields));
    }
    
    if (changedFields.has('habits') && gameData.habits) {
      promises.push(syncHabitsData(gameData, changedFields));
    }
    
    if (changedFields.has('moods') && gameData.moods) {
      promises.push(syncMoodsData(gameData, changedFields));
    }
    
    if (changedFields.has('achievements') && gameData.achievements) {
      promises.push(syncAchievementsData(gameData, changedFields));
    }
    
    // Wait for all sync operations to complete
    const results = await Promise.all(promises);
    
    // Check if all sync operations were successful
    return results.every(result => result === true);
  } catch (error) {
    console.error("Error during sync:", error);
    return false;
  }
};
