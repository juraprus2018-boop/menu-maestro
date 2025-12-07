-- Drop the old constraint and add the correct one matching the menu-themes.ts values
ALTER TABLE public.restaurants DROP CONSTRAINT IF EXISTS valid_theme;
ALTER TABLE public.restaurants ADD CONSTRAINT valid_theme CHECK (theme = ANY (ARRAY['default'::text, 'elegant'::text, 'simple'::text]));