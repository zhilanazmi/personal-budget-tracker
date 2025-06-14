/*
  # Create categories table for budget tracker

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable for default categories)
      - `name` (text)
      - `icon` (text)
      - `color` (text)
      - `type` (text, 'expense' or 'income')
      - `is_custom` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for users to see default and their own categories
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Tag',
  color text NOT NULL DEFAULT '#3B82F6',
  type text NOT NULL CHECK (type IN ('expense', 'income')) DEFAULT 'expense',
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see default and own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default expense categories
INSERT INTO categories (name, icon, color, type, is_custom) VALUES
  ('Transport', 'Car', '#3B82F6', 'expense', false),
  ('Food & Drink', 'Coffee', '#F59E0B', 'expense', false),
  ('Snacks', 'Cookie', '#EC4899', 'expense', false),
  ('Groceries', 'ShoppingCart', '#10B981', 'expense', false),
  ('Bills', 'FileText', '#EF4444', 'expense', false),
  ('Rent/Mortgage', 'Home', '#8B5CF6', 'expense', false),
  ('Entertainment', 'Film', '#F97316', 'expense', false),
  ('Shopping', 'Bag', '#06B6D4', 'expense', false),
  ('Education', 'BookOpen', '#84CC16', 'expense', false),
  ('Health', 'Heart', '#EF4444', 'expense', false),
  ('Savings', 'PiggyBank', '#22C55E', 'expense', false),
  ('Others', 'MoreHorizontal', '#6B7280', 'expense', false);

-- Insert default income categories
INSERT INTO categories (name, icon, color, type, is_custom) VALUES
  ('Salary', 'Briefcase', '#10B981', 'income', false),
  ('Freelance', 'Laptop', '#3B82F6', 'income', false),
  ('Business', 'Building', '#8B5CF6', 'income', false),
  ('Investment', 'TrendingUp', '#F59E0B', 'income', false),
  ('Other Income', 'Plus', '#6B7280', 'income', false);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories(user_id);
CREATE INDEX IF NOT EXISTS categories_type_idx ON categories(type);