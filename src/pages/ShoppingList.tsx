
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ShoppingBag } from "lucide-react";
import { ShoppingList as ShoppingListType, ShoppingItem } from "@/types/shoppingList";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ShoppingList = () => {
  const [lists, setLists] = useState<ShoppingListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

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
  }, [navigate]);

  const fetchShoppingLists = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching shopping lists...");
      const { data: listsData, error: listsError } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (listsError) {
        console.error("Error fetching lists:", listsError);
        throw listsError;
      }

      console.log("Lists fetched successfully:", listsData);
      const lists = listsData || [];
      
      // Fetch items for each list
      const listsWithItems = await Promise.all(
        lists.map(async (list) => {
          console.log(`Fetching items for list ${list.id}...`);
          const { data: itemsData, error: itemsError } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('list_id', list.id)
            .order('sort_order', { ascending: true });

          if (itemsError) {
            console.error(`Error fetching items for list ${list.id}:`, itemsError);
            throw itemsError;
          }

          console.log(`Items for list ${list.id} fetched successfully:`, itemsData);
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

  const handleDeleteClick = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListToDelete(listId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    
    try {
      // First delete all items in the list
      const { error: itemsError } = await supabase
        .from('shopping_items')
        .delete()
        .eq('list_id', listToDelete);
        
      if (itemsError) throw itemsError;
      
      // Then delete the list itself
      const { error: listError } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listToDelete);
        
      if (listError) throw listError;
      
      // Update the state to remove the deleted list
      setLists(lists.filter(list => list.id !== listToDelete));
      toast.success("Shopping list deleted successfully");
    } catch (error) {
      console.error("Error deleting shopping list:", error);
      toast.error("Failed to delete shopping list");
    } finally {
      setListToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

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
                    onClick={(e) => handleDeleteClick(list.id, e)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this shopping list and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteList} className="bg-red-500 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShoppingList;
