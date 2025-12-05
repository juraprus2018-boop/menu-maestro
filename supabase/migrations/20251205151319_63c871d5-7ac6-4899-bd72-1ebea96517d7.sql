-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  intro_text TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_categories table
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurants
CREATE POLICY "Users can view their own restaurants" 
ON public.restaurants FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own restaurants" 
ON public.restaurants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurants" 
ON public.restaurants FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own restaurants" 
ON public.restaurants FOR DELETE 
USING (auth.uid() = user_id);

-- Public read access for menus (for QR code scanning)
CREATE POLICY "Anyone can view restaurants by slug" 
ON public.restaurants FOR SELECT 
USING (true);

-- RLS policies for menu_categories
CREATE POLICY "Users can manage categories of their restaurants" 
ON public.menu_categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = menu_categories.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view categories" 
ON public.menu_categories FOR SELECT 
USING (true);

-- RLS policies for menu_items
CREATE POLICY "Users can manage items of their restaurants" 
ON public.menu_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories 
    JOIN public.restaurants ON restaurants.id = menu_categories.restaurant_id
    WHERE menu_categories.id = menu_items.category_id 
    AND restaurants.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view menu items" 
ON public.menu_items FOR SELECT 
USING (true);

-- Create storage bucket for restaurant logos
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-assets', 'restaurant-assets', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view restaurant assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'restaurant-assets');

CREATE POLICY "Users can update their own assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();