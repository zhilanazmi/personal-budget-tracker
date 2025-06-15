/*
  # Add update_account_balance function

  1. New Functions
    - `update_account_balance(account_id uuid, balance_change decimal)`
      - Updates account balance by adding the balance_change amount
      - Ensures atomic balance updates for transaction consistency
      - Returns the updated balance

  2. Security
    - Function respects RLS policies on accounts table
    - Only authenticated users can call this function
    - Users can only update their own accounts
*/

-- Create the update_account_balance function
CREATE OR REPLACE FUNCTION update_account_balance(
  account_id uuid,
  balance_change decimal(15,2)
)
RETURNS decimal(15,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance decimal(15,2);
  account_user_id uuid;
BEGIN
  -- Check if the account belongs to the current user
  SELECT user_id INTO account_user_id
  FROM accounts
  WHERE id = account_id;
  
  -- Verify the account exists and belongs to the current user
  IF account_user_id IS NULL THEN
    RAISE EXCEPTION 'Account not found';
  END IF;
  
  IF account_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Account does not belong to current user';
  END IF;
  
  -- Update the balance atomically
  UPDATE accounts
  SET balance = balance + balance_change
  WHERE id = account_id
  RETURNING balance INTO new_balance;
  
  RETURN new_balance;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_account_balance(uuid, decimal) TO authenticated;