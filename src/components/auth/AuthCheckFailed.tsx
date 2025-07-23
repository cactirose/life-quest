import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logout } from "@/utils/auth";

export const AuthCheckFailed = () => {
  const handleRetry = () => {
    window.location.reload();
    toast.info("Retrying authentication check...");
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Failed to sign out properly");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="text-destructive text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Authentication Problem</h2>
      <p className="text-muted-foreground text-center mb-4 max-w-md">
        We're having trouble verifying your login status. This could be due to network issues or an expired session.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={handleRetry} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry Connection
        </button>
        <button 
          onClick={handleSignOut} 
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
