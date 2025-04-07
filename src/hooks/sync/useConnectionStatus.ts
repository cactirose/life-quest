import { useEffect, useState } from "react";
import { supabase } from "@/services";
import { toast } from "sonner";

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let checkConnectionInterval: number;
    
    const pingSupabase = async () => {
      try {
        const { data } = await supabase.from("health_check").select("*").limit(1);
        return data !== null;
      } catch (error) {
        console.error("Error pinging Supabase:", error);
        return false;
      }
    };
    
    const checkSupabaseConnection = async () => {
      try {
        const isConnected = await pingSupabase();
        
        const wasConnected = supabaseConnected;
        const isNowConnected = isConnected;
        
        setSupabaseConnected(isNowConnected);
        
        if (!wasConnected && isNowConnected) {
          toast.success("Connection restored.");
        }
      } catch (error) {
        console.warn("Supabase connection check failed:", error);
        setSupabaseConnected(false);
      }
    };
    
    checkSupabaseConnection();
    checkConnectionInterval = window.setInterval(checkSupabaseConnection, 30000) as unknown as number;
    
    return () => window.clearInterval(checkConnectionInterval);
  }, [supabaseConnected]);

  return {
    isOnline,
    supabaseConnected
  };
}
