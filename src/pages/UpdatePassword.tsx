
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import PasswordUpdateForm from "@/features/auth/components/PasswordUpdateForm";
import PasswordUpdateSuccess from "@/features/auth/components/PasswordUpdateSuccess";
import InvalidResetLink from "@/features/auth/components/InvalidResetLink";
import AuthCheckingState from "@/features/auth/components/AuthCheckingState";

const UpdatePassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if the user has a valid recovery session
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        setIsCheckingAuth(true);
        const { data } = await supabase.auth.getSession();
        console.log("Auth session check:", data.session ? "Session exists" : "No session");
        if (isMounted) setHasSession(!!data.session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener - Fixed to prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      // Use setTimeout to prevent deadlocks with Supabase
      setTimeout(() => {
        if (isMounted) setHasSession(!!session);
      }, 0);
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  const renderContent = () => {
    if (isCheckingAuth) {
      return <AuthCheckingState 
        title="Checking Auth Status" 
        description="Please wait while we verify your session..." 
      />;
    }

    if (!hasSession && !isSuccess) {
      return <InvalidResetLink />;
    }

    if (isSuccess) {
      return <PasswordUpdateSuccess />;
    }

    return <PasswordUpdateForm onSuccess={handleSuccess} />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md shadow-lg">
        {renderContent()}
      </Card>
    </div>
  );
};

export default UpdatePassword;
