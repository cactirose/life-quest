
// Re-export the supabase client from the main client file with hardcoded values for the client
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Use hardcoded values instead of process.env
const SUPABASE_URL = 'https://ilfxfggmyrmblmrqjrvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZnhmZ2dteXJtYmxtcnFqcnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzgzODIsImV4cCI6MjA1ODA1NDM4Mn0.LzUQ6MhDh3tG-L9X1J5oHNvXxcNAC1Fg-jNenCaDAhQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'life-quest-supabase-auth',
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'life-quest-web',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  db: {
    schema: 'public',
  },
});

// Add auth state change listener with integrated error handling
supabase.auth.onAuthStateChange((event, session) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Auth state changed:`, event, 'Session:', session ? 'exists' : 'null');
  
  // Handle authentication events
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('gameDataCache');
    localStorage.removeItem('lastSyncTime');
    console.log('Cleared cached data due to auth state change');
  }

  if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed successfully');
  }

  if (event === 'SIGNED_IN') {
    // Validate the session
    if (session) {
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const expiresIn = new Date(expiresAt * 1000).getTime() - Date.now();
        console.log(`Session expires in ${Math.round(expiresIn / 1000 / 60)} minutes`);
        
        // Warn user if session is close to expiring
        if (expiresIn < 5 * 60 * 1000) { // Less than 5 minutes
          toast.warning("Your session will expire soon. Please refresh the page.");
        }
      }
    }
  }
});
