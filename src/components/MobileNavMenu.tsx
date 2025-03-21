
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MobileNavHeader from './navigation/MobileNavHeader';
import MobileNavContent from './navigation/MobileNavContent';
import MobileNavFooter from './navigation/MobileNavFooter';

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
          <MobileNavHeader statusBar={statusBar} />
          <MobileNavContent items={items} onLogout={onLogout} />
          <MobileNavFooter />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
