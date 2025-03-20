
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Check if user is authenticated by retrieving session from Supabase
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Synchronous check for protected routes (uses local storage as fallback)
export const isAuthenticatedSync = (): boolean => {
  // This is a quick check for the router to use
  // The actual session validation happens in useEffect with isAuthenticated()
  return localStorage.getItem("isAuthenticated") === "true";
};

// Log user out through Supabase
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem("isAuthenticated");
};

// Store user session in localStorage for sync checks
export const storeSession = (session: Session | null): void => {
  if (session) {
    localStorage.setItem("isAuthenticated", "true");
  } else {
    localStorage.removeItem("isAuthenticated");
  }
};
