import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Loader2, CreditCard, Globe, ShoppingBag } from "lucide-react";
import { PLANS, SUBSCRIPTION_TIERS, getTierFromProductId, SubscriptionTier } from "@/lib/subscription-tiers";
import SEO from "@/components/SEO";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    subscribed: boolean;
    tier: SubscriptionTier;
    plan: string | null;
    subscription_end: string | null;
    hasOrdering?: boolean;
  } | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    
    if (searchParams.get("checkout") === "canceled") {
      toast({
        title: "Checkout geannuleerd",
        description: "Je betaling is geannuleerd.",
      });
    }
  }, [searchParams]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await checkSubscription();
    } else {
      setCheckingSubscription(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      const tier = getTierFromProductId(data.product_id);
      const hasOrdering = data.product_ids?.includes("prod_TYAfzP0Dw0QUCD") || false;
      setSubscription({ ...data, tier, hasOrdering });
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (planKey: keyof typeof PLANS) => {
    if (!user) {
      navigate("/auth?redirect=/pricing");
      return;
    }

    setLoading(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PLANS[planKey].priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Fout",
        description: "Kon checkout niet starten: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error opening portal:", error);
      toast({
        title: "Fout",
        description: "Kon beheerportaal niet openen: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlanKey = (): string | null => {
    if (!subscription?.subscribed || subscription.tier === "free") return null;
    if (subscription.tier === "ordering") return "ordering_yearly";
    if (subscription.tier === "pro") return "pro_yearly";
    return null;
  };

  const currentPlanKey = getCurrentPlanKey();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Abonnement kiezen"
        description="Kies het abonnement dat bij uw restaurant past. Gratis digitale menukaart bij registratie."
        canonicalUrl="/pricing"
      />
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-serif text-primary">Abonnement kiezen</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif mb-4">
            Gratis digitale menukaart
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subscription?.subscribed && subscription.tier !== "free"
              ? `Je hebt momenteel een ${subscription.tier === "ordering" ? "Bestellen" : "Pro"} abonnement.`
              : "Registreer gratis en start direct met je digitale menukaart. Upgrade wanneer je meer nodig hebt."}
          </p>
        </div>

        {checkingSubscription ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Free Tier Card */}
            <div className="max-w-md mx-auto mb-12">
              <Card className={`relative ${subscription?.tier === "free" ? "ring-2 ring-primary" : ""}`}>
                {subscription?.tier === "free" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Jouw huidige plan
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-2xl">Gratis</CardTitle>
                  <CardDescription>Perfect om te starten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 text-center">
                    <span className="text-5xl font-bold">€0</span>
                    <span className="text-muted-foreground">/voor altijd</span>
                  </div>
                  <ul className="space-y-3">
                    {SUBSCRIPTION_TIERS.free.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Button className="w-full" variant="outline" disabled>
                      <Check className="h-4 w-4 mr-2" />
                      Inbegrepen bij registratie
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => navigate("/auth?mode=signup")}>
                      Gratis registreren
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold font-serif mb-2">Meer nodig?</h3>
              <p className="text-muted-foreground">Upgrade voor meer talen, restaurants en functionaliteiten</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Pro Yearly */}
              <Card className={`relative border-primary ${currentPlanKey === "pro_yearly" ? "ring-2 ring-primary" : ""}`}>
                {currentPlanKey === "pro_yearly" ? (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Huidig abonnement</Badge>
                ) : (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Populair</Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    Pro <Globe className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription>{PLANS.pro_yearly.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{PLANS.pro_yearly.price}</span>
                    <span className="text-muted-foreground">/{PLANS.pro_yearly.interval}</span>
                  </div>
                  <ul className="space-y-3">
                    {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlanKey === "pro_yearly" ? (
                    <Button className="w-full" variant="outline" onClick={handleManageSubscription} disabled={loading === "manage"}>
                      {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                      Beheer abonnement
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleSubscribe("pro_yearly")} disabled={loading === "pro_yearly"}>
                      {loading === "pro_yearly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {subscription?.tier === "free" ? "Upgrade naar Pro" : "Kies Pro"}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Ordering Yearly */}
              <Card className={`relative ${currentPlanKey === "ordering_yearly" ? "ring-2 ring-primary" : ""}`}>
                {currentPlanKey === "ordering_yearly" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Huidig abonnement</Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Bestellen
                  </CardTitle>
                  <CardDescription>{PLANS.ordering_yearly.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{PLANS.ordering_yearly.price}</span>
                    <span className="text-muted-foreground">/{PLANS.ordering_yearly.interval}</span>
                  </div>
                  <ul className="space-y-3">
                    {SUBSCRIPTION_TIERS.ordering.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {subscription?.hasOrdering ? (
                    <Button className="w-full" variant="outline" onClick={handleManageSubscription} disabled={loading === "manage"}>
                      {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                      Beheer abonnement
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleSubscribe("ordering_yearly")} disabled={loading === "ordering_yearly"}>
                      {loading === "ordering_yearly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Kies Bestellen
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Pricing;
