import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit2, Trash2, QrCode, GripVertical, Eye, Globe, Upload, X } from "lucide-react";
import { AllergenSelector, getAllergenInfo } from "@/components/AllergenSelector";
import TranslationManager from "@/components/TranslationManager";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  image_url: string | null;
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

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  enabled_languages: string[];
}

interface MenuType {
  id: string;
  name: string;
  restaurant_id: string;
}

const MenuManager = () => {
  const { id: restaurantId, menuId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Category form
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);

  // Item form
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemAllergens, setItemAllergens] = useState<string[]>([]);

  // Translation dialog
  const [translationDialogOpen, setTranslationDialogOpen] = useState(false);
  const [translationTarget, setTranslationTarget] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
    fields: { name: string; label: string; multiline?: boolean; originalValue: string }[];
  } | null>(null);

  const hasMultipleLanguages = restaurant?.enabled_languages && restaurant.enabled_languages.filter(l => l !== "nl").length > 0;

  const openTranslationDialog = (
    type: "category" | "item",
    id: string,
    name: string,
    description: string | null
  ) => {
    const fields = [
      { name: "name", label: "Naam", originalValue: name },
      { name: "description", label: "Beschrijving", multiline: true, originalValue: description || "" },
    ];
    setTranslationTarget({ type, id, name, fields });
    setTranslationDialogOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId, menuId]);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, name, slug, enabled_languages")
      .eq("id", restaurantId)
      .single();

    if (restaurantError || !restaurantData) {
      toast({
        title: "Fout",
        description: "Restaurant niet gevonden",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setRestaurant(restaurantData);

    const { data: menuData, error: menuError } = await supabase
      .from("menus")
      .select("id, name, restaurant_id")
      .eq("id", menuId)
      .single();

    if (menuError || !menuData) {
      toast({
        title: "Fout",
        description: "Menu niet gevonden",
        variant: "destructive",
      });
      navigate(`/dashboard/restaurant/${restaurantId}/menus`);
      return;
    }

    setMenu(menuData);

    const { data: categoriesData } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("menu_id", menuId)
      .order("sort_order");

    setCategories(categoriesData || []);

    if (categoriesData && categoriesData.length > 0) {
      const { data: itemsData } = await supabase
        .from("menu_items")
        .select("*")
        .in("category_id", categoriesData.map(c => c.id))
        .order("sort_order");

      setMenuItems(itemsData || []);
    } else {
      setMenuItems([]);
    }
    
    setLoading(false);
  };

  // Category functions
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || "");
      setCategoryImageUrl(category.image_url || "");
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImageUrl("");
    }
    setCategoryDialogOpen(true);
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCategoryImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `category-${Date.now()}.${fileExt}`;
    const filePath = `${restaurantId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("restaurant-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Fout bij uploaden", description: uploadError.message, variant: "destructive" });
      setUploadingCategoryImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("restaurant-assets")
      .getPublicUrl(filePath);

    setCategoryImageUrl(publicUrl);
    setUploadingCategoryImage(false);
  };

  const saveCategory = async () => {
    if (!categoryName.trim()) return;

    const categoryData = {
      name: categoryName,
      description: categoryDescription || null,
      image_url: categoryImageUrl || null,
      menu_id: menuId,
      restaurant_id: restaurantId,
      sort_order: editingCategory ? editingCategory.sort_order : categories.length,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from("menu_categories")
        .update(categoryData)
        .eq("id", editingCategory.id);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Opgeslagen" });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("menu_categories")
        .insert(categoryData);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Categorie toegevoegd" });
        fetchData();
      }
    }
    setCategoryDialogOpen(false);
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Weet u zeker dat u deze categorie wilt verwijderen? Alle gerechten worden ook verwijderd.")) return;

    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verwijderd" });
      fetchData();
    }
  };

  // Item functions
  const openItemDialog = (categoryId: string, item?: MenuItem) => {
    setItemCategoryId(categoryId);
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemDescription(item.description || "");
      setItemPrice(item.price !== null ? item.price.toString() : "");
      setItemAllergens(item.allergens || []);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemAllergens([]);
    }
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    if (!itemName.trim()) return;

    const itemData = {
      name: itemName,
      description: itemDescription || null,
      price: itemPrice ? parseFloat(itemPrice) : null,
      category_id: itemCategoryId,
      sort_order: editingItem 
        ? editingItem.sort_order 
        : menuItems.filter(i => i.category_id === itemCategoryId).length,
      allergens: itemAllergens.length > 0 ? itemAllergens : null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("menu_items")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Opgeslagen" });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("menu_items")
        .insert(itemData);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Gerecht toegevoegd" });
        fetchData();
      }
    }
    setItemDialogOpen(false);
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm("Weet u zeker dat u dit gerecht wilt verwijderen?")) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verwijderd" });
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/dashboard/restaurant/${restaurantId}/menus`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <div>
                <span className="text-lg font-bold text-foreground font-serif">
                  {menu?.name}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({restaurant?.name})
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/menu/${restaurant?.slug}/${menuId}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Bekijken
              </Button>
            </Link>
            <Link to={`/dashboard/restaurant/${restaurantId}/menu/${menuId}/qr`}>
              <Button variant="outline" size="sm">
                <QrCode className="mr-2 h-4 w-4" />
                QR-code
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-serif">Categorieën & Gerechten</h1>
          <Button onClick={() => openCategoryDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Categorie toevoegen
          </Button>
        </div>

        {categories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Begin met het toevoegen van een categorie zoals "Voorgerechten" of "Hoofdgerechten"
              </p>
              <Button onClick={() => openCategoryDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Eerste categorie toevoegen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <CardTitle className="text-xl font-serif">{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {hasMultipleLanguages && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openTranslationDialog("category", category.id, category.name, category.description)}
                          title="Vertalingen"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openCategoryDialog(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {menuItems
                      .filter((item) => item.category_id === category.id)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                              {item.allergens && item.allergens.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.allergens.map((allergen) => {
                                    const info = getAllergenInfo(allergen);
                                    return (
                                      <span key={allergen} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                        {info.emoji} {info.label}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {item.price !== null && (
                              <span className="font-semibold text-primary">
                                €{item.price.toFixed(2)}
                              </span>
                            )}
                            {hasMultipleLanguages && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openTranslationDialog("item", item.id, item.name, item.description)}
                                title="Vertalingen"
                              >
                                <Globe className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openItemDialog(category.id, item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => openItemDialog(category.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Gerecht toevoegen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Category Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingCategory ? "Categorie bewerken" : "Nieuwe categorie"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Naam *</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Bijv. Voorgerechten"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription">Beschrijving</Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Optionele beschrijving..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Afbeelding (optioneel)</Label>
                {categoryImageUrl ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img src={categoryImageUrl} alt="Categorie" className="w-full h-full object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setCategoryImageUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploadingCategoryImage ? "Uploaden..." : "Klik om afbeelding te uploaden"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCategoryImageUpload}
                        disabled={uploadingCategoryImage}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={saveCategory}>Opslaan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Dialog */}
        <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingItem ? "Gerecht bewerken" : "Nieuw gerecht"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Naam *</Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Bijv. Caesar Salade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Beschrijving</Label>
                <Textarea
                  id="itemDescription"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Ingrediënten of beschrijving..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemPrice">Prijs (€)</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="12.50 (optioneel)"
                />
              </div>
              <AllergenSelector
                selectedAllergens={itemAllergens}
                onChange={setItemAllergens}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={saveItem}>Opslaan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Translation Dialog */}
        <Dialog open={translationDialogOpen} onOpenChange={setTranslationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">Vertalingen</DialogTitle>
            </DialogHeader>
            {translationTarget && restaurant && (
              <TranslationManager
                entityType={translationTarget.type}
                entityId={translationTarget.id}
                entityName={translationTarget.name}
                fields={translationTarget.fields}
                enabledLanguages={restaurant.enabled_languages}
                onClose={() => setTranslationDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MenuManager;
