import { useCallback, useRef, useState } from 'react';
import { GameData } from '@/types/gameData';
import { useSyncWithSupabase } from './persistence/useSyncWithSupabase';
import { toast } from 'sonner';
import { useDebounce } from './persistence/useDebounce';

interface SaveState {
  isSaving: boolean;
  lastSaveTime: Date | null;
  pendingChanges: Set<string>;
  saveQueue: Array<{
    type: 'manual' | 'automatic';
    priority: number;
    timestamp: number;
    data: Partial<GameData>;
  }>;
}

export function useSaveManager(gameData: GameData) {
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaveTime: null,
    pendingChanges: new Set<string>(),
    saveQueue: []
  });

  const { syncWithSupabase } = useSyncWithSupabase();
  const syncErrorCount = useRef(0);
  const isInitialSync = useRef(true);

  // Debounced automatic save
  const debouncedAutoSave = useDebounce(async () => {
    if (saveState.pendingChanges.size === 0) return;

    try {
      setSaveState(prev => ({ ...prev, isSaving: true }));
      const success = await syncWithSupabase(gameData, saveState.pendingChanges, syncErrorCount);
      
      if (success) {
        setSaveState(prev => ({
          ...prev,
          isSaving: false,
          lastSaveTime: new Date(),
          pendingChanges: new Set()
        }));
        isInitialSync.current = false;
      } else {
        throw new Error('Auto-save failed');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveState(prev => ({ ...prev, isSaving: false }));
      toast.error('Auto-save failed. Your changes will be saved when you manually save.');
    }
  }, 30000); // 30 second debounce

  // Manual save function
  const manualSave = useCallback(async () => {
    if (saveState.isSaving) {
      toast.info('A save operation is already in progress');
      return;
    }

    try {
      setSaveState(prev => ({ ...prev, isSaving: true }));
      
      // Force immediate save of all pending changes
      const success = await syncWithSupabase(gameData, saveState.pendingChanges, syncErrorCount);
      
      if (success) {
        setSaveState(prev => ({
          ...prev,
          isSaving: false,
          lastSaveTime: new Date(),
          pendingChanges: new Set()
        }));
        toast.success('All changes saved successfully');
      } else {
        throw new Error('Manual save failed');
      }
    } catch (error) {
      console.error('Manual save error:', error);
      setSaveState(prev => ({ ...prev, isSaving: false }));
      toast.error('Failed to save changes. Please try again.');
    }
  }, [gameData, saveState.pendingChanges, syncWithSupabase]);

  // Track changes and trigger appropriate save
  const trackChanges = useCallback((changedFields: Set<string>) => {
    setSaveState(prev => ({
      ...prev,
      pendingChanges: new Set([...prev.pendingChanges, ...changedFields])
    }));

    // Trigger debounced auto-save
    debouncedAutoSave();
  }, [debouncedAutoSave]);

  // Immediate save for critical changes
  const immediateSave = useCallback(async (changedFields: Set<string>) => {
    if (saveState.isSaving) {
      // Add to queue if already saving
      setSaveState(prev => ({
        ...prev,
        saveQueue: [...prev.saveQueue, {
          type: 'automatic',
          priority: 1,
          timestamp: Date.now(),
          data: gameData
        }]
      }));
      return;
    }

    try {
      setSaveState(prev => ({ ...prev, isSaving: true }));
      const success = await syncWithSupabase(gameData, changedFields, syncErrorCount);
      
      if (success) {
        setSaveState(prev => ({
          ...prev,
          isSaving: false,
          lastSaveTime: new Date(),
          pendingChanges: new Set([...prev.pendingChanges].filter(field => !changedFields.has(field)))
        }));
      } else {
        throw new Error('Immediate save failed');
      }
    } catch (error) {
      console.error('Immediate save error:', error);
      setSaveState(prev => ({ ...prev, isSaving: false }));
      toast.error('Failed to save critical changes. Please try again.');
    }
  }, [gameData, syncWithSupabase]);

  return {
    saveState,
    manualSave,
    trackChanges,
    immediateSave
  };
} 