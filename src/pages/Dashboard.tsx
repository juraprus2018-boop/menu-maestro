import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Store, Menu, Settings, QrCode, ShoppingBag, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  slug: string;
  created_at: string;
}

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({
        title: "Betaling geslaagd!",
        description: "Je abonnement is nu actief.",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        fetchRestaurants();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        fetchRestaurants();
      }
    });

    return () => authSub.unsubscribe();
  }, [navigate]);

  const fetchRestaurants = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Fout",
        description: "Kon restaurants niet laden",
        variant: "destructive",
      });
    } else {
      setRestaurants(data || []);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout title="Overzicht">
      <SEO 
        title="Dashboard"
        description="Beheer uw restaurants en digitale menukaarten. Voeg menu's toe, bewerk gerechten en download QR-codes."
        noIndex={true}
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif">Welkom terug</h1>
            <p className="text-muted-foreground mt-1">
              Beheer uw restaurants en digitale menukaarten
            </p>
          </div>
          <Link to="/dashboard/restaurant/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuw restaurant
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Actieve restaurants</CardDescription>
              <CardTitle className="text-3xl">{restaurants.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Totaal menu's</CardDescription>
              <CardTitle className="text-3xl">-</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bestellingen vandaag</CardDescription>
              <CardTitle className="text-3xl">-</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Restaurants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Uw restaurants</h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Nog geen restaurants</h2>
                <p className="text-muted-foreground mb-6">
                  Voeg uw eerste restaurant toe om te beginnen met uw digitale menukaarten.
                </p>
                <Link to="/dashboard/restaurant/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Restaurant toevoegen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {restaurant.logo_url ? (
                          <img
                            src={restaurant.logo_url}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Store className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="font-serif">{restaurant.name}</CardTitle>
                          <CardDescription className="text-xs">
                            /{restaurant.slug}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/dashboard/restaurant/${restaurant.id}/menus`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Menu className="mr-1 h-3 w-3" />
                          Menu's
                        </Button>
                      </Link>
                      <Link to={`/dashboard/restaurant/${restaurant.id}/orders`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <ShoppingBag className="mr-1 h-3 w-3" />
                          Bestellingen
                        </Button>
                      </Link>
                      <Link to={`/dashboard/restaurant/${restaurant.id}/qr`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <QrCode className="mr-1 h-3 w-3" />
                          QR-code
                        </Button>
                      </Link>
                      <Link to={`/dashboard/restaurant/${restaurant.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="mr-1 h-3 w-3" />
                          Instellingen
                        </Button>
                      </Link>
                    </div>
                    <Link to={`/menu/${restaurant.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        <Eye className="mr-1 h-3 w-3" />
                        Bekijk menukaart
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
