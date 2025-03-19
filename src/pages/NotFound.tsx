
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-fade-in text-center max-w-md px-4">
        <div className="parchment">
          <MapPin size={48} className="mx-auto mb-4 text-rpg-brown" />
          <h1 className="text-4xl font-rpg mb-4 text-rpg-brown">404</h1>
          <p className="text-xl mb-4 text-rpg-brown">
            Oops! You've wandered off the map!
          </p>
          <p className="mb-6 text-rpg-brown">
            The quest you're looking for doesn't exist or you don't have access to it yet.
          </p>
          <Link to="/">
            <Button className="pixel-button">
              Return to Home Village
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
