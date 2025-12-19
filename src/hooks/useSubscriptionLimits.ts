import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTierFromProductId, SubscriptionTier } from "@/lib/subscription-tiers";

interface SubscriptionLimits {
  tier: SubscriptionTier;
  maxRestaurants: number;
  maxMenusPerRestaurant: number;
  currentRestaurants: number;
  currentMenus: number;
  canCreateRestaurant: boolean;
  canCreateMenu: (restaurantId: string) => Promise<boolean>;
  loading: boolean;
}

export function useSubscriptionLimits(): SubscriptionLimits {
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [currentRestaurants, setCurrentRestaurants] = useState(0);
  const [loading, setLoading] = useState(true);

  const limits = {
    free: { maxRestaurants: 1, maxMenusPerRestaurant: 1 },
    pro: { maxRestaurants: Infinity, maxMenusPerRestaurant: Infinity },
    ordering: { maxRestaurants: Infinity, maxMenusPerRestaurant: Infinity },
  };

  useEffect(() => {
    fetchSubscriptionAndCounts();
  }, []);

  const fetchSubscriptionAndCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check subscription
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .eq("status", "active");

      if (subscriptions && subscriptions.length > 0) {
        // Get the highest tier
        const productIds = subscriptions.map(s => s.plan);
        const detectedTier = getTierFromProductId(productIds[0]);
        setTier(detectedTier);
      } else {
        setTier("free");
      }

      // Count restaurants
      const { count: restaurantCount } = await supabase
        .from("restaurants")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setCurrentRestaurants(restaurantCount || 0);
    } catch (error) {
      console.error("Error fetching subscription limits:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentLimits = limits[tier || "free"];
  const canCreateRestaurant = currentRestaurants < currentLimits.maxRestaurants;

  const canCreateMenu = async (restaurantId: string): Promise<boolean> => {
    if (tier === "pro" || tier === "ordering") return true;

    const { count } = await supabase
      .from("menus")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId);

    return (count || 0) < currentLimits.maxMenusPerRestaurant;
  };

  return {
    tier,
    maxRestaurants: currentLimits.maxRestaurants,
    maxMenusPerRestaurant: currentLimits.maxMenusPerRestaurant,
    currentRestaurants,
    currentMenus: 0,
    canCreateRestaurant,
    canCreateMenu,
    loading,
  };
}
