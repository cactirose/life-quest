
export interface ShoppingItem {
  id: string;
  list_id: string;
  name: string;
  quantity?: string;
  category?: string;
  notes?: string;
  purchased: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items: ShoppingItem[];
}

export type NewShoppingList = Omit<ShoppingList, "id" | "user_id" | "created_at" | "updated_at" | "items">;
export type NewShoppingItem = Omit<ShoppingItem, "id" | "created_at" | "updated_at">;

export const DEFAULT_CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household",
  "Personal Care",
  "Other"
];
