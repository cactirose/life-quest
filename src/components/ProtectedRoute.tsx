
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthenticatedRoute } from "@/hooks/useAuthenticatedRoute";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { AuthChecking } from "./auth/AuthChecking";
import { AuthCheckFailed } from "./auth/AuthCheckFailed";
import { DataSyncingIndicator } from "./auth/DataSyncingIndicator";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isChecking, isAuthed, checkFailed } = useAuthenticatedRoute();
  const { isLoading } = useSupabaseSync();
  
  // If auth check failed, show a recovery UI
  if (checkFailed) {
    return <AuthCheckFailed />;
  }

  // If still checking auth, show a minimal loading indicator
  if (isChecking) {
    return <AuthChecking />;
  }

  // If not authenticated, redirect to login
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but still loading data, render the children anyway
  // with a small loading indicator at the top
  return (
    <>
      {isLoading && <DataSyncingIndicator />}
      {children}
    </>
  );
};

export default ProtectedRoute;
