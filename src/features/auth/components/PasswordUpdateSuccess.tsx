
import { Check } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const PasswordUpdateSuccess = () => {
  return (
    <CardContent className="text-center py-6 space-y-4">
      <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">Success!</h3>
      <p className="text-muted-foreground">
        Your password has been updated successfully.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Redirecting to dashboard...
      </p>
    </CardContent>
  );
};

export default PasswordUpdateSuccess;
