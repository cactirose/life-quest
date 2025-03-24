
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ShoppingBag } from "lucide-react";
import { ShoppingList as ShoppingListType, ShoppingItem } from "@/types/shoppingList";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";

const ShoppingList = () => {
  const [lists, setLists] = useState<ShoppingListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadLists = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/login');
        return;
      }
      
      fetchShoppingLists();
    };
    
    checkAuthAndLoadLists();
  }, []);

  const fetchShoppingLists = async () => {
    setIsLoading(true);
    try {
      const { data: listsData, error: listsError } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;

      const lists = listsData || [];
      
      // Fetch items for each list
      const listsWithItems = await Promise.all(
        lists.map(async (list) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('list_id', list.id)
            .order('order', { ascending: true });

          if (itemsError) throw itemsError;

          return {
            ...list,
            items: itemsData || []
          };
        })
      );

      setLists(listsWithItems);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      toast.error("Failed to load shopping lists");
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 animate-fade-in">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold">Loading Shopping Lists...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shopping Lists</h1>
          <p className="text-muted-foreground">Create and manage your shopping lists</p>
        </div>
        <Button onClick={() => navigate("/shopping-list/new")} className="pixel-button">
          <Plus size={16} className="mr-2" />
          New List
        </Button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Shopping Lists Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first shopping list to get started</p>
          <Button onClick={() => navigate("/shopping-list/new")} className="pixel-button">
            <Plus size={16} className="mr-2" />
            Create First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div 
              key={list.id} 
              className="parchment cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/shopping-list/${list.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-pixel text-rpg-brown">{list.name}</h3>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/shopping-list/${list.id}/edit`);
                    }}
                  >
                    <Edit size={16} />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                  >
                    <Trash size={16} />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              
              {list.description && (
                <p className="text-sm text-rpg-brown mb-3">{list.description}</p>
              )}
              
              <div className="text-sm text-rpg-brown">
                <div className="flex justify-between">
                  <span>{list.items.length} items</span>
                  <span>
                    {list.items.filter(item => item.purchased).length} purchased
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
