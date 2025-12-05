import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Loader2, CreditCard, Globe, ShoppingBag } from "lucide-react";
import { PLANS, SUBSCRIPTION_TIERS, getTierFromProductId, SubscriptionTier } from "@/lib/subscription-tiers";

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
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

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
    if (!subscription?.subscribed) return null;
    const interval = subscription.plan === "yearly" ? "yearly" : "monthly";
    if (subscription.tier === "pro") return `pro_${interval}`;
    return `basic_${interval}`;
  };

  const currentPlanKey = getCurrentPlanKey();

  return (
    <div className="min-h-screen bg-background">
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
            Kies het abonnement dat bij jou past
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subscription?.subscribed 
              ? `Je hebt momenteel een ${subscription.tier === "pro" ? "Pro" : "Basis"} abonnement.`
              : "Probeer 30 dagen gratis, daarna kies je het abonnement dat bij jou past."}
          </p>
        </div>

        {checkingSubscription ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Tabs value={billingInterval} onValueChange={(v) => setBillingInterval(v as "monthly" | "yearly")} className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="monthly">Maandelijks</TabsTrigger>
                  <TabsTrigger value="yearly">Jaarlijks (bespaar!)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Basic Monthly */}
                  <Card className={`relative ${currentPlanKey === "basic_monthly" ? "ring-2 ring-primary" : ""}`}>
                    {currentPlanKey === "basic_monthly" && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Huidig abonnement
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="font-serif">Basis</CardTitle>
                      <CardDescription>{PLANS.basic_monthly.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">€{PLANS.basic_monthly.price}</span>
                        <span className="text-muted-foreground">/{PLANS.basic_monthly.interval}</span>
                      </div>
                      <ul className="space-y-3">
                        {SUBSCRIPTION_TIERS.basic.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {currentPlanKey === "basic_monthly" ? (
                        <Button className="w-full" variant="outline" onClick={handleManageSubscription} disabled={loading === "manage"}>
                          {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                          Beheer abonnement
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleSubscribe("basic_monthly")} disabled={loading === "basic_monthly" || subscription?.subscribed}>
                          {loading === "basic_monthly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          {subscription?.subscribed ? "Al geabonneerd" : "Kies Basis"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  {/* Pro Monthly */}
                  <Card className={`relative border-primary ${currentPlanKey === "pro_monthly" ? "ring-2 ring-primary" : ""}`}>
                    {currentPlanKey === "pro_monthly" ? (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Huidig abonnement</Badge>
                    ) : (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Aanbevolen</Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="font-serif flex items-center gap-2">
                        Pro <Globe className="h-5 w-5 text-primary" />
                      </CardTitle>
                      <CardDescription>{PLANS.pro_monthly.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">€{PLANS.pro_monthly.price}</span>
                        <span className="text-muted-foreground">/{PLANS.pro_monthly.interval}</span>
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
                      {currentPlanKey === "pro_monthly" ? (
                        <Button className="w-full" variant="outline" onClick={handleManageSubscription} disabled={loading === "manage"}>
                          {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                          Beheer abonnement
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleSubscribe("pro_monthly")} disabled={loading === "pro_monthly"}>
                          {loading === "pro_monthly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          {subscription?.tier === "basic" ? "Upgrade naar Pro" : "Kies Pro"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="yearly" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Basic Yearly */}
                  <Card className={`relative ${currentPlanKey === "basic_yearly" ? "ring-2 ring-primary" : ""}`}>
                    {currentPlanKey === "basic_yearly" && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Huidig abonnement</Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="font-serif">Basis</CardTitle>
                      <CardDescription>{PLANS.basic_yearly.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">€{PLANS.basic_yearly.price}</span>
                        <span className="text-muted-foreground">/{PLANS.basic_yearly.interval}</span>
                        {PLANS.basic_yearly.savings && (
                          <Badge variant="secondary" className="ml-2">{PLANS.basic_yearly.savings}</Badge>
                        )}
                      </div>
                      <ul className="space-y-3">
                        {SUBSCRIPTION_TIERS.basic.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {currentPlanKey === "basic_yearly" ? (
                        <Button className="w-full" variant="outline" onClick={handleManageSubscription} disabled={loading === "manage"}>
                          {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                          Beheer abonnement
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleSubscribe("basic_yearly")} disabled={loading === "basic_yearly" || subscription?.subscribed}>
                          {loading === "basic_yearly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          {subscription?.subscribed ? "Al geabonneerd" : "Kies Basis Jaar"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  {/* Pro Yearly */}
                  <Card className={`relative border-primary ${currentPlanKey === "pro_yearly" ? "ring-2 ring-primary" : ""}`}>
                    {currentPlanKey === "pro_yearly" ? (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Huidig abonnement</Badge>
                    ) : (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Beste waarde</Badge>
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
                        {PLANS.pro_yearly.savings && (
                          <Badge variant="secondary" className="ml-2">{PLANS.pro_yearly.savings}</Badge>
                        )}
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
                          {subscription?.tier === "basic" ? "Upgrade naar Pro" : "Kies Pro Jaar"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Ordering Add-on */}
            <div className="max-w-2xl mx-auto mt-12">
              <h3 className="text-2xl font-bold font-serif text-center mb-6">Extra module</h3>
              <Card className={`relative ${subscription?.hasOrdering ? "ring-2 ring-primary" : "border-dashed"}`}>
                {subscription?.hasOrdering && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Actief</Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Bestellen
                  </CardTitle>
                  <CardDescription>Laat gasten online bestellen via jouw menukaart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{PLANS.ordering_monthly.price.toFixed(2).replace(".", ",")}</span>
                    <span className="text-muted-foreground">/maand</span>
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
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe("ordering_monthly")} 
                      disabled={loading === "ordering_monthly" || !subscription?.subscribed}
                    >
                      {loading === "ordering_monthly" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {!subscription?.subscribed ? "Eerst basis abonnement nodig" : "Voeg Bestellen toe"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                Betaal veilig met iDEAL of creditcard via Stripe
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Pricing;
