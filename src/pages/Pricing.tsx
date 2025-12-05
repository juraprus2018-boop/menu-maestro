import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Loader2, CreditCard } from "lucide-react";

const PLANS = {
  monthly: {
    name: "Maandelijks",
    price: 9,
    priceId: "price_1Sb2GyLmpOLDgj0k9mSaNNtE",
    interval: "maand",
    description: "Flexibel en maandelijks opzegbaar",
  },
  yearly: {
    name: "Jaarlijks",
    price: 95,
    priceId: "price_1Sb2HKLmpOLDgj0kedsYM3Pe",
    interval: "jaar",
    description: "Bespaar 12% - beste waarde!",
    savings: "Bespaar €13",
  },
};

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    subscribed: boolean;
    plan: string | null;
    subscription_end: string | null;
  } | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    
    // Check for canceled checkout
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
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    if (!user) {
      navigate("/auth?redirect=/pricing");
      return;
    }

    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PLANS[plan].priceId },
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

  const features = [
    "Onbeperkt menu's aanmaken",
    "QR-codes genereren",
    "Meerdere templates",
    "Real-time aanpassingen",
    "Onbeperkt categorieën",
    "Afbeeldingen uploaden",
  ];

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif mb-4">
            Start vandaag nog met je digitale menukaart
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subscription?.subscribed 
              ? "Je hebt momenteel een actief abonnement."
              : "Probeer 30 dagen gratis, daarna kies je het abonnement dat bij jou past."}
          </p>
        </div>

        {checkingSubscription ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <Card className={`relative ${subscription?.plan === "monthly" ? "ring-2 ring-primary" : ""}`}>
                {subscription?.plan === "monthly" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Huidig abonnement
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-serif">{PLANS.monthly.name}</CardTitle>
                  <CardDescription>{PLANS.monthly.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{PLANS.monthly.price}</span>
                    <span className="text-muted-foreground">/{PLANS.monthly.interval}</span>
                  </div>
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {subscription?.plan === "monthly" ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={loading === "manage"}
                    >
                      {loading === "manage" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Beheer abonnement
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe("monthly")}
                      disabled={loading === "monthly" || subscription?.subscribed}
                    >
                      {loading === "monthly" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {subscription?.subscribed ? "Al geabonneerd" : "Kies maandelijks"}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Yearly Plan */}
              <Card className={`relative ${subscription?.plan === "yearly" ? "ring-2 ring-primary" : "border-primary"}`}>
                {subscription?.plan === "yearly" ? (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Huidig abonnement
                  </Badge>
                ) : (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Aanbevolen
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-serif">{PLANS.yearly.name}</CardTitle>
                  <CardDescription>{PLANS.yearly.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{PLANS.yearly.price}</span>
                    <span className="text-muted-foreground">/{PLANS.yearly.interval}</span>
                    {PLANS.yearly.savings && (
                      <Badge variant="secondary" className="ml-2">
                        {PLANS.yearly.savings}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {subscription?.plan === "yearly" ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={loading === "manage"}
                    >
                      {loading === "manage" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Beheer abonnement
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe("yearly")}
                      disabled={loading === "yearly" || subscription?.subscribed}
                    >
                      {loading === "yearly" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {subscription?.subscribed ? "Al geabonneerd" : "Kies jaarlijks"}
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
