
import { useCallback, useRef, useState } from 'react';
import { GameData } from '@/types/gameData';
import { toast } from 'sonner';
import { useDebounce } from './persistence/useDebounce';

interface SaveProps {
  saveData: (gameData: GameData, fields: Set<string>) => Promise<boolean>;
  gameData: GameData;
}

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

export function useSaveManager({ saveData, gameData }: SaveProps) {
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaveTime: null,
    pendingChanges: new Set<string>(),
    saveQueue: []
  });

  const syncErrorCount = useRef(0);
  const isInitialSync = useRef(true);

  // Debounced automatic save
  const debouncedAutoSave = useDebounce(async () => {
    if (saveState.pendingChanges.size === 0) return;

    try {
      setSaveState(prev => ({ ...prev, isSaving: true }));
      const success = await saveData(gameData, saveState.pendingChanges);
      
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

  // Handle game data change, tracking changes and scheduling save
  const handleGameDataChange = useCallback((updatedData: GameData, changedFields?: Set<string>) => {
    if (changedFields && changedFields.size > 0) {
      setSaveState(prev => ({
        ...prev,
        pendingChanges: new Set([...prev.pendingChanges, ...changedFields])
      }));
      
      // Trigger debounced auto-save
      debouncedAutoSave();
    }
  }, [debouncedAutoSave]);

  // Manual save function
  const saveImmediately = useCallback(async () => {
    if (saveState.isSaving) {
      toast.info('A save operation is already in progress');
      return false;
    }

    try {
      setSaveState(prev => ({ ...prev, isSaving: true }));
      
      // Force immediate save of all pending changes
      const success = await saveData(gameData, saveState.pendingChanges);
      
      if (success) {
        setSaveState(prev => ({
          ...prev,
          isSaving: false,
          lastSaveTime: new Date(),
          pendingChanges: new Set()
        }));
        toast.success('All changes saved successfully');
        return true;
      } else {
        throw new Error('Manual save failed');
      }
    } catch (error) {
      console.error('Manual save error:', error);
      setSaveState(prev => ({ ...prev, isSaving: false }));
      toast.error('Failed to save changes. Please try again.');
      return false;
    }
  }, [gameData, saveState.pendingChanges, saveState.isSaving, saveData]);

  return {
    saveState,
    handleGameDataChange,
    saveImmediately
  };
}
