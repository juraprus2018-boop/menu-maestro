import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Store, UtensilsCrossed, ArrowLeft, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getTheme, ThemeConfig } from "@/lib/menu-themes";
import { getAllergenInfo, EU_ALLERGENS } from "@/components/AllergenSelector";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  intro_text: string | null;
  slug: string;
  theme: string | null;
}

interface MenuType {
  id: string;
  name: string;
  description: string | null;
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
  allergens: string[] | null;
}

const PublicMenu = () => {
  const { slug, menuId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(getTheme('default'));
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Get all unique allergens used in this menu
  const availableAllergens = useMemo(() => {
    const allergenSet = new Set<string>();
    menuItems.forEach(item => {
      item.allergens?.forEach(a => allergenSet.add(a));
    });
    return Array.from(allergenSet).sort();
  }, [menuItems]);

  // Filter menu items based on excluded allergens
  const filteredMenuItems = useMemo(() => {
    if (excludedAllergens.length === 0) return menuItems;
    return menuItems.filter(item => {
      if (!item.allergens || item.allergens.length === 0) return true;
      return !item.allergens.some(a => excludedAllergens.includes(a));
    });
  }, [menuItems, excludedAllergens]);

  const toggleAllergen = (allergen: string) => {
    setExcludedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  useEffect(() => {
    fetchMenu();
  }, [slug, menuId]);

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
    setTheme(getTheme(restaurantData.theme));

    // Fetch menu
    const { data: menuData, error: menuError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", menuId)
      .eq("restaurant_id", restaurantData.id)
      .maybeSingle();

    if (menuError || !menuData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setMenu(menuData);

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("menu_id", menuId)
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
              Dit menu bestaat niet of de link is onjuist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bodyBg}`}>
      {/* Header */}
      <header className={`${theme.headerBg} ${theme.headerText} py-8`}>
        <div className="container mx-auto px-4">
          <Link to={`/menu/${slug}`}>
            <Button variant="ghost" size="sm" className={`mb-4 ${theme.headerText}/80 hover:${theme.headerText} hover:bg-white/10`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Alle menu's
            </Button>
          </Link>
          <div className="text-center">
            {restaurant?.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center">
                <UtensilsCrossed className="h-12 w-12" />
              </div>
            )}
            <h1 className={`text-3xl md:text-4xl font-bold ${theme.titleFont}`}>{restaurant?.name}</h1>
            <p className={`mt-2 text-xl opacity-90 ${theme.bodyFont}`}>{menu?.name}</p>
            {menu?.description && (
              <p className={`mt-2 opacity-70 max-w-xl mx-auto ${theme.bodyFont}`}>
                {menu.description}
              </p>
            )}
            {restaurant?.intro_text && (
              <p className={`mt-4 opacity-80 max-w-xl mx-auto text-sm ${theme.bodyFont}`}>
                {restaurant.intro_text}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Allergen Filter */}
        {availableAllergens.length > 0 && (
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="mb-3"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter op allergenen
              {excludedAllergens.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {excludedAllergens.length}
                </Badge>
              )}
            </Button>
            
            {showFilterPanel && (
              <Card className={`p-4 ${theme.cardBg} ${theme.borderStyle}`}>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Verberg gerechten met deze allergenen:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableAllergens.map((allergen) => {
                      const info = getAllergenInfo(allergen);
                      const isExcluded = excludedAllergens.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                            isExcluded
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-background border-border hover:bg-muted"
                          }`}
                        >
                          <span>{info.emoji}</span>
                          <span>{info.label}</span>
                          {isExcluded && <X className="h-3 w-3 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                  {excludedAllergens.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExcludedAllergens([])}
                      className="text-xs"
                    >
                      Wis alle filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {categories.length === 0 ? (
          <Card className={`text-center py-12 ${theme.cardBg} ${theme.borderStyle}`}>
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
              const categoryItems = filteredMenuItems.filter(
                (item) => item.category_id === category.id
              );

              if (categoryItems.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="mb-4">
                    <h2 className={`text-2xl font-bold ${theme.titleFont} ${theme.accentColor}`}>
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className={`text-muted-foreground text-sm mt-1 ${theme.bodyFont}`}>
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {categoryItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-start gap-4 py-3">
                          <div className="flex-1">
                            <h3 className={`font-medium ${theme.accentColor} ${theme.bodyFont}`}>
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className={`text-sm text-muted-foreground mt-1 ${theme.bodyFont}`}>
                                {item.description}
                              </p>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.allergens.map((allergen) => {
                                  const info = getAllergenInfo(allergen);
                                  return (
                                    <span key={allergen} className="text-xs opacity-70">
                                      {info.emoji}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          {item.price !== null && (
                            <Badge className={`text-base font-semibold whitespace-nowrap ${theme.priceStyle}`}>
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
        <footer className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Digitale menukaart door{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${theme.accentColor} hover:underline`}
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