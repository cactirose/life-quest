
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useServerTime = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);

  // Fetch server time from Supabase
  const fetchServerTime = useCallback(async () => {
    try {
      // The correct type annotation for Supabase RPC calls
      // First type parameter is the return type, second is the params type
      const { data, error } = await supabase.rpc<string, {}>('get_server_time');
      
      if (error) throw error;
      
      // Data should be a timestamp string like '2023-08-01T12:00:00Z'
      if (data) {
        const serverDate = new Date(data);
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
