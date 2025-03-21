
import { Button } from "@/components/ui/button";
import { ShoppingBag, Coins, Sparkle, Settings } from "lucide-react";

interface ShopHeaderProps {
  coins: number;
  level: number;
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const ShopHeader = ({ coins, level, isAdmin, toggleAdmin }: ShopHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <ShoppingBag size={24} className="text-rpg-brown" />
        <h1 className="text-3xl font-pixel text-rpg-brown">Shop</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAdmin}
          className={isAdmin ? "bg-rpg-brown text-rpg-tan" : ""}
          title={isAdmin ? "Exit Admin Mode" : "Admin Mode"}
        >
          <Settings size={20} />
        </Button>
        
        <div className="parchment flex items-center px-4 py-2">
          <Coins size={20} className="text-rpg-brown mr-2" />
          <span className="font-pixel text-lg text-rpg-brown">{coins}</span>
        </div>
        <div className="parchment flex items-center px-4 py-2">
          <Sparkle size={20} className="text-rpg-brown mr-2" />
          <span className="font-pixel text-lg text-rpg-brown">Level {level}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
