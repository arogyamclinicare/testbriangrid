import { getSupabaseClient } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

// Type aliases for easier usage
export type Shop = Tables<'shops'>;
export type Product = Tables<'products'>;
export type Delivery = Tables<'deliveries'>;
export type Payment = Tables<'payments'>;
export type Note = Tables<'notes'>;

export type ShopInsert = TablesInsert<'shops'>;
export type ProductInsert = TablesInsert<'products'>;
export type DeliveryInsert = TablesInsert<'deliveries'>;
export type PaymentInsert = TablesInsert<'payments'>;
export type NoteInsert = TablesInsert<'notes'>;

export type ShopUpdate = TablesUpdate<'shops'>;
export type ProductUpdate = TablesUpdate<'products'>;
export type DeliveryUpdate = TablesUpdate<'deliveries'>;
export type PaymentUpdate = TablesUpdate<'payments'>;
export type NoteUpdate = TablesUpdate<'notes'>;

// Supabase MCP class for database operations
export class SupabaseMCP {
  // Shops operations
  static async getShops(): Promise<Shop[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('route_order');
    
    if (error) throw error;
    return data || [];
  }

  static async getShop(id: string): Promise<Shop | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createShop(shop: ShopInsert): Promise<Shop> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('shops')
      .insert(shop)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateShop(id: string, updates: ShopUpdate): Promise<Shop> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Products operations
  static async getProducts(): Promise<Product[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async getProduct(id: string): Promise<Product | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Deliveries operations
  static async getDeliveries(shopId?: string, date?: string): Promise<Delivery[]> {
    let query = supabase.from('deliveries').select('*');
    
    if (shopId) query = query.eq('shop_id', shopId);
    if (date) query = query.eq('date', date);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createDelivery(delivery: DeliveryInsert): Promise<Delivery> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('deliveries')
      .insert(delivery)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateDelivery(id: string, updates: DeliveryUpdate): Promise<Delivery> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('deliveries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Payments operations
  static async getPayments(shopId?: string, date?: string): Promise<Payment[]> {
    let query = supabase.from('payments').select('*');
    
    if (shopId) query = query.eq('shop_id', shopId);
    if (date) query = query.eq('date', date);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createPayment(payment: PaymentInsert): Promise<Payment> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePayment(id: string, updates: PaymentUpdate): Promise<Payment> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Notes operations
  static async getNotes(shopId?: string, date?: string): Promise<Note[]> {
    let query = supabase.from('notes').select('*');
    
    if (shopId) query = query.eq('shop_id', shopId);
    if (date) query = query.eq('date', date);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createNote(note: NoteInsert): Promise<Note> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateNote(id: string, updates: NoteUpdate): Promise<Note> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  static subscribeToShops(callback: (payload: unknown) => void) {
    const supabase = getSupabaseClient();
    return supabase
      .channel('shops_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, callback)
      .subscribe();
  }

  static subscribeToDeliveries(callback: (payload: unknown) => void) {
    const supabase = getSupabaseClient();
    return supabase
      .channel('deliveries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries' }, callback)
      .subscribe();
  }

  static subscribeToPayments(callback: (payload: unknown) => void) {
    const supabase = getSupabaseClient();
    return supabase
      .channel('payments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
      .subscribe();
  }

  static subscribeToNotes(callback: (payload: unknown) => void) {
    const supabase = getSupabaseClient();
    return supabase
      .channel('notes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, callback)
      .subscribe();
  }

  // Utility methods
  static async getShopBalance(shopId: string): Promise<number> {
    // Get total deliveries
    const supabase = getSupabaseClient();
    const { data: deliveries } = await supabase
      .from('deliveries')
      .select('total_amount')
      .eq('shop_id', shopId);
    
    const totalDeliveries = deliveries?.reduce((sum, delivery) => sum + delivery.total_amount, 0) || 0;
    
    // Get total payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('shop_id', shopId);
    
    const totalPayments = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    
    return totalDeliveries - totalPayments;
  }

  static async getTodaySummary(): Promise<{
    delivered: number;
    collected: number;
    pending: number;
    completedShops: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's deliveries
    const { data: todayDeliveries } = await supabase
      .from('deliveries')
      .select('total_amount')
      .eq('date', today);
    
    const delivered = todayDeliveries?.reduce((sum, delivery) => sum + delivery.total_amount, 0) || 0;
    
    // Get today's payments
    const { data: todayPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('date', today);
    
    const collected = todayPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    
    // Get all shops with pending balances
    const shops = await this.getShops();
    let pending = 0;
    let completedShops = 0;
    
    for (const shop of shops) {
      const balance = await this.getShopBalance(shop.id);
      pending += balance;
      if (balance === 0) completedShops++;
    }
    
    return {
      delivered,
      collected,
      pending,
      completedShops,
    };
  }
}
