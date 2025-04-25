
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionStatus {
  isOnline: boolean;
  supabaseConnected: boolean;
}

export const useConnectionStatus = (): ConnectionStatus => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Regularly check Supabase connection
    const checkSupabaseConnection = async () => {
      try {
        // Use a simple query to check if Supabase is reachable
        const { error } = await supabase
          .from('characters')  // Use an existing table instead of 'health_check'
          .select('id')
          .limit(1);
        
        setSupabaseConnected(!error);
      } catch (e) {
        console.error("Failed to check Supabase connection:", e);
        setSupabaseConnected(false);
      }
    };
    
    // Check connection immediately and then periodically
    checkSupabaseConnection();
    pingIntervalRef.current = setInterval(checkSupabaseConnection, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, []);
  
  return { isOnline, supabaseConnected };
};
