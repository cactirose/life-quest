
import { supabase } from "@/integrations/supabase/client";

export const AuthCheckFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="text-destructive text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Authentication Problem</h2>
      <p className="text-muted-foreground text-center mb-4">
        We're having trouble verifying your login status.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
        <button 
          onClick={() => {
            supabase.auth.signOut().then(() => {
              localStorage.removeItem("isAuthenticated");
              window.location.href = "/login";
            });
          }} 
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
