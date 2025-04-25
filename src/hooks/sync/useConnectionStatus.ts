import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConnectionStatus {
  isOnline: boolean;
  supabaseConnected: boolean;
  isInitializing: boolean;
}

export const useConnectionStatus = (): ConnectionStatus => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const failedAttemptsRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  const initialCheckTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Regularly check Supabase connection
    const checkSupabaseConnection = async () => {
      if (!isOnline) {
        setSupabaseConnected(false);
        return;
      }

      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setSupabaseConnected(false);
          return;
        }

        // Then try to make a simple query
        const { error: queryError } = await supabase
          .from('characters')
          .select('id')
          .limit(1)
          .maybeSingle();
        
        if (queryError) {
          console.error("Supabase query error:", queryError);
          failedAttemptsRef.current++;
          
          // Only show error after initial loading period and multiple failures
          if (!isInitializing && failedAttemptsRef.current >= 3) {
            toast.error("Having trouble connecting to the server. Will keep trying...");
          }
          
          setSupabaseConnected(false);
          
          // Set up a retry with exponential backoff
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = setTimeout(() => {
            checkSupabaseConnection();
          }, Math.min(1000 * Math.pow(2, failedAttemptsRef.current), 30000));
          
          return;
        }

        // If we get here, connection is successful
        if (!supabaseConnected) {
          console.log("Supabase connection established");
          if (!isInitializing && failedAttemptsRef.current > 0) {
            toast.success("Connection restored!");
          }
        }
        
        setSupabaseConnected(true);
        failedAttemptsRef.current = 0;
        
      } catch (e) {
        console.error("Failed to check Supabase connection:", e);
        setSupabaseConnected(false);
        
        // Set up retry
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          checkSupabaseConnection();
        }, 5000);
      }
    };
    
    // Initial connection check with timeout
    setIsInitializing(true);
    checkSupabaseConnection();
    
    // Set a timeout for the initial loading state
    initialCheckTimeoutRef.current = setTimeout(() => {
      setIsInitializing(false);
      // If still not connected after initialization period, start showing status
      if (!supabaseConnected) {
        console.log("Initial connection attempt taking longer than expected");
      }
    }, 15000); // 15 second initialization window
    
    // Regular connection checks
    pingIntervalRef.current = setInterval(checkSupabaseConnection, 30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (initialCheckTimeoutRef.current) clearTimeout(initialCheckTimeoutRef.current);
    };
  }, [isOnline, supabaseConnected, isInitializing]);
  
  return { isOnline, supabaseConnected, isInitializing };
};
