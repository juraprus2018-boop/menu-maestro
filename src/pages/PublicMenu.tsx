import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Store, UtensilsCrossed } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  intro_text: string | null;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  is_available: boolean;
  category_id: string;
  sort_order: number;
}

const PublicMenu = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [slug]);

  const fetchMenu = async () => {
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

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .order("sort_order");

    setCategories(categoriesData || []);

    // Fetch menu items
    if (categoriesData && categoriesData.length > 0) {
      const { data: itemsData } = await supabase
        .from("menu_items")
        .select("*")
        .in("category_id", categoriesData.map(c => c.id))
        .eq("is_available", true)
        .order("sort_order");

      setMenuItems(itemsData || []);
    }

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
            <h1 className="text-2xl font-bold mb-2 font-serif">Menu niet gevonden</h1>
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
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              {restaurant.intro_text}
            </p>
          )}
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {categories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Het menu wordt binnenkort toegevoegd.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryItems = menuItems.filter(
                (item) => item.category_id === category.id
              );

              if (categoryItems.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold font-serif text-foreground">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {categoryItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-start gap-4 py-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.price !== null && (
                            <Badge variant="secondary" className="text-base font-semibold whitespace-nowrap">
                              €{item.price.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        {index < categoryItems.length - 1 && (
                          <Separator className="opacity-50" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
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

export default PublicMenu;
