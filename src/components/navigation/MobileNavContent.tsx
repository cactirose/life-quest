
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import MobileNavItem from "./MobileNavItem";

type MobileMenuItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

interface MobileNavContentProps {
  items: MobileMenuItem[];
  onLogout: () => void;
}

const MobileNavContent = ({ items, onLogout }: MobileNavContentProps) => {
  const location = useLocation();
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col space-y-1">
        {items.map((item) => (
          <MobileNavItem 
            key={item.path} 
            path={item.path}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
          />
        ))}
        <Button 
          variant="ghost" 
          className="flex w-full justify-start items-center gap-3 p-3 rounded-md font-pixel hover:bg-[hsl(var(--nav-hover))] h-auto text-[hsl(var(--nav-text))]"
          onClick={onLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </ScrollArea>
  );
};

export default MobileNavContent;
