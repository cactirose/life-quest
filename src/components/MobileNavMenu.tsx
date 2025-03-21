
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSettings } from "./ThemeSettings";

type MobileMenuItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

interface MobileNavMenuProps {
  items: MobileMenuItem[];
  onLogout: () => void;
  statusBar: React.ReactNode;
}

const MobileNavMenu = ({ items, onLogout, statusBar }: MobileNavMenuProps) => {
  const location = useLocation();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none p-2 h-10 w-10 flex items-center justify-center"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] p-0 border-l border-[hsl(var(--nav-hover))]"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[hsl(var(--nav-hover))]">
            <h2 className="text-xl font-pixel mb-2">Life Quest</h2>
            {statusBar}
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col space-y-1">
              {items.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md font-pixel hover:bg-[hsl(var(--nav-hover))]",
                    location.pathname === item.path && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
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
          
          <div className="mt-auto p-4 border-t border-[hsl(var(--nav-hover))]">
            <ThemeSettings />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
