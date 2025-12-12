import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, sessionId } = await req.json();
    
    if (!orderId || !sessionId) {
      console.error("Missing required parameters: orderId or sessionId");
      return new Response(JSON.stringify({ error: "Missing orderId or sessionId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Verifying payment for order:", orderId, "session:", sessionId);

    // Initialize Stripe to verify the payment
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify that the session metadata matches the order
    if (session.metadata?.order_id !== orderId) {
      console.error("Session order_id mismatch:", session.metadata?.order_id, "vs", orderId);
      return new Response(JSON.stringify({ error: "Order ID mismatch" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify that the payment was actually completed
    if (session.payment_status !== "paid") {
      console.error("Payment not completed, status:", session.payment_status);
      return new Response(JSON.stringify({ error: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Stripe payment verified successfully for session:", sessionId);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First check if order exists and is in pending payment status
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_status, restaurant_id")
      .eq("id", orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error("Order not found:", orderId);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Prevent double-processing
    if (existingOrder.payment_status === "paid") {
      console.log("Order already marked as paid:", orderId);
      return new Response(JSON.stringify({ success: true, order: existingOrder, message: "Already processed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update order payment status to paid
    const { data, error } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      throw error;
    }

    console.log("Order payment status updated to paid:", orderId);

    // Send notification emails
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          restaurantId: data.restaurant_id,
        }),
      });
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError);
    }

    return new Response(JSON.stringify({ success: true, order: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
