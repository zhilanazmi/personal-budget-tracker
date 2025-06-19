/*
  # Add icon column to transactions table

  1. Changes
    - Add `icon` column to `transactions` table
    - Column is nullable text type with default value
    - Allows transactions to have associated icons for better UX

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'icon'
  ) THEN
    ALTER TABLE transactions ADD COLUMN icon text DEFAULT 'Receipt';
  END IF;
END $$;