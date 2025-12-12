import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  restaurantId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, restaurantId }: OrderNotificationRequest = await req.json();

    // Validate required parameters
    if (!orderId || !restaurantId) {
      console.error("Missing required parameters: orderId or restaurantId");
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId) || !uuidRegex.test(restaurantId)) {
      console.error("Invalid UUID format:", orderId, restaurantId);
      return new Response(JSON.stringify({ error: "Invalid ID format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Processing order notification for:", orderId, "restaurant:", restaurantId);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details with validation that it belongs to the restaurant
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .single();

    if (orderError || !order) {
      console.error("Order not found or doesn't belong to restaurant:", orderId, restaurantId, orderError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Verify the order was created recently (within last 48 hours) to prevent abuse
    const orderCreatedAt = new Date(order.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - orderCreatedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 48) {
      console.error("Order too old for notification:", orderId, "Created:", order.created_at);
      return new Response(JSON.stringify({ error: "Order too old" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify order is actually paid before sending notification (for iDEAL payments)
    if (order.payment_method === "ideal" && order.payment_status !== "paid") {
      console.error("Order not paid yet, skipping notification:", orderId);
      return new Response(JSON.stringify({ error: "Order not paid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
    }

    // Fetch restaurant details
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("name, user_id")
      .eq("id", restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      console.error("Error fetching restaurant:", restaurantError);
      return new Response(JSON.stringify({ error: "Restaurant not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Fetch restaurant owner's email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", restaurant.user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    const ownerEmail = profile?.email;

    // Setup SMTP client
    const smtpHost = Deno.env.get("SMTP_HOST")!;
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUsername = Deno.env.get("SMTP_USERNAME")!;
    const smtpPassword = Deno.env.get("SMTP_PASSWORD")!;
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL")!;

    if (!smtpHost || !smtpUsername || !smtpPassword) {
      console.error("SMTP configuration missing");
      return new Response(JSON.stringify({ error: "Email configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        },
      },
    });

    // Format order items for email
    const itemsList = (orderItems || [])
      .map((item: any) => `• ${item.quantity}x ${item.item_name} - €${item.item_price.toFixed(2)}${item.notes ? ` (${item.notes})` : ""}`)
      .join("\n");

    const orderTypeLabel = order.order_type === "delivery" ? "Bezorgen" : "Afhalen";
    const paymentMethodLabel = 
      order.payment_method === "cash" ? "Contant" : 
      order.payment_method === "card" ? "Pinnen" : "iDEAL";

    // Send customer confirmation email
    if (order.customer_email) {
      const customerSubject = `Bestelbevestiging #${order.order_number} - ${restaurant.name}`;
      const customerBody = `
Beste ${order.customer_name},

Bedankt voor je bestelling bij ${restaurant.name}!

BESTELGEGEVENS
━━━━━━━━━━━━━━━━━━━━
Bestelnummer: #${order.order_number}
Type: ${orderTypeLabel}
Betaalmethode: ${paymentMethodLabel}

PRODUCTEN
━━━━━━━━━━━━━━━━━━━━
${itemsList}

━━━━━━━━━━━━━━━━━━━━
Subtotaal: €${order.subtotal.toFixed(2)}
${order.delivery_fee ? `Bezorgkosten: €${order.delivery_fee.toFixed(2)}` : ""}
TOTAAL: €${order.total.toFixed(2)}

${order.order_type === "delivery" ? `
BEZORGADRES
━━━━━━━━━━━━━━━━━━━━
${order.delivery_address}
${order.delivery_postal_code} ${order.delivery_city}
` : ""}
${order.notes ? `
OPMERKINGEN
━━━━━━━━━━━━━━━━━━━━
${order.notes}
` : ""}

${order.estimated_time ? `Geschatte tijd: ${order.estimated_time} minuten` : ""}

Met vriendelijke groet,
${restaurant.name}
      `.trim();

      try {
        await client.send({
          from: smtpFromEmail,
          to: order.customer_email,
          subject: customerSubject,
          content: customerBody,
        });
        console.log("Customer confirmation email sent to:", order.customer_email);
      } catch (emailError) {
        console.error("Error sending customer email:", emailError);
      }
    }

    // Send restaurant owner notification email
    if (ownerEmail) {
      const ownerSubject = `🔔 Nieuwe bestelling #${order.order_number}`;
      const ownerBody = `
NIEUWE BESTELLING ONTVANGEN!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bestelnummer: #${order.order_number}
Tijdstip: ${new Date(order.created_at).toLocaleString("nl-NL")}

KLANTGEGEVENS
━━━━━━━━━━━━━━━━━━━━
Naam: ${order.customer_name}
Telefoon: ${order.customer_phone}
${order.customer_email ? `E-mail: ${order.customer_email}` : ""}

BESTELLING
━━━━━━━━━━━━━━━━━━━━
Type: ${orderTypeLabel}
Betaalmethode: ${paymentMethodLabel}

${itemsList}

━━━━━━━━━━━━━━━━━━━━
TOTAAL: €${order.total.toFixed(2)}

${order.order_type === "delivery" ? `
BEZORGADRES
━━━━━━━━━━━━━━━━━━━━
${order.delivery_address}
${order.delivery_postal_code} ${order.delivery_city}
` : ""}
${order.notes ? `
OPMERKINGEN
━━━━━━━━━━━━━━━━━━━━
${order.notes}
` : ""}
      `.trim();

      try {
        await client.send({
          from: smtpFromEmail,
          to: ownerEmail,
          subject: ownerSubject,
          content: ownerBody,
        });
        console.log("Restaurant owner notification sent to:", ownerEmail);
      } catch (emailError) {
        console.error("Error sending owner email:", emailError);
      }
    }

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});