
import { useState, useEffect } from "react";
import { pingSupabase } from "@/services";
import { toast } from "sonner";

export function useConnectionStatus() {
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
