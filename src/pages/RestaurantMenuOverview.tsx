import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UtensilsCrossed, ChevronRight } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  intro_text: string | null;
  slug: string;
}

interface MenuType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

const RestaurantMenuOverview = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    // Fetch restaurant by slug
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (restaurantError || !restaurantData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setRestaurant(restaurantData);

    // Fetch active menus
    const { data: menusData } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .eq("is_active", true)
      .order("sort_order");

    setMenus(menusData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2 font-serif">Restaurant niet gevonden</h1>
            <p className="text-muted-foreground">
              Dit restaurant bestaat niet of de link is onjuist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          {restaurant?.logo_url ? (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-foreground/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary-foreground/20 flex items-center justify-center">
              <UtensilsCrossed className="h-12 w-12" />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold font-serif">{restaurant?.name}</h1>
          {restaurant?.intro_text && (
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-sm">
              {restaurant.intro_text}
            </p>
          )}
        </div>
      </header>

      {/* Menu Selection */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-center font-serif">Kies een menukaart</h2>
        
        {menus.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Er zijn nog geen menu's beschikbaar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {menus.map((menu) => (
              <Link key={menu.id} to={`/menu/${slug}/${menu.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold font-serif text-lg">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {menu.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Digitale menukaart door{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              digitalemenukaart.nl
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default RestaurantMenuOverview;