
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const InvalidResetLink = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-pixel text-primary">Invalid Link</CardTitle>
        <CardDescription>
          This password reset link is invalid or has expired
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-6">
        <div className="mx-auto bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <p className="mb-4">Please request a new password reset link</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => navigate("/reset-password")}>Request New Link</Button>
      </CardFooter>
    </>
  );
};

export default InvalidResetLink;
