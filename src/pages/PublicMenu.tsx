import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, UtensilsCrossed, ArrowLeft, Filter, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getTheme, ThemeConfig } from "@/lib/menu-themes";
import { getAllergenInfo } from "@/components/AllergenSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/ordering/CartDrawer";
import { CheckoutForm } from "@/components/ordering/CheckoutForm";
import { toast } from "sonner";
import { isRestaurantOpen, OpeningHours } from "@/components/OpeningHoursEditor";
import SEO from "@/components/SEO";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  intro_text: string | null;
  slug: string;
  theme: string | null;
  enabled_languages: string[];
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

interface Translation {
  entity_type: string;
  entity_id: string;
  field_name: string;
  language_code: string;
  translation_text: string;
}

interface OrderingSettings {
  is_ordering_enabled: boolean;
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  accepts_cash: boolean;
  accepts_card: boolean;
  accepts_ideal: boolean;
  delivery_fee: number | null;
  minimum_order_amount: number | null;
  estimated_pickup_time: number | null;
  estimated_delivery_time: number | null;
  opening_hours: Record<string, { open: string; close: string; closed: boolean }> | null;
}

const PublicMenu = () => {
  const { slug, menuId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(getTheme('default'));
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("nl");
  const [orderingSettings, setOrderingSettings] = useState<OrderingSettings | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cart = useCart();

  // Get translation helper
  const getTranslation = (entityType: string, entityId: string, fieldName: string, fallback: string) => {
    if (currentLanguage === "nl") return fallback;
    const translation = translations.find(
      t => t.entity_type === entityType && t.entity_id === entityId && 
           t.field_name === fieldName && t.language_code === currentLanguage
    );
    return translation?.translation_text || fallback;
  };

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

  const handleAddToCart = (item: MenuItem) => {
    if (item.price === null) return;
    cart.addItem(item.id, item.name, item.price);
    toast.success(`${item.name} toegevoegd aan winkelwagen`);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    cart.clearCart();
  };

  useEffect(() => {
    fetchMenu();
  }, [slug, menuId]);

  // Fetch translations when language changes
  useEffect(() => {
    if (restaurant && currentLanguage !== "nl") {
      fetchTranslations();
    }
  }, [currentLanguage, restaurant]);

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

    // Fetch ordering settings
    const { data: orderingData } = await supabase
      .from("restaurant_ordering_settings")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .maybeSingle();

    if (orderingData) {
      setOrderingSettings({
        ...orderingData,
        opening_hours: orderingData.opening_hours as Record<string, { open: string; close: string; closed: boolean }> | null,
      });
    }

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

  const fetchTranslations = async () => {
    if (!restaurant || !menu) return;

    // Get all entity IDs we need translations for
    const entityIds = [
      restaurant.id,
      menu.id,
      ...categories.map(c => c.id),
      ...menuItems.map(i => i.id),
    ];

    const { data } = await supabase
      .from("translations")
      .select("*")
      .eq("language_code", currentLanguage)
      .in("entity_id", entityIds);

    setTranslations(data || []);
  };

  const isOrderingEnabled = orderingSettings?.is_ordering_enabled && 
    (orderingSettings.accepts_pickup || orderingSettings.accepts_delivery);

  const openStatus = orderingSettings?.opening_hours 
    ? isRestaurantOpen(orderingSettings.opening_hours as unknown as OpeningHours)
    : { isOpen: true, message: "" };

  const canOrder = isOrderingEnabled && openStatus.isOpen;

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

  const enabledLanguages = restaurant?.enabled_languages || [];

  return (
    <div className={`min-h-screen ${theme.bodyBg}`}>
      {/* Header */}
      <header className={`${theme.headerBg} ${theme.headerText} py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Link to={`/menu/${slug}`}>
              <Button variant="ghost" size="sm" className={`${theme.headerText}/80 hover:${theme.headerText} hover:bg-white/10`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Alle menu's
              </Button>
            </Link>
            {enabledLanguages.length > 0 && (
              <LanguageSelector
                currentLanguage={currentLanguage}
                availableLanguages={enabledLanguages}
                onLanguageChange={setCurrentLanguage}
                className="bg-white/10 border-white/20 text-inherit hover:bg-white/20"
              />
            )}
          </div>
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
            <h1 className={`text-3xl md:text-4xl font-bold ${theme.titleFont}`}>
              {getTranslation("restaurant", restaurant?.id || "", "name", restaurant?.name || "")}
            </h1>
            <p className={`mt-2 text-xl opacity-90 ${theme.bodyFont}`}>
              {getTranslation("menu", menu?.id || "", "name", menu?.name || "")}
            </p>
            {menu?.description && (
              <p className={`mt-2 opacity-70 max-w-xl mx-auto ${theme.bodyFont}`}>
                {getTranslation("menu", menu.id, "description", menu.description)}
              </p>
            )}
            {restaurant?.intro_text && (
              <p className={`mt-4 opacity-80 max-w-xl mx-auto text-sm ${theme.bodyFont}`}>
                {getTranslation("restaurant", restaurant.id, "intro_text", restaurant.intro_text)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Ordering Banner */}
      {isOrderingEnabled && (
        <div className={`py-3 text-center ${openStatus.isOpen ? 'bg-primary text-primary-foreground' : 'bg-orange-500 text-white'}`}>
          <p className="text-sm font-medium">
            {openStatus.isOpen 
              ? "🛒 Online bestellen is beschikbaar! Voeg items toe aan je winkelwagen."
              : `⏰ ${openStatus.message}. Je kunt de kaart bekijken maar niet bestellen.`
            }
          </p>
        </div>
      )}

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
          <div className="space-y-10">
            {categories.map((category) => {
              const categoryItems = filteredMenuItems.filter(
                (item) => item.category_id === category.id
              );

              if (categoryItems.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="mb-6">
                    <h2 className={`${theme.categoryStyle}`}>
                      {getTranslation("category", category.id, "name", category.name)}
                    </h2>
                    {category.description && (
                      <p className={`text-muted-foreground text-sm mt-2 ${theme.bodyFont}`}>
                        {getTranslation("category", category.id, "description", category.description)}
                      </p>
                    )}
                  </div>
                  <div>
                    {categoryItems.map((item, index) => (
                      <div key={item.id} className={`${theme.itemSpacing} ${index > 0 ? theme.borderStyle : ''}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className={`font-medium ${theme.accentColor}`}>
                              {getTranslation("item", item.id, "name", item.name)}
                            </h3>
                            {item.description && (
                              <p className={`text-sm mt-1 ${theme.bodyFont}`}>
                                {getTranslation("item", item.id, "description", item.description)}
                              </p>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
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
                          <div className="flex items-center gap-2">
                            {item.price !== null && (
                              <span className={`text-base font-medium whitespace-nowrap ${theme.priceStyle}`}>
                                €{item.price.toFixed(2)}
                              </span>
                            )}
                            {canOrder && item.price !== null && (
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
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

      {/* Cart Drawer */}
      {canOrder && orderingSettings && (
        <>
          <CartDrawer
            items={cart.items}
            subtotal={cart.subtotal}
            totalItems={cart.totalItems}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onUpdateNotes={cart.updateNotes}
            onCheckout={handleCheckout}
            minimumOrderAmount={orderingSettings.minimum_order_amount || 0}
            isOpen={isCartOpen}
            onOpenChange={setIsCartOpen}
          />
          <CheckoutForm
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cart.items}
            subtotal={cart.subtotal}
            restaurantId={restaurant?.id || ""}
            restaurantName={restaurant?.name || ""}
            orderingSettings={orderingSettings}
            onOrderComplete={handleOrderComplete}
          />
        </>
      )}
    </div>
  );
};

export default PublicMenu;
