import { useState, useEffect, useRef } from 'react';
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
  const syncInProgressRef = useRef<boolean>(false);
  const pendingSyncRef = useRef<boolean>(false);

  // Manual save function with visual feedback
  const manualSave = async (): Promise<boolean> => {
    if (syncStatus === 'syncing' || syncInProgressRef.current) {
      toast.info("Already saving your progress...");
      return false;
    }

    if (onChange.size === 0) {
      toast.info("No changes to save.");
      return true;
    }

    try {
      setSyncStatus('syncing');
      syncInProgressRef.current = true;
      
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
    } finally {
      syncInProgressRef.current = false;
    }
  };

  // Auto-sync effect
  useEffect(() => {
    // Skip if no changes or currently syncing
    if (onChange.size === 0 || syncStatus === 'syncing' || syncInProgressRef.current) {
      return;
    }

    const timeSinceLastSync = Date.now() - lastSyncTime;
    
    // If we're within the throttle time, wait
    if (timeSinceLastSync < throttleTime) {
      const remainingTime = throttleTime - timeSinceLastSync;
      const timeoutId = setTimeout(() => {
        setSyncStatus('syncing');
        syncInProgressRef.current = true;
        
        syncAllData(gameData, onChange)
          .then(success => {
            if (success) {
              setSyncStatus('success');
              setLastSyncTime(Date.now());
              setThrottleTime(INITIAL_THROTTLE_TIME);
            } else {
              setSyncStatus('error');
              setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
            }
          })
          .catch(error => {
            console.error("Delayed sync failed:", error);
            setSyncStatus('error');
            setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
          })
          .finally(() => {
            syncInProgressRef.current = false;
          });
      }, remainingTime);
      
      return () => clearTimeout(timeoutId);
    } else {
      // If sufficient time has passed, sync immediately
      setSyncStatus('syncing');
      syncInProgressRef.current = true;
      
      syncAllData(gameData, onChange)
        .then(success => {
          if (success) {
            setSyncStatus('success');
            setLastSyncTime(Date.now());
            setThrottleTime(INITIAL_THROTTLE_TIME);
          } else {
            setSyncStatus('error');
            setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
          }
        })
        .catch(error => {
          console.error("Immediate sync failed:", error);
          setSyncStatus('error');
          setThrottleTime(prev => Math.min(prev * THROTTLE_INCREASE_FACTOR, MAX_THROTTLE_TIME));
        })
        .finally(() => {
          syncInProgressRef.current = false;
        });
    }
  }, [gameData, onChange, syncStatus, lastSyncTime, throttleTime]);

  // Add beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (syncInProgressRef.current || pendingSyncRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    syncStatus,
    lastSyncTime,
    manualSave,
    isSyncing: syncInProgressRef.current
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
