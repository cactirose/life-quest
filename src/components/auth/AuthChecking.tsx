
import { useIsMobile } from "@/hooks/use-mobile";

export const AuthChecking = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-medium">Verifying your account...</span>
        <span className="text-sm text-muted-foreground mt-1">
          {isMobile ? "Mobile sync may take a moment" : "This should only take a moment"}
        </span>
      </div>
    </div>
  );
};
