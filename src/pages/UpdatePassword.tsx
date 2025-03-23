import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import PasswordUpdateForm from "@/features/auth/components/PasswordUpdateForm";
import PasswordUpdateSuccess from "@/features/auth/components/PasswordUpdateSuccess";
import InvalidResetLink from "@/features/auth/components/InvalidResetLink";
import AuthCheckingState from "@/features/auth/components/AuthCheckingState";
import { useAuth } from "@/features/auth/context/AuthContext";

const UpdatePassword = () => {
  const { session, isLoading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return <AuthCheckingState 
        title="Checking Auth Status" 
        description="Please wait while we verify your session..." 
      />;
    }

    if (!session && !isSuccess) {
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
