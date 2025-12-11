-- Remove the unique constraint on user_id to allow multiple subscriptions per user
-- (e.g., a user can have both Pro and Ordering subscriptions)
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;

-- Add a unique constraint on user_id + plan instead to prevent duplicate plans for same user
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_plan_unique UNIQUE (user_id, plan);