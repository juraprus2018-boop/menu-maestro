-- Make price nullable
ALTER TABLE public.menu_items ALTER COLUMN price DROP NOT NULL;