import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // First, check for admin subscriptions in local database
    const { data: localSubs, error: localSubsError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (!localSubsError && localSubs && localSubs.length > 0) {
      logStep("Found local subscriptions (admin)", { count: localSubs.length });
      
      const productIds: string[] = localSubs.map(s => s.plan);
      const hasOrdering = productIds.some(id => id === "prod_TYAfzP0Dw0QUCD");
      const hasPro = productIds.some(id => ["prod_TY9h8WNr3r36TZ", "prod_TY9iuwNnHskHUB"].includes(id));
      const hasBasic = productIds.some(id => ["prod_TY8YjSp56UfCvH", "prod_TY8YRqbGHQQEL0"].includes(id));
      
      // Determine the main tier
      let mainProductId = null;
      if (hasOrdering) mainProductId = "prod_TYAfzP0Dw0QUCD";
      else if (hasPro) mainProductId = productIds.find(id => ["prod_TY9h8WNr3r36TZ", "prod_TY9iuwNnHskHUB"].includes(id)) || null;
      else if (hasBasic) mainProductId = productIds.find(id => ["prod_TY8YjSp56UfCvH", "prod_TY8YRqbGHQQEL0"].includes(id)) || null;

      return new Response(JSON.stringify({
        subscribed: true,
        plan: "monthly",
        product_id: mainProductId,
        product_ids: productIds,
        subscription_end: null, // Admin subs don't expire
        is_admin_subscription: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let plan = null;
    let subscriptionEnd = null;
    let priceId = null;
    let productId = null;
    const productIds: string[] = [];

    if (hasActiveSub) {
      // Collect all product IDs from all active subscriptions
      for (const subscription of subscriptions.data) {
        for (const item of subscription.items.data) {
          const prodId = item.price.product as string;
          if (!productIds.includes(prodId)) {
            productIds.push(prodId);
          }
        }
      }

      // Use the first non-ordering subscription for main plan info
      const mainSubscription = subscriptions.data.find((sub: { items: { data: { price: { product: string } }[] } }) => {
        const prodId = sub.items.data[0].price.product as string;
        return prodId !== "prod_TYAfzP0Dw0QUCD"; // Not the ordering product
      }) || subscriptions.data[0];

      subscriptionEnd = new Date(mainSubscription.current_period_end * 1000).toISOString();
      priceId = mainSubscription.items.data[0].price.id;
      productId = mainSubscription.items.data[0].price.product as string;
      
      // Determine plan type based on interval
      const interval = mainSubscription.items.data[0].price.recurring?.interval;
      plan = interval === "year" ? "yearly" : "monthly";
      
      logStep("Active subscriptions found", { count: subscriptions.data.length, productIds, plan, endDate: subscriptionEnd });

      // Update subscription in our database
      const { error: upsertError } = await supabaseClient
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: plan,
          status: "active",
          expires_at: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (upsertError) {
        logStep("Error updating subscription in DB", { error: upsertError.message });
      }
    } else {
      logStep("No active subscription found");
      
      // Check if user had a subscription that expired
      const { error: deleteError } = await supabaseClient
        .from("subscriptions")
        .delete()
        .eq("user_id", user.id);
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan: plan,
      price_id: priceId,
      product_id: productId,
      product_ids: productIds,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
