import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Upload, QrCode, Menu, Palette, Globe, ShoppingBag, ImageIcon } from "lucide-react";
import { themes, MenuTheme } from "@/lib/menu-themes";
import MenuPreview from "@/components/MenuPreview";
import LanguageSettings from "@/components/LanguageSettings";
import TranslationManager from "@/components/TranslationManager";

const RestaurantForm = () => {
  const { id } = useParams();
  const isEditing = id && id !== "new";
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [introText, setIntroText] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [globalImageUrl, setGlobalImageUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<MenuTheme>("default");
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGlobalImage, setUploadingGlobalImage] = useState(false);
  const [translationDialogOpen, setTranslationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasMultipleLanguages = enabledLanguages.filter(l => l !== "nl").length > 0;

  useEffect(() => {
    if (isEditing) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Fout",
        description: "Restaurant niet gevonden",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else if (data) {
      setName(data.name);
      setSlug(data.slug);
      setIntroText(data.intro_text || "");
      setLogoUrl(data.logo_url);
      setShowLogo(data.show_logo ?? true);
      setGlobalImageUrl(data.global_image_url || null);
      setTheme((data.theme as MenuTheme) || "default");
      setEnabledLanguages(data.enabled_languages || []);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isEditing) {
      setSlug(generateSlug(newName));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("restaurant-assets")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload mislukt",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleGlobalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGlobalImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `global-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("restaurant-assets")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload mislukt",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(filePath);
      setGlobalImageUrl(data.publicUrl);
    }
    setUploadingGlobalImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const restaurantData = {
      name,
      slug,
      intro_text: introText || null,
      logo_url: logoUrl,
      show_logo: showLogo,
      global_image_url: globalImageUrl,
      theme,
      user_id: user.id,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("restaurants")
        .update(restaurantData)
        .eq("id", id);

      if (error) {
        toast({
          title: "Fout",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Opgeslagen",
          description: "Restaurant is bijgewerkt",
        });
      }
    } else {
      const { data, error } = await supabase
        .from("restaurants")
        .insert(restaurantData)
        .select()
        .single();

      if (error) {
        if (error.message.includes("duplicate key")) {
          toast({
            title: "Fout",
            description: "Deze URL is al in gebruik. Kies een andere.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fout",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Aangemaakt",
          description: "Restaurant is aangemaakt",
        });
        navigate(`/dashboard/restaurant/${data.id}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground font-serif">
              {isEditing ? "Restaurant bewerken" : "Nieuw restaurant"}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">
                  {isEditing ? "Restaurant bewerken" : "Nieuw restaurant toevoegen"}
                </CardTitle>
                <CardDescription>
                  Vul de gegevens van uw restaurant in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam restaurant *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Bijv. Restaurant De Gouden Lepel"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL (slug) *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">/menu/</span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="mijn-restaurant"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dit wordt de basis-link naar uw menu's
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="intro">Introductietekst</Label>
                      {isEditing && hasMultipleLanguages && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setTranslationDialogOpen(true)}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Vertalingen
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="intro"
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      placeholder="Welkom bij ons restaurant! Bekijk onze heerlijke gerechten..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-20 h-20 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="max-w-xs"
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Aanbevolen: vierkant, minimaal 200x200px
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="show-logo"
                        checked={showLogo}
                        onCheckedChange={setShowLogo}
                      />
                      <Label htmlFor="show-logo" className="cursor-pointer">
                        Logo tonen op menukaart
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <Label>Menu afbeelding (onderaan)</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      {globalImageUrl ? (
                        <img
                          src={globalImageUrl}
                          alt="Menu afbeelding"
                          className="w-32 h-20 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-32 h-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleGlobalImageUpload}
                          className="max-w-xs"
                          disabled={uploadingGlobalImage}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Wordt onderaan de menukaart getoond
                        </p>
                        {globalImageUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-destructive"
                            onClick={() => setGlobalImageUrl(null)}
                          >
                            Verwijderen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      <Label>Menu template</Label>
                    </div>
                    <RadioGroup value={theme} onValueChange={(value) => setTheme(value as MenuTheme)}>
                      <div className="grid gap-4">
                        {(Object.keys(themes) as MenuTheme[]).map((themeKey) => {
                          const themeConfig = themes[themeKey];
                          return (
                            <div key={themeKey} className="flex items-center space-x-3">
                              <RadioGroupItem value={themeKey} id={themeKey} />
                              <Label htmlFor={themeKey} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-lg ${themeConfig.headerBg} flex items-center justify-center`}>
                                    <span className={`text-xs font-bold ${themeConfig.headerText}`}>Aa</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold">{themeConfig.name}</p>
                                    <p className="text-sm text-muted-foreground">{themeConfig.description}</p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button type="submit" disabled={loading || uploading || uploadingGlobalImage}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Opslaan" : "Restaurant aanmaken"}
                    </Button>
                    {isEditing && (
                      <>
                        <Link to={`/dashboard/restaurant/${id}/menus`}>
                          <Button type="button" variant="outline">
                            <Menu className="mr-2 h-4 w-4" />
                            Menu's beheren
                          </Button>
                        </Link>
                        <Link to={`/dashboard/restaurant/${id}/orders`}>
                          <Button type="button" variant="outline">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Bestellingen
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Language Settings - only show when editing */}
            {isEditing && id && (
              <LanguageSettings
                restaurantId={id}
                enabledLanguages={enabledLanguages}
                onLanguagesChange={setEnabledLanguages}
              />
            )}
          </div>

          {/* Live Preview */}
          <div className="hidden lg:block sticky top-24 h-fit">
            <MenuPreview
              theme={theme}
              restaurantName={name}
              logoUrl={logoUrl}
              showLogo={showLogo}
              introText={introText}
              globalImageUrl={globalImageUrl}
            />
          </div>
        </div>

        {/* Translation Dialog */}
        <Dialog open={translationDialogOpen} onOpenChange={setTranslationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">Vertalingen</DialogTitle>
            </DialogHeader>
            {isEditing && id && (
              <TranslationManager
                entityType="restaurant"
                entityId={id}
                entityName={name}
                fields={[
                  { name: "intro_text", label: "Introductietekst", multiline: true, originalValue: introText },
                ]}
                enabledLanguages={enabledLanguages}
                onClose={() => setTranslationDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RestaurantForm;
