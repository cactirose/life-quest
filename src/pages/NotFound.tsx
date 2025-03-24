
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={goBack} className="pixel-button">
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>
            <Link to="/">
              <Button className="pixel-button w-full sm:w-auto">
                Return to Home Village
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
