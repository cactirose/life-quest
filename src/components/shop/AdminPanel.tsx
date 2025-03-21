
import { Button } from "@/components/ui/button";
import { ShopItemEditor } from "@/components/ShopItemEditor";
import { PlusCircle } from "lucide-react";
import { GearItem } from "@/contexts/DataContext";

interface AdminPanelProps {
  isAdmin: boolean;
  onSaveItem: (item: GearItem) => void;
}

const AdminPanel = ({ isAdmin, onSaveItem }: AdminPanelProps) => {
  if (!isAdmin) return null;
  
  return (
    <div className="mb-6 parchment">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-pixel text-rpg-brown">Shop Administration</h2>
        <ShopItemEditor 
          onSave={onSaveItem}
          trigger={
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              Add New Item
            </Button>
          }
        />
      </div>
      <p className="text-sm text-rpg-brown mb-2">You can add, edit, or remove shop items in admin mode.</p>
    </div>
  );
};

export default AdminPanel;
