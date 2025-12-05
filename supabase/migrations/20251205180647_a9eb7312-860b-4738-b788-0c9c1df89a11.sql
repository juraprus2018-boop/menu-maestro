-- Create translations table for multi-language support
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'restaurant', 'menu', 'category', 'item'
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL, -- 'name', 'description', 'intro_text'
  language_code TEXT NOT NULL, -- 'en', 'de', 'fr'
  translation_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, field_name, language_code)
);

-- Create index for fast lookups
CREATE INDEX idx_translations_entity ON public.translations(entity_type, entity_id);
CREATE INDEX idx_translations_language ON public.translations(language_code);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Anyone can view translations (for public menu)
CREATE POLICY "Anyone can view translations"
ON public.translations
FOR SELECT
USING (true);

-- Users can manage translations for their own content
CREATE POLICY "Users can manage their restaurant translations"
ON public.translations
FOR ALL
USING (
  (entity_type = 'restaurant' AND EXISTS (
    SELECT 1 FROM restaurants WHERE restaurants.id = translations.entity_id AND restaurants.user_id = auth.uid()
  ))
  OR
  (entity_type = 'menu' AND EXISTS (
    SELECT 1 FROM menus JOIN restaurants ON restaurants.id = menus.restaurant_id 
    WHERE menus.id = translations.entity_id AND restaurants.user_id = auth.uid()
  ))
  OR
  (entity_type = 'category' AND EXISTS (
    SELECT 1 FROM menu_categories JOIN restaurants ON restaurants.id = menu_categories.restaurant_id 
    WHERE menu_categories.id = translations.entity_id AND restaurants.user_id = auth.uid()
  ))
  OR
  (entity_type = 'item' AND EXISTS (
    SELECT 1 FROM menu_items 
    JOIN menu_categories ON menu_categories.id = menu_items.category_id
    JOIN restaurants ON restaurants.id = menu_categories.restaurant_id 
    WHERE menu_items.id = translations.entity_id AND restaurants.user_id = auth.uid()
  ))
);

-- Add enabled_languages column to restaurants
ALTER TABLE public.restaurants ADD COLUMN enabled_languages TEXT[] NOT NULL DEFAULT '{}'::text[];

-- Create trigger for updated_at
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();