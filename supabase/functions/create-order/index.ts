import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation utilities
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function isValidPhone(phone: string): boolean {
  // Dutch phone format or international
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/;
  return phoneRegex.test(phone.trim());
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidPostalCode(code: string): boolean {
  // Dutch postal code format: 1234 AB or 1234AB
  const postalRegex = /^[0-9]{4}\s?[A-Z]{2}$/i;
  return postalRegex.test(code.trim());
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CreateOrderRequest {
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: "pickup" | "delivery";
  paymentMethod: "cash" | "card" | "ideal";
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  deliveryCity?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  estimatedTime?: number;
  requestedTime?: string;
  items: OrderItem[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: CreateOrderRequest = await req.json();
    console.log("Received order request:", JSON.stringify({
      restaurantId: body.restaurantId,
      customerName: body.customerName?.slice(0, 10),
      itemCount: body.items?.length,
    }));

    // Validate restaurantId
    if (!body.restaurantId || !isValidUUID(body.restaurantId)) {
      console.error("Invalid restaurantId:", body.restaurantId);
      return new Response(JSON.stringify({ error: "Ongeldig restaurant ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate customerName (required, 2-100 chars)
    if (!body.customerName || body.customerName.trim().length < 2 || body.customerName.length > 100) {
      console.error("Invalid customerName");
      return new Response(JSON.stringify({ error: "Naam moet tussen 2 en 100 tekens zijn" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate customerPhone (required, valid format)
    if (!body.customerPhone || !isValidPhone(body.customerPhone)) {
      console.error("Invalid customerPhone:", body.customerPhone);
      return new Response(JSON.stringify({ error: "Ongeldig telefoonnummer" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate customerEmail (optional, but must be valid if provided)
    if (body.customerEmail && body.customerEmail.trim() !== "" && !isValidEmail(body.customerEmail)) {
      console.error("Invalid customerEmail:", body.customerEmail);
      return new Response(JSON.stringify({ error: "Ongeldig e-mailadres" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate orderType
    if (!["pickup", "delivery"].includes(body.orderType)) {
      console.error("Invalid orderType:", body.orderType);
      return new Response(JSON.stringify({ error: "Ongeldige besteltype" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate paymentMethod
    if (!["cash", "card", "ideal"].includes(body.paymentMethod)) {
      console.error("Invalid paymentMethod:", body.paymentMethod);
      return new Response(JSON.stringify({ error: "Ongeldige betaalmethode" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate delivery address fields if delivery
    if (body.orderType === "delivery") {
      if (!body.deliveryAddress || body.deliveryAddress.trim().length < 5 || body.deliveryAddress.length > 200) {
        console.error("Invalid deliveryAddress");
        return new Response(JSON.stringify({ error: "Ongeldig bezorgadres" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      if (!body.deliveryPostalCode || !isValidPostalCode(body.deliveryPostalCode)) {
        console.error("Invalid deliveryPostalCode:", body.deliveryPostalCode);
        return new Response(JSON.stringify({ error: "Ongeldige postcode (formaat: 1234 AB)" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      if (!body.deliveryCity || body.deliveryCity.trim().length < 2 || body.deliveryCity.length > 100) {
        console.error("Invalid deliveryCity");
        return new Response(JSON.stringify({ error: "Ongeldige plaatsnaam" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    // Validate amounts
    if (typeof body.subtotal !== "number" || body.subtotal < 0 || body.subtotal > 10000) {
      console.error("Invalid subtotal:", body.subtotal);
      return new Response(JSON.stringify({ error: "Ongeldig subtotaal" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (typeof body.deliveryFee !== "number" || body.deliveryFee < 0 || body.deliveryFee > 100) {
      console.error("Invalid deliveryFee:", body.deliveryFee);
      return new Response(JSON.stringify({ error: "Ongeldige bezorgkosten" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (typeof body.total !== "number" || body.total < 0 || body.total > 10000) {
      console.error("Invalid total:", body.total);
      return new Response(JSON.stringify({ error: "Ongeldig totaalbedrag" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify total matches subtotal + delivery fee
    const expectedTotal = body.subtotal + body.deliveryFee;
    if (Math.abs(body.total - expectedTotal) > 0.01) {
      console.error("Total mismatch:", body.total, "expected:", expectedTotal);
      return new Response(JSON.stringify({ error: "Totaal komt niet overeen" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate notes (optional, max 500 chars)
    if (body.notes && body.notes.length > 500) {
      console.error("Notes too long:", body.notes.length);
      return new Response(JSON.stringify({ error: "Opmerkingen te lang (max 500 tekens)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      console.error("No items in order");
      return new Response(JSON.stringify({ error: "Bestelling moet minimaal 1 item bevatten" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (body.items.length > 50) {
      console.error("Too many items:", body.items.length);
      return new Response(JSON.stringify({ error: "Te veel items in bestelling" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate each item
    for (const item of body.items) {
      if (!item.menuItemId || !isValidUUID(item.menuItemId)) {
        console.error("Invalid menuItemId:", item.menuItemId);
        return new Response(JSON.stringify({ error: "Ongeldig menu item ID" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      if (!item.name || item.name.length > 200) {
        console.error("Invalid item name");
        return new Response(JSON.stringify({ error: "Ongeldige itemnaam" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      if (typeof item.price !== "number" || item.price < 0 || item.price > 1000) {
        console.error("Invalid item price:", item.price);
        return new Response(JSON.stringify({ error: "Ongeldige itemprijs" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 99) {
        console.error("Invalid item quantity:", item.quantity);
        return new Response(JSON.stringify({ error: "Ongeldige hoeveelheid" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      if (item.notes && item.notes.length > 200) {
        console.error("Item notes too long");
        return new Response(JSON.stringify({ error: "Item opmerkingen te lang" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    // Validate requestedTime if provided
    if (body.requestedTime && body.requestedTime !== "asap") {
      const requestedDate = new Date(body.requestedTime);
      if (isNaN(requestedDate.getTime())) {
        console.error("Invalid requestedTime:", body.requestedTime);
        return new Response(JSON.stringify({ error: "Ongeldig gewenst tijdstip" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      // Check it's not more than 24 hours in the future
      const now = new Date();
      const maxTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      if (requestedDate > maxTime || requestedDate < now) {
        console.error("RequestedTime out of range");
        return new Response(JSON.stringify({ error: "Gewenst tijdstip moet binnen 24 uur zijn" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    // All validations passed - create the order
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify restaurant exists
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, name")
      .eq("id", body.restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      console.error("Restaurant not found:", body.restaurantId);
      return new Response(JSON.stringify({ error: "Restaurant niet gevonden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Create order with sanitized data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: body.restaurantId,
        customer_name: sanitizeString(body.customerName, 100),
        customer_phone: sanitizeString(body.customerPhone, 20),
        customer_email: body.customerEmail ? sanitizeString(body.customerEmail, 255) : null,
        order_type: body.orderType,
        payment_method: body.paymentMethod,
        delivery_address: body.orderType === "delivery" ? sanitizeString(body.deliveryAddress!, 200) : null,
        delivery_postal_code: body.orderType === "delivery" ? sanitizeString(body.deliveryPostalCode!, 10).toUpperCase() : null,
        delivery_city: body.orderType === "delivery" ? sanitizeString(body.deliveryCity!, 100) : null,
        subtotal: body.subtotal,
        delivery_fee: body.deliveryFee,
        total: body.total,
        notes: body.notes ? sanitizeString(body.notes, 500) : null,
        estimated_time: body.estimatedTime || null,
        requested_time: body.requestedTime === "asap" ? null : body.requestedTime,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(JSON.stringify({ error: "Kon bestelling niet aanmaken" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      item_name: sanitizeString(item.name, 200),
      item_price: item.price,
      quantity: item.quantity,
      notes: item.notes ? sanitizeString(item.notes, 200) : null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Try to delete the order if items failed
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response(JSON.stringify({ error: "Kon bestellingsitems niet aanmaken" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("Order created successfully:", order.id);

    return new Response(JSON.stringify({ 
      success: true, 
      order: {
        id: order.id,
        order_number: order.order_number,
        total: order.total,
      },
      restaurantName: restaurant.name,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Er ging iets mis" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
