-- Drop the old restrictive check constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

-- The plan column can now store product IDs (like prod_xxx) or plan types (monthly/yearly)
-- No new constraint needed as we want flexibility for both Stripe product IDs and admin-set plans