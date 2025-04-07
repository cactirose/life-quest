
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check Supabase connection
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkSupabaseConnection = async () => {
      if (!isOnline) {
        setSupabaseConnected(false);
        return;
      }

      try {
        // Use a simple query to check connection
        const { error } = await supabase
          .from("profiles") // Using a table we know exists instead of "health_check"
          .select("id")
          .limit(1);

        setSupabaseConnected(!error);
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        setSupabaseConnected(false);
      }

      setLastCheckTime(Date.now());
      timeout = setTimeout(checkSupabaseConnection, 60000); // Check again in 1 minute
    };

    checkSupabaseConnection();

    return () => {
      clearTimeout(timeout);
    };
  }, [isOnline]);

  return { 
    isOnline, 
    supabaseConnected,
    lastCheckTime
  };
};
