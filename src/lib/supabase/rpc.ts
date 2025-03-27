
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define all your RPC function types
export type RPCFunctions = {
  get_server_time: {
    args: void;
    returns: {
      timestamp: string;
    };
  };
  // Add other RPC functions here as needed
};

// Create a typed wrapper for RPC calls
export const createTypedRPC = (client: SupabaseClient) => ({
  get_server_time: () => 
    client.rpc<string, RPCFunctions['get_server_time']['args']>('get_server_time'),
  // Add other RPC functions here
});

// Usage example:
export const typedRPC = createTypedRPC(supabase);
