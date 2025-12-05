-- Add allergens column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN allergens text[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.menu_items.allergens IS 'Array of allergen names (both predefined EU allergens and custom ones)';