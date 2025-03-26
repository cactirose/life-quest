
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// Check if user is authenticated by retrieving session from Supabase
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Get the session from Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
    
    // If we have a session but it's expired, try to refresh it
    if (data.session && isSessionExpired(data.session)) {
      return await refreshSession();
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Exception checking authentication:", error);
    return false;
  }
};

// Check if a session is expired or about to expire (within 5 minutes)
const isSessionExpired = (session: Session): boolean => {
  if (!session.expires_at) return true;
  
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60; // 5 minutes in seconds
  
  // Return true if token expires within 5 minutes
  return expiresAt < now + fiveMinutes;
};

// Synchronous check for protected routes (uses local storage as fallback)
export const isAuthenticatedSync = (): boolean => {
  try {
    // This is a quick check for the router to use
    // The actual session validation happens in useEffect with isAuthenticated()
    
    // Get Supabase URL from environment, not directly from the client
    const localStorageKey = 'sb-ilfxfggmyrmblmrqjrvl-auth-token';
    const authData = localStorage.getItem(localStorageKey);
    
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        
        // Check if we have the necessary fields
        if (parsedData && parsedData.access_token) {
          // Check if token hasn't expired yet
          if (parsedData.expires_at) {
            const now = Math.floor(Date.now() / 1000);
            if (parsedData.expires_at > now) {
              return true;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }
    
    // Fall back to the simple flag if the direct check doesn't work
    return localStorage.getItem("isAuthenticated") === "true";
  } catch (error) {
    console.error("Error in isAuthenticatedSync:", error);
    return false;
  }
};

// Log user out through Supabase and clear local data
export const logout = async (): Promise<void> => {
  try {
    // Clear local state first to ensure UI responsiveness
    localStorage.removeItem("isAuthenticated");
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
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

// Clear session from local storage
export const clearSession = (): void => {
  localStorage.removeItem("isAuthenticated");
  console.log("Session cleared from local storage");
};

// Helper to refresh the session if needed
export const refreshSession = async (): Promise<boolean> => {
  try {
    console.log("Attempting to refresh session...");
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error);
      return false;
    }
    
    const { session } = data;
    if (session) {
      storeSession(session);
      console.log("Session refreshed successfully");
      return true;
    }
    
    console.log("No session returned after refresh attempt");
    return false;
  } catch (error) {
    console.error("Exception refreshing session:", error);
    return false;
  }
};

// Check session health and refresh if necessary
export const ensureValidSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return false;
    }
    
    if (!data.session) {
      console.log("No session found");
      return false;
    }
    
    // If session exists but is expired or about to expire, refresh it
    if (isSessionExpired(data.session)) {
      return await refreshSession();
    }
    
    // Session is valid and not expired
    return true;
  } catch (error) {
    console.error("Exception in ensureValidSession:", error);
    return false;
  }
};
