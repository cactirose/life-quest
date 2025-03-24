
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingList, ShoppingItem } from "@/types/shoppingList";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";
import { ArrowLeft, Edit, Plus, Trash, Check, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_CATEGORIES } from "@/types/shoppingList";

const itemFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

const ShoppingListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      quantity: "",
      category: "",
      notes: "",
    },
  });

  useEffect(() => {
    const checkAuthAndLoadList = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/login');
        return;
      }
      
      if (id) {
        fetchShoppingList(id);
      }
    };
    
    checkAuthAndLoadList();
  }, [id, navigate]);

  const fetchShoppingList = async (listId: string) => {
    setIsLoading(true);
    try {
      // Fetch the shopping list
      const { data: listData, error: listError } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', listId)
        .single();

      if (listError) throw listError;
      
      // Fetch the items for this list
      const { data: itemsData, error: itemsError } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('list_id', listId)
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      setList(listData);
      setItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      toast.error("Failed to load shopping list");
      navigate('/shopping-list');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (values: ItemFormValues) => {
    if (!id) return;
    
    try {
      const newItem = {
        list_id: id,
        name: values.name,
        quantity: values.quantity || null,
        category: values.category || null,
        notes: values.notes || null,
        purchased: false,
        sort_order: items.length,
      };

      const { error } = await supabase
        .from('shopping_items')
        .insert(newItem);

      if (error) throw error;

      form.reset();
      setShowAddItem(false);
      toast.success("Item added to list");
      fetchShoppingList(id);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const togglePurchased = async (itemId: string, purchased: boolean) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ purchased: !purchased })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId ? { ...item, purchased: !purchased } : item
      ));
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
      toast.success("Item removed from list");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin text-3xl mb-4">⌛</div>
          <p className="text-lg font-medium">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Shopping List Not Found</h2>
          <Button onClick={() => navigate("/shopping-list")} className="pixel-button">
            <ArrowLeft size={16} className="mr-2" />
            Back to Lists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/shopping-list")}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">{list.name}</h1>
        <Button 
          variant="ghost"
          className="ml-2"
          onClick={() => navigate(`/shopping-list/${id}/edit`)}
        >
          <Edit size={16} />
        </Button>
      </div>

      {list.description && (
        <p className="text-muted-foreground mb-6">{list.description}</p>
      )}

      <div className="parchment p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-pixel text-rpg-brown">Items</h2>
          <Button 
            onClick={() => setShowAddItem(!showAddItem)} 
            className="pixel-button"
            size="sm"
          >
            {showAddItem ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
            {showAddItem ? "Cancel" : "Add Item"}
          </Button>
        </div>

        {showAddItem && (
          <div className="bg-background/10 rounded-md p-4 mb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addItem)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Item name" 
                            className="bg-white/70" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Quantity (e.g., 2 lbs, 3 pcs)" 
                            className="bg-white/70" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select 
                            className="bg-white/70 w-full h-10 rounded-md border border-input px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="">Select Category</option>
                            {DEFAULT_CATEGORIES.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Notes" 
                            className="bg-white/70" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="pixel-button"
                  >
                    <Plus size={16} className="mr-2" />
                    Add to List
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-6 text-rpg-brown">
            <p>No items in this list yet. Add some items to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center p-3 rounded-md ${
                  item.purchased ? 'bg-green-50/30' : 'bg-white/30'
                }`}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`mr-2 ${item.purchased ? 'text-green-600' : ''}`}
                  onClick={() => togglePurchased(item.id, item.purchased)}
                >
                  {item.purchased ? <Check size={18} /> : <div className="w-5 h-5 border-2 border-gray-400 rounded-md" />}
                </Button>
                
                <div className="flex-grow">
                  <div className={`text-rpg-brown text-sm font-medium ${item.purchased ? 'line-through text-opacity-70' : ''}`}>
                    {item.name}
                    {item.quantity && <span className="ml-2 text-xs text-rpg-brown/70">({item.quantity})</span>}
                  </div>
                  
                  <div className="flex text-xs text-rpg-brown/70">
                    {item.category && <span className="mr-2">{item.category}</span>}
                    {item.notes && <span>{item.notes}</span>}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListDetail;
