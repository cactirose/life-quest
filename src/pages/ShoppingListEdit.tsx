
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthenticated } from "@/utils/auth";

const shoppingListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ShoppingListFormValues = z.infer<typeof shoppingListSchema>;

const ShoppingListEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const form = useForm<ShoppingListFormValues>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: {
      name: "",
      description: "",
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
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', listId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        form.reset({
          name: data.name,
          description: data.description || "",
        });
      } else {
        toast.error("Shopping list not found");
        navigate('/shopping-list');
      }
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      toast.error("Failed to load shopping list");
      navigate('/shopping-list');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: ShoppingListFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("shopping_lists")
        .update({
          name: values.name,
          description: values.description || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Shopping list updated successfully");
      navigate(`/shopping-list/${id}`);
    } catch (error) {
      console.error("Error updating shopping list:", error);
      toast.error("Failed to update shopping list");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/shopping-list/${id}`)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">Edit Shopping List</h1>
      </div>

      <div className="parchment p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rpg-brown font-medium">List Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Grocery List, Hardware Store" 
                      className="bg-white/70 border-rpg-brown/30" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rpg-brown font-medium">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes about this shopping list" 
                      className="bg-white/70 border-rpg-brown/30" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="pixel-button"
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShoppingListEdit;
