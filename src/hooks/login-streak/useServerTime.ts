
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useServerTime() {
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServerTime = useCallback(async (): Promise<Date> => {
    try {
      // Try to get the time from the server using a Supabase function
      const { data, error } = await supabase.rpc('get_server_time');
      
      if (error) throw error;
      
      const serverDate = new Date(data);
      setServerTime(serverDate);
      setError(null);
      
      return serverDate;
    } catch (err) {
      console.error("Error fetching server time:", err);
      setError(err as Error);
      
      // Fall back to client time if server time fails
      const clientDate = new Date();
      setServerTime(clientDate);
      return clientDate;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch server time on component mount
  useEffect(() => {
    fetchServerTime();
  }, [fetchServerTime]);

  return {
    serverTime,
    isLoading,
    error,
    fetchServerTime
  };
}
