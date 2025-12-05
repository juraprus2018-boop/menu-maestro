-- Create restaurant ordering settings table
CREATE TABLE public.restaurant_ordering_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  is_ordering_enabled BOOLEAN NOT NULL DEFAULT false,
  accepts_pickup BOOLEAN NOT NULL DEFAULT true,
  accepts_delivery BOOLEAN NOT NULL DEFAULT false,
  minimum_order_amount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  estimated_pickup_time INTEGER DEFAULT 20,
  estimated_delivery_time INTEGER DEFAULT 45,
  accepts_cash BOOLEAN NOT NULL DEFAULT true,
  accepts_card BOOLEAN NOT NULL DEFAULT true,
  accepts_ideal BOOLEAN NOT NULL DEFAULT true,
  opening_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  delivery_postal_code TEXT,
  delivery_city TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'ideal')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN ('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  notes TEXT,
  estimated_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  item_name TEXT NOT NULL,
  item_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_ordering_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurant_ordering_settings
CREATE POLICY "Restaurant owners can view their ordering settings"
  ON public.restaurant_ordering_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = restaurant_ordering_settings.restaurant_id 
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Restaurant owners can insert their ordering settings"
  ON public.restaurant_ordering_settings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = restaurant_ordering_settings.restaurant_id 
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Restaurant owners can update their ordering settings"
  ON public.restaurant_ordering_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = restaurant_ordering_settings.restaurant_id 
    AND restaurants.user_id = auth.uid()
  ));

-- RLS policies for orders
CREATE POLICY "Restaurant owners can view their orders"
  ON public.orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = orders.restaurant_id 
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Restaurant owners can update their orders"
  ON public.orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.restaurants 
    WHERE restaurants.id = orders.restaurant_id 
    AND restaurants.user_id = auth.uid()
  ));

-- RLS policies for order_items
CREATE POLICY "Restaurant owners can view their order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    JOIN public.restaurants ON restaurants.id = orders.restaurant_id
    WHERE orders.id = order_items.order_id 
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- Public can view ordering settings for placing orders
CREATE POLICY "Public can view ordering settings"
  ON public.restaurant_ordering_settings FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_restaurant_ordering_settings_updated_at
  BEFORE UPDATE ON public.restaurant_ordering_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;