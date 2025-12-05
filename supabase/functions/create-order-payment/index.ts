import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderPaymentRequest {
  orderId: string;
  customerEmail?: string;
  customerName: string;
  totalAmount: number; // in euros
  restaurantName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, customerName, totalAmount, restaurantName }: OrderPaymentRequest = await req.json();
    
    console.log("Creating payment session for order:", orderId, "Amount:", totalAmount);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Convert euros to cents
    const amountInCents = Math.round(totalAmount * 100);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Bestelling bij ${restaurantName}`,
              description: `Order #${orderId.slice(0, 8)}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?order_id=${orderId}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancelled?order_id=${orderId}`,
      metadata: {
        order_id: orderId,
      },
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Stripe session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
