
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Character } from '@/types/character';
import { supabase } from '@/lib/supabase';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { useGameData } from '@/contexts/DataContext';

interface CharacterContextType {
  character: Character | null;
  isLoading: boolean;
  error: Error | null;
  updateCharacter: (updates: Partial<Character>) => void;
  updateStats: (updates: { xp?: number; coins?: number; level?: number }) => void;
}

export const CharacterContext = createContext<CharacterContextType | null>(null);

export const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const { gameData, setGameData } = useGameData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const updateCharacter = useCallback(async (updates: Partial<Character>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const updatedCharacter = { ...gameData.character, ...updates };
      
      // Optimistically update local state
      setGameData({ 
        character: updatedCharacter 
      }, new Set(['character']));

      // Update in Supabase
      const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to update character');
    }
  }, [gameData.character, setGameData]);

  const debouncedUpdate = debounce(updateCharacter, 1000);

  const updateStats = useCallback(({ xp, coins, level }: { xp?: number; coins?: number; level?: number }) => {
    if (!gameData.character) return;

    const updates: Partial<Character> = {};
    if (typeof xp === 'number') updates.xp = xp;
    if (typeof coins === 'number') updates.coins = coins;
    if (typeof level === 'number') updates.level = level;

    debouncedUpdate(updates);
  }, [gameData.character, debouncedUpdate]);

  useEffect(() => {
    setIsLoading(false);
  }, [gameData.character]);

  const value = {
    character: gameData.character,
    isLoading,
    error,
    updateCharacter,
    updateStats,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
