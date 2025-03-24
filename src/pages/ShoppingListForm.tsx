
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const shoppingListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ShoppingListFormValues = z.infer<typeof shoppingListSchema>;

const ShoppingListForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<ShoppingListFormValues>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: ShoppingListFormValues) => {
    setIsSubmitting(true);
    try {
      // Get user session to include user_id
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      const { data, error } = await supabase
        .from("shopping_lists")
        .insert({
          name: values.name,
          description: values.description || null,
          user_id: session.user.id, // Add the user_id from the session
        })
        .select('id')
        .single();

      if (error) throw error;

      toast.success("Shopping list created successfully");
      navigate(`/shopping-list/${data.id}`);
    } catch (error) {
      console.error("Error creating shopping list:", error);
      toast.error("Failed to create shopping list");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold">New Shopping List</h1>
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
                {isSubmitting ? "Creating..." : "Create List"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShoppingListForm;
