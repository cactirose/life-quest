
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
  // Don't try to access useGameData here directly, but use a simpler approach
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Create a simplified updateCharacter function
  const updateCharacter = useCallback(async (updates: Partial<Character>) => {
    console.log('Character update requested:', updates);
    // Implementation will be handled by the actual consumer
  }, []);

  // Create a simplified updateStats function
  const updateStats = useCallback(({ xp, coins, level }: { xp?: number; coins?: number; level?: number }) => {
    console.log('Stats update requested:', { xp, coins, level });
    // Implementation will be handled by the actual consumer
  }, []);

  // Provide a minimal context that won't cause circular dependency issues
  const value: CharacterContextType = {
    character: null, // This will be overridden by consumers
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
  
  // Get the real character data from the DataContext
  const { gameData, setGameData } = useGameData();
  const character = gameData?.character || null;
  
  // Override the context with actual implementations
  const updateCharacter = useCallback((updates: Partial<Character>) => {
    if (!character) return;
    
    const updatedCharacter = { ...character, ...updates };
    setGameData({ character: updatedCharacter }, new Set(['character']));
    
    // You might want to sync with Supabase here
  }, [character, setGameData]);
  
  const debouncedUpdate = debounce(updateCharacter, 1000);

  const updateStats = useCallback(({ xp, coins, level }: { xp?: number; coins?: number; level?: number }) => {
    if (!character) return;

    const updates: Partial<Character> = {};
    if (typeof xp === 'number') updates.xp = xp;
    if (typeof coins === 'number') updates.coins = coins;
    if (typeof level === 'number') updates.level = level;

    debouncedUpdate(updates);
  }, [character, debouncedUpdate]);
  
  return {
    ...context,
    character,
    updateCharacter,
    updateStats
  };
};
