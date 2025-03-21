
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameData } from "@/contexts/DataContext";
import LoginForm from "@/features/auth/components/LoginForm";
import LoginFooter from "@/features/auth/components/LoginFooter";
import AuthLoader from "@/features/auth/components/AuthLoader";
import { useAuthCheck } from "@/features/auth/hooks/useAuthCheck";

const Login = () => {
  const navigate = useNavigate();
  const { setGameData } = useGameData();
  const { authCheckDone } = useAuthCheck(navigate);

  // Show loading state while checking auth
  if (!authCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
        <AuthLoader message="Checking authentication status..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-pixel text-primary">Login</CardTitle>
          <CardDescription>
            Enter your credentials to continue your quest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <LoginFooter />
      </Card>
    </div>
  );
};

export default Login;
