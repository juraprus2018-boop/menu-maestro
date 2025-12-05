-- Create menus table
CREATE TABLE public.menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add menu_id to categories (nullable first for migration)
ALTER TABLE public.menu_categories ADD COLUMN menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE;

-- Enable RLS on menus
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

-- RLS policies for menus
CREATE POLICY "Users can manage menus of their restaurants"
ON public.menus FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = menus.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view active menus"
ON public.menus FOR SELECT
USING (true);

-- Update menu_categories RLS to check via menus
DROP POLICY IF EXISTS "Users can manage categories of their restaurants" ON public.menu_categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.menu_categories;

CREATE POLICY "Users can manage categories of their menus"
ON public.menu_categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.menus
    JOIN public.restaurants ON restaurants.id = menus.restaurant_id
    WHERE menus.id = menu_categories.menu_id
    AND restaurants.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view categories"
ON public.menu_categories FOR SELECT
USING (true);

-- Trigger for menus updated_at
CREATE TRIGGER update_menus_updated_at
BEFORE UPDATE ON public.menus
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();