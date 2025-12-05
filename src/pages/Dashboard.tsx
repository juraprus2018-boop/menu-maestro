import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, QrCode, LogOut, Settings, Store, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email ?? null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email ?? null);
        fetchRestaurants();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRestaurants = async () => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif">Mijn Restaurants</h1>
            <p className="text-muted-foreground mt-1">
              Beheer uw restaurants en menu's
            </p>
          </div>
          <Link to="/dashboard/restaurant/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Restaurant toevoegen
            </Button>
          </Link>
        </div>

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
                  <div className="flex gap-2">
                    <Link to={`/dashboard/restaurant/${restaurant.id}/menus`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Menu className="mr-2 h-4 w-4" />
                        Menu's
                      </Button>
                    </Link>
                    <Link to={`/dashboard/restaurant/${restaurant.id}`}>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
