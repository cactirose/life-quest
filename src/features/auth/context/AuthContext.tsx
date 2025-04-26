
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  language?: string;
  created_at: string;
  updated_at: string;
  username?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, name: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshSession: () => Promise<boolean>;
  ensureValidSession: () => Promise<boolean>;
  isSessionExpired: (session: Session) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if a session is expired or about to expire (within 5 minutes)
const isSessionExpired = (session: Session): boolean => {
  if (!session.expires_at) return true;

  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60; // 5 minutes in seconds

  // Return true if token expires within 5 minutes
  return expiresAt < now + fiveMinutes;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user) {
        // Using setTimeout to avoid potential deadlock as per Supabase recommendation
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Important: Not using an async function as callback as per Supabase recommendation
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      // Using setTimeout to avoid deadlock as per Supabase recommendation
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      // Transform data to match Profile type
      const profileData: Profile = {
        id: data.id,
        name: data.username || 'User',  // Use username as name if available
        email: user?.email || '',       // Get email from user object
        created_at: data.created_at,
        updated_at: data.updated_at,
        username: data.username
      };
      setProfile(profileData);
    }
  };

  const signIn = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setIsLoading(false);
    return { error };
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    return { data, error };
  };

  const signUp = async (email: string, name: string) => {
    setIsLoading(true);
    // Using signInWithOtp instead of signUp since we're using OTP authentication
    // We'll store the name in the metadata
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name },
      },
    });
    setIsLoading(false);
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setIsLoading(false);
    return { error };
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      // Clear any local authenticated state
      localStorage.removeItem("isAuthenticated");
      console.log("User logged out successfully");
    }

    setIsLoading(false);
    return { error };
  };

  // Check session health and refresh if necessary
  const refreshSession = async (): Promise<boolean> => {
    try {
      console.log("Attempting to refresh session...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return false;
      }
      
      const { session } = data;
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
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

  const ensureValidSession = async (): Promise<boolean> => {
    try {
      if (!session) {
        console.log("No session found");
        return false;
      }

      // If session exists but is expired or about to expire, refresh it
      if (isSessionExpired(session)) {
        return await refreshSession();
      }

      // Session is valid and not expired
      return true;
    } catch (error) {
      console.error("Exception in ensureValidSession:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAuthenticated,
        signIn,
        login,
        signUp,
        verifyOtp,
        signInWithGoogle,
        signOut,
        refreshSession,
        ensureValidSession,
        isSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
