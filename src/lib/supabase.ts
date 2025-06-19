import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          category: string;
          description: string;
          date: string;
          created_at: string;
          account_id: string | null;
          transfer_to_account_id: string | null;
          icon: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          category: string;
          description: string;
          date: string;
          created_at?: string;
          account_id?: string | null;
          transfer_to_account_id?: string | null;
          icon?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'income' | 'expense' | 'transfer';
          category?: string;
          description?: string;
          date?: string;
          created_at?: string;
          account_id?: string | null;
          transfer_to_account_id?: string | null;
          icon?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          icon: string;
          color: string;
          type: 'expense' | 'income';
          is_custom: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          icon?: string;
          color?: string;
          type?: 'expense' | 'income';
          is_custom?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          icon?: string;
          color?: string;
          type?: 'expense' | 'income';
          is_custom?: boolean;
          created_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'bank' | 'cash' | 'digital_wallet' | 'credit_card' | 'savings' | 'investment' | 'other';
          balance: number;
          color: string;
          icon: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: 'bank' | 'cash' | 'digital_wallet' | 'credit_card' | 'savings' | 'investment' | 'other';
          balance?: number;
          color?: string;
          icon?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'bank' | 'cash' | 'digital_wallet' | 'credit_card' | 'savings' | 'investment' | 'other';
          balance?: number;
          color?: string;
          icon?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
};