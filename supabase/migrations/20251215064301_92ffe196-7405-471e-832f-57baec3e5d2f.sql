-- Add delivery radius setting to restaurant_ordering_settings
ALTER TABLE public.restaurant_ordering_settings
ADD COLUMN IF NOT EXISTS delivery_radius_km numeric DEFAULT 10;

-- Add requested delivery time to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS requested_time timestamp with time zone DEFAULT NULL;

-- Update order status enum to include more statuses
-- Current: new, confirmed, preparing, ready, delivered, cancelled
-- Adding: out_for_delivery (onderweg)
COMMENT ON COLUMN public.orders.order_status IS 'Status values: new, confirmed, preparing, ready, out_for_delivery, delivered, cancelled';