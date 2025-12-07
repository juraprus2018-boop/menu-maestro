-- Add image_url column to menus table
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS image_url text;

-- Add image_url column to menu_categories table
ALTER TABLE public.menu_categories ADD COLUMN IF NOT EXISTS image_url text;