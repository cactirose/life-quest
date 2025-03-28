import { useState, useCallback, useEffect } from "react";
import { ServerTimeResponse } from '@/types/supabase';
import { supabase } from "@/integrations/supabase/client";
import { typedRPC } from '@/lib/supabase/rpc';

export const useServerTime = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);

  // Fetch server time from Supabase
  const fetchServerTime = useCallback(async () => {
    try {
      // Add explicit type parameter to rpc call
      const { data, error } = await typedRPC.get_server_time();
      
      if (error) throw error;
      
      // Data should be a timestamp string like '2023-08-01T12:00:00Z'
      if (data) {
        // Type assertions are safe here since we know the data structure
        const serverDate = new Date(data as string);
        console.log("Server time:", serverDate.toISOString());
        setServerTime(serverDate);
        return serverDate;
      }
      
      return new Date(); // Fallback to local time if server time unavailable
    } catch (error) {
      console.error("Error fetching server time:", error);
      return new Date(); // Fallback to local time
    }
  }, []);

  // Update server time periodically
  useEffect(() => {
    // Initial fetch
    fetchServerTime();
    
    // Update every 10 minutes
    const serverTimeInterval = setInterval(() => {
      fetchServerTime();
    }, 600000); // 10 minutes
    
    return () => clearInterval(serverTimeInterval);
  }, [fetchServerTime]);

  return { serverTime, fetchServerTime };
};
