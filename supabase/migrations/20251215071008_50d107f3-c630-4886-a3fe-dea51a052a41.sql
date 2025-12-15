-- Fix 1: Restrict storage policies to restaurant owners only
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;

-- Create new restrictive policies for restaurant owners only
CREATE POLICY "Restaurant owners can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'restaurant-assets' 
  AND auth.uid() IN (SELECT user_id FROM public.restaurants)
);

CREATE POLICY "Restaurant owners can update their assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'restaurant-assets'
  AND auth.uid() IN (SELECT user_id FROM public.restaurants)
);

CREATE POLICY "Restaurant owners can delete their assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'restaurant-assets'
  AND auth.uid() IN (SELECT user_id FROM public.restaurants)
);

-- Fix 2: Add policy for users to check their own roles
-- This enables proper admin checking without circular dependency
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);