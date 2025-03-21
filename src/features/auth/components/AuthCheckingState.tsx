
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCheckingStateProps = {
  title: string;
  description: string;
};

const AuthCheckingState = ({ title, description }: AuthCheckingStateProps) => {
  return (
    <>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-pixel text-primary">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className="animate-spin text-3xl">⌛</div>
      </CardContent>
    </>
  );
};

export default AuthCheckingState;
