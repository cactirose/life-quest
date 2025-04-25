
export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string | number;
  category?: string;
  purchased: boolean;
  notes?: string;
  price?: number;
  listId: string;
  sortOrder?: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  items: ShoppingItem[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
