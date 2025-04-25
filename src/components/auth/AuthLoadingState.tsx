
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const AuthLoadingState = ({ message = "Checking authentication..." }) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="flex items-center justify-center mb-4 space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">
          This won't take long...
        </p>
      </div>
    </div>
  );
};
