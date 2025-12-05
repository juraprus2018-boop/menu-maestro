import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit2, Trash2, QrCode, Settings, Eye, Menu } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

interface MenuType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

const MenuList = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Menu form
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuType | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    setLoading(true);

    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, name, slug")
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

    const { data: menusData } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order");

    setMenus(menusData || []);
    setLoading(false);
  };

  const openMenuDialog = (menu?: MenuType) => {
    if (menu) {
      setEditingMenu(menu);
      setMenuName(menu.name);
      setMenuDescription(menu.description || "");
    } else {
      setEditingMenu(null);
      setMenuName("");
      setMenuDescription("");
    }
    setMenuDialogOpen(true);
  };

  const saveMenu = async () => {
    if (!menuName.trim()) return;

    const menuData = {
      name: menuName,
      description: menuDescription || null,
      restaurant_id: restaurantId,
      sort_order: editingMenu ? editingMenu.sort_order : menus.length,
    };

    if (editingMenu) {
      const { error } = await supabase
        .from("menus")
        .update(menuData)
        .eq("id", editingMenu.id);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Opgeslagen" });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("menus")
        .insert(menuData);

      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Menu toegevoegd" });
        fetchData();
      }
    }
    setMenuDialogOpen(false);
  };

  const deleteMenu = async (menuId: string) => {
    if (!confirm("Weet u zeker dat u dit menu wilt verwijderen? Alle categorieën en gerechten worden ook verwijderd.")) return;

    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", menuId);

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
            <Link to={`/dashboard/restaurant/${restaurantId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground font-serif">
                Menu's: {restaurant?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif">Menu's beheren</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Maak verschillende menu's aan, zoals Lunch, Diner of Drankkaart
            </p>
          </div>
          <Button onClick={() => openMenuDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Menu toevoegen
          </Button>
        </div>

        {menus.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Menu className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nog geen menu's</h2>
              <p className="text-muted-foreground mb-6">
                Maak uw eerste menu aan, bijvoorbeeld "Lunchkaart" of "Dinerkaart"
              </p>
              <Button onClick={() => openMenuDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Eerste menu toevoegen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {menus.map((menu) => (
              <Card key={menu.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif">{menu.name}</CardTitle>
                      {menu.description && (
                        <CardDescription className="mt-1">{menu.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openMenuDialog(menu)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMenu(menu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/restaurant/${restaurantId}/menu/${menu.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Gerechten beheren
                      </Button>
                    </Link>
                    <Link to={`/dashboard/restaurant/${restaurantId}/menu/${menu.id}/qr`}>
                      <Button variant="outline" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/menu/${restaurant?.slug}/${menu.id}`} target="_blank">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Menu Dialog */}
        <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingMenu ? "Menu bewerken" : "Nieuw menu"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="menuName">Naam *</Label>
                <Input
                  id="menuName"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Bijv. Lunchkaart, Dinerkaart, Drankkaart"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menuDescription">Beschrijving</Label>
                <Textarea
                  id="menuDescription"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="Optionele beschrijving..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMenuDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={saveMenu}>Opslaan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MenuList;
