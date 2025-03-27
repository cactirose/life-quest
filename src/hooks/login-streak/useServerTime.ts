
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useServerTime = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);

  // Fetch server time from Supabase
  const fetchServerTime = useCallback(async () => {
    try {
      // Use correct typing for Supabase RPC call
      // Don't specify type parameters at all, let TypeScript infer them
      const { data, error } = await supabase.rpc('get_server_time');
      
      if (error) throw error;
      
      // Data should be a timestamp string like '2023-08-01T12:00:00Z'
      if (data) {
        // Explicitly cast the data to string since we know the RPC function returns a timestamp string
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
