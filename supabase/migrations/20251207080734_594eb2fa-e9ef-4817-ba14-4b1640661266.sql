-- Add show_logo option and global_image_url for menu customization
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS show_logo boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS global_image_url text;