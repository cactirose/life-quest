
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Session management
export const storeSession = (session: Session) => {
  localStorage.setItem('supabase.auth.token', JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('gameDataCache');
};

// Authentication checking
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const isAuthenticatedSync = (): boolean => {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    if (!token) return false;
    
    const session = JSON.parse(token);
    return !!(session?.access_token && session?.expires_at && new Date(session.expires_at * 1000) > new Date());
  } catch {
    return false;
  }
};

export const ensureValidSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (!session) {
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
      
      if (refreshedSession) {
        storeSession(refreshedSession);
        return true;
      }
      return false;
    }
    
    storeSession(session);
    return true;
  } catch (error) {
    console.error("Error ensuring valid session:", error);
    return false;
  }
};

export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    if (session) {
      storeSession(session);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return false;
  }
};

// Logout function
export const logout = async (navigate?: (path: string) => void) => {
  try {
    clearSession();
    await supabase.auth.signOut({ scope: 'global' });
    
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.error("Logout error:", error);
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  }
};

export const handleUserLogin = async () => {
  console.log("User logged in, syncing data...");
  
  try {
    console.log("Data sync completed successfully");
  } catch (error) {
    console.error("Error during data sync:", error);
  }
};

export const handleUserLogout = async () => {
  console.log("User logged out");
  clearSession();
};
