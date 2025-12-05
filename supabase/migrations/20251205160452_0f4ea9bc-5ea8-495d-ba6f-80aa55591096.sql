-- Add theme column to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN theme text NOT NULL DEFAULT 'default';

-- Add check constraint for valid themes
ALTER TABLE public.restaurants 
ADD CONSTRAINT valid_theme CHECK (theme IN ('default', 'classic', 'modern'));