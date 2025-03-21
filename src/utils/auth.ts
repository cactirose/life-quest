
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Check if user is authenticated by retrieving session from Supabase
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error("Exception checking authentication:", error);
    return false;
  }
};

// Synchronous check for protected routes (uses local storage as fallback)
export const isAuthenticatedSync = (): boolean => {
  try {
    // This is a quick check for the router to use
    // The actual session validation happens in useEffect with isAuthenticated()
    
    // First try to check directly if we have an access token in local storage
    const localStorageKey = `sb-${supabase.supabaseUrl.split('//')[1].split('.')[0]}-auth-token`;
    const authData = localStorage.getItem(localStorageKey);
    
    if (authData) {
      try {
        const { access_token, expires_at } = JSON.parse(authData);
        // Check if token exists and hasn't expired
        const now = Math.floor(Date.now() / 1000);
        if (access_token && expires_at && expires_at > now) {
          return true;
        }
      } catch (e) {
        // If we can't parse the JSON, fall back to the isAuthenticated flag
        console.log("Error parsing auth data, falling back to isAuthenticated flag");
      }
    }
    
    // Fall back to the simple flag if the direct check doesn't work
    return localStorage.getItem("isAuthenticated") === "true";
  } catch (error) {
    console.error("Error in isAuthenticatedSync:", error);
    return false;
  }
};

// Log user out through Supabase
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("isAuthenticated");
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

// Store user session in localStorage for sync checks
export const storeSession = (session: Session | null): void => {
  if (session) {
    localStorage.setItem("isAuthenticated", "true");
    console.log("Session stored successfully");
  } else {
    localStorage.removeItem("isAuthenticated");
    console.log("Session removed");
  }
};

// Helper to refresh the session if needed
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
      return false;
    }
    
    const { session } = data;
    if (session) {
      storeSession(session);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Exception refreshing session:", error);
    return false;
  }
};
