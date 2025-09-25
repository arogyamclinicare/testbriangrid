import { create } from 'zustand';
import { Product } from '@/lib/supabase/mcp-config';
import { calculateGrandTotal } from '@/lib/utils/calculations';

export interface DeliveryItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface DeliveryState {
  items: { [productId: string]: DeliveryItem };
  calculation: {
    subtotal: number;
    grandTotal: number;
  };
  hasItems: boolean;
  addItem: (product: Product, quantity: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearAll: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  items: {},
  calculation: {
    subtotal: 0,
    grandTotal: 0,
  },
  hasItems: false,

  addItem: (product, quantity) => {
    set((state) => {
      const newItems = {
        ...state.items,
        [product.id]: {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        },
      };
      const { subtotal, grandTotal } = calculateGrandTotal(Object.values(newItems));
      return {
        items: newItems,
        calculation: { subtotal, grandTotal },
        hasItems: Object.keys(newItems).length > 0,
      };
    });
  },

  updateItemQuantity: (productId, quantity) => {
    set((state) => {
      const newItems = { ...state.items };
      if (quantity <= 0) {
        delete newItems[productId];
      } else {
        if (newItems[productId]) {
          newItems[productId] = { ...newItems[productId], quantity };
        }
      }
      const { subtotal, grandTotal } = calculateGrandTotal(Object.values(newItems));
      return {
        items: newItems,
        calculation: { subtotal, grandTotal },
        hasItems: Object.keys(newItems).length > 0,
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = { ...state.items };
      delete newItems[productId];
      const { subtotal, grandTotal } = calculateGrandTotal(Object.values(newItems));
      return {
        items: newItems,
        calculation: { subtotal, grandTotal },
        hasItems: Object.keys(newItems).length > 0,
      };
    });
  },

  clearAll: () => {
    set({
      items: {},
      calculation: { subtotal: 0, grandTotal: 0 },
      hasItems: false,
    });
  },
}));