
import { Card, CardContent } from "@/components/ui/card";

const AuthLoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--rpg-parchment)]">
      <Card className="w-full max-w-md border-[var(--rpg-brown)]">
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--rpg-brown)] border-t-transparent rounded-full" />
          <p className="text-[var(--rpg-brown)]">Loading your adventure...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLoadingState;
