import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    // Try environment variables first, fallback to hardcoded values for development
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vcamqgivukjvhpgpqskr.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYW1xZ2l2dWtqdmhwZ3Bxc2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MTI1NDIsImV4cCI6MjA3NDM4ODU0Mn0.2M1YAVadbGAyiZIxmAr4tLBzrTNQPyfBmQzi4IOkVxY';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
        allEnv: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
      });
      throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Single-user prototype, no auth needed
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Optimize for mobile performance
        },
      },
    });
  }
  return supabaseInstance;
};

// For backward compatibility - only create when needed
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null;

// Database types
export type Database = {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          route_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          route_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          route_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          created_at?: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          shop_id: string;
          date: string;
          product_quantities: Record<string, number>;
          total_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          date: string;
          product_quantities: Record<string, number>;
          total_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          date?: string;
          product_quantities?: Record<string, number>;
          total_amount?: number;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          shop_id: string;
          date: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          date: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          date?: string;
          amount?: number;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          shop_id: string;
          date: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          date: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          date?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
};
