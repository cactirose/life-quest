
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface EmptyInventoryProps {
  isFiltered: boolean;
  inventoryCount: number;
}

const EmptyInventory = ({ isFiltered, inventoryCount }: EmptyInventoryProps) => {
  return (
    <div className="text-center py-12 parchment">
      <ShoppingBag size={48} className="mx-auto mb-4 text-rpg-brown" />
      <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Items Found</h3>
      <p className="text-rpg-brown mb-4">
        {inventoryCount === 0 
          ? "Your inventory is empty. Visit the shop to purchase items!" 
          : "Try adjusting your filters or search terms."}
      </p>
      
      {inventoryCount === 0 && (
        <Button 
          onClick={() => window.location.href = "/shop"}
          className="pixel-button"
        >
          Visit Shop
        </Button>
      )}
    </div>
  );
};

export default EmptyInventory;
