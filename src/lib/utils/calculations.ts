import { Product } from '@/lib/supabase/mcp-config';
import { DeliveryItem } from '@/stores/deliveryStore';

// Fixed product data from requirements
const FIXED_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Smart', price: 26.00, created_at: new Date().toISOString() },
  { id: 'prod-2', name: 'Tone milk 180ml', price: 10.50, created_at: new Date().toISOString() },
  { id: 'prod-3', name: 'DTM 180ml', price: 9.00, created_at: new Date().toISOString() },
  { id: 'prod-4', name: 'Vikas Gold', price: 35.50, created_at: new Date().toISOString() },
  { id: 'prod-5', name: 'Dahi 180ml', price: 18.00, created_at: new Date().toISOString() },
  { id: 'prod-6', name: 'Vikas Tak', price: 15.00, created_at: new Date().toISOString() },
];

export const getAllProducts = (): Product[] => {
  return FIXED_PRODUCTS;
};

export const getProductById = (id: string): Product | undefined => {
  return FIXED_PRODUCTS.find(p => p.id === id);
};

export const calculateLineTotal = (quantity: number, price: number): number => {
  return parseFloat((quantity * price).toFixed(2));
};

export const calculateGrandTotal = (items: DeliveryItem[]): { subtotal: number; grandTotal: number } => {
  let subtotal = 0;
  for (const item of items) {
    subtotal += calculateLineTotal(item.quantity, item.price);
  }
  // For this prototype, no taxes or discounts are mentioned, so subtotal is grand total
  return { subtotal: parseFloat(subtotal.toFixed(2)), grandTotal: parseFloat(subtotal.toFixed(2)) };
};