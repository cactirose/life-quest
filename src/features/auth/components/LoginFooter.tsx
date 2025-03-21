
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

const LoginFooter = () => {
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex flex-col space-y-2">
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </div>
      <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>
        Continue as Guest
      </Button>
    </CardFooter>
  );
};

export default LoginFooter;
