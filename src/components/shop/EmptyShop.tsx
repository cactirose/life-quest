
import { Button } from "@/components/ui/button";
import { ShoppingCart, PlusCircle } from "lucide-react";

interface EmptyShopProps {
  isAdmin: boolean;
  onAddNewItem: () => void;
}

const EmptyShop = ({ isAdmin, onAddNewItem }: EmptyShopProps) => {
  return (
    <div className="text-center py-12 parchment">
      <ShoppingCart size={48} className="mx-auto mb-4 text-rpg-brown" />
      <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Items Found</h3>
      <p className="text-rpg-brown">Try adjusting your filters or search terms.</p>
      {isAdmin && (
        <Button 
          onClick={onAddNewItem}
          className="pixel-button mt-4"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Your First Item
        </Button>
      )}
    </div>
  );
};

export default EmptyShop;
