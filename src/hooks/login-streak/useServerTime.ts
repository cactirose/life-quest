
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Type for the server time response
type ServerTimeResponse = {
  server_time: string;
};

export const useServerTime = () => {
  // Define the fetch server time function
  const fetchServerTime = async (): Promise<Date> => {
    try {
      const { data, error } = await supabase.rpc('get_server_time');
      
      if (error) {
        console.error("Error fetching server time:", error);
        throw new Error("Failed to fetch server time");
      }
      
      return new Date(data);
    } catch (error) {
      console.error("Error in fetchServerTime:", error);
      // Fall back to client time if server time fails
      return new Date();
    }
  };
  
  // Use React Query to fetch and cache server time
  const { data: serverTime, isLoading, error } = useQuery({
    queryKey: ['serverTime'],
    queryFn: fetchServerTime,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });
  
  return {
    serverTime: serverTime || new Date(),
    isLoading,
    error,
    fetchServerTime
  };
};
