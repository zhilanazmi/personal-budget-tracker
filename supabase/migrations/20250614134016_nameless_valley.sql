/*
  # Add Accounts/Wallets Management System

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - nama akun/dompet
      - `type` (text) - jenis akun (bank, cash, digital_wallet, etc)
      - `balance` (decimal) - saldo saat ini
      - `color` (text) - warna untuk identifikasi visual
      - `icon` (text) - ikon untuk akun
      - `is_active` (boolean) - status aktif/nonaktif
      - `created_at` (timestamp)

  2. Modify transactions table
    - Add `account_id` column to link transactions to specific accounts
    - Add `transfer_to_account_id` for transfer transactions

  3. Security
    - Enable RLS on `accounts` table
    - Add policies for users to manage their own accounts
    - Update transaction policies to include account access
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('bank', 'cash', 'digital_wallet', 'credit_card', 'savings', 'investment', 'other')) DEFAULT 'other',
  balance decimal(15,2) NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#3B82F6',
  icon text NOT NULL DEFAULT 'Wallet',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for accounts
CREATE POLICY "Users can manage their own accounts"
  ON accounts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add account_id to transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'account_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN account_id uuid REFERENCES accounts(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add transfer_to_account_id for transfer transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'transfer_to_account_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN transfer_to_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update transaction type check to include transfer
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
  CHECK (type IN ('income', 'expense', 'transfer'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
CREATE INDEX IF NOT EXISTS accounts_type_idx ON accounts(type);
CREATE INDEX IF NOT EXISTS transactions_account_id_idx ON transactions(account_id);
CREATE INDEX IF NOT EXISTS transactions_transfer_to_account_id_idx ON transactions(transfer_to_account_id);

-- Insert default accounts for existing users (will be handled by the app)
-- This is just a placeholder - the app will create default accounts when users first access the new feature