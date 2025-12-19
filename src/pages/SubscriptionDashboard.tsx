import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SUBSCRIPTION_TIERS, PLANS, getTierFromProductId } from "@/lib/subscription-tiers";

interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

export default function SubscriptionDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check admin status
    const { data: roleData } = await supabase.rpc("has_role", {
      _role: "admin",
      _user_id: session.user.id,
    });
    setIsAdmin(roleData || false);

    await checkSubscription();
  };

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Er ging iets mis bij het starten van de betaling");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Er ging iets mis bij het openen van het klantenportaal");
    } finally {
      setPortalLoading(false);
    }
  };

  const currentTier = subscription?.product_id ? getTierFromProductId(subscription.product_id) : null;

  const planGroups = [
    {
      title: "Gratis",
      tier: "free" as const,
      plans: [],
      features: SUBSCRIPTION_TIERS.free.features,
      isFree: true,
    },
    {
      title: "Pro",
      tier: "pro" as const,
      plans: [PLANS.pro_yearly],
      features: SUBSCRIPTION_TIERS.pro.features,
    },
    {
      title: "Bestellen",
      tier: "ordering" as const,
      plans: [PLANS.ordering_yearly],
      features: SUBSCRIPTION_TIERS.ordering.features,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Abonnement">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Abonnement">
      <SEO title="Abonnement | Dashboard" description="Beheer je abonnement en bekijk beschikbare plannen" />
      
      <div className="space-y-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Huidige Status</CardTitle>
            <CardDescription>Bekijk en beheer je abonnement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {subscription?.subscribed ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="bg-primary">
                        {currentTier === "ordering" ? "Bestellen" : currentTier === "pro" ? "Pro" : "Basis"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Actief</span>
                    </div>
                    {subscription.subscription_end && (
                      <p className="text-sm text-muted-foreground">
                        Verloopt op: {new Date(subscription.subscription_end).toLocaleDateString("nl-NL")}
                      </p>
                    )}
                  </>
                ) : isAdmin ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Admin Account</Badge>
                    <span className="text-sm text-muted-foreground">Volledige toegang</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Geen abonnement</Badge>
                    <span className="text-sm text-muted-foreground">Kies een abonnement hieronder</span>
                  </div>
                )}
              </div>
              
              {subscription?.subscribed && (
                <Button 
                  variant="outline" 
                  onClick={handleCustomerPortal}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  Beheer abonnement
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {planGroups.map((group) => {
            const isCurrentTier = currentTier === group.tier;
            
            return (
              <Card key={group.tier} className={isCurrentTier ? "border-primary ring-2 ring-primary/20" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{group.title}</CardTitle>
                    {isCurrentTier && (
                      <Badge variant="default" className="bg-primary">Actief</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {group.tier === "free" && "Altijd gratis te gebruiken"}
                    {group.tier === "pro" && "Inclusief meertalige menu's"}
                    {group.tier === "ordering" && "Complete besteloplossing"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <ul className="space-y-2">
                    {group.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price Options */}
                  <div className="space-y-2 pt-4 border-t">
                    {group.plans.map((plan) => (
                      <div key={plan.priceId} className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">€{plan.price}</span>
                          <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                          {plan.savings && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {plan.savings}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={isCurrentTier ? "outline" : "default"}
                          onClick={() => handleCheckout(plan.priceId)}
                          disabled={checkoutLoading === plan.priceId || (isCurrentTier && subscription?.subscribed)}
                        >
                          {checkoutLoading === plan.priceId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isCurrentTier && subscription?.subscribed ? (
                            "Huidig"
                          ) : (
                            "Kiezen"
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
