import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, QrCode as QrCodeIcon, Copy, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface MenuType {
  id: string;
  name: string;
}

const QRCode = () => {
  const { id: restaurantId, menuId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [restaurantId, menuId]);

  const fetchData = async () => {
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, name, slug, logo_url")
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
      .select("id, name")
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
    setLoading(false);
  };

  const menuUrl = restaurant && menu ? `${window.location.origin}/menu/${restaurant.slug}/${menu.id}` : "";

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qr-${restaurant?.slug}-${menu?.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(menuUrl);
    toast({
      title: "Gekopieerd",
      description: "Link is gekopieerd naar klembord",
    });
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
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={`/dashboard/restaurant/${restaurantId}/menu/${menuId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground font-serif">
              QR-code: {menu?.name}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">QR-code voor {menu?.name}</CardTitle>
            <CardDescription>
              Download deze QR-code en plaats deze op uw tafels. Gasten kunnen de code scannen om dit menu te bekijken.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div
              ref={qrRef}
              className="bg-card p-8 rounded-xl border border-border mb-6"
            >
              <QRCodeSVG
                value={menuUrl}
                size={256}
                level="H"
                includeMargin={true}
                imageSettings={
                  restaurant?.logo_url
                    ? {
                        src: restaurant.logo_url,
                        x: undefined,
                        y: undefined,
                        height: 48,
                        width: 48,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button onClick={downloadQR} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button onClick={copyUrl} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Kopieer link
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg w-full max-w-md">
              <p className="text-sm text-muted-foreground mb-2">Menu link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-background px-3 py-2 rounded border border-border truncate">
                  {menuUrl}
                </code>
                <Link to={`/menu/${restaurant?.slug}/${menuId}`} target="_blank">
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2 font-medium">Tips voor gebruik:</p>
              <ul className="space-y-1">
                <li>• Print de QR-code op tentkaartjes of stickers</li>
                <li>• Plaats één QR-code per tafel</li>
                <li>• Zorg voor goede verlichting zodat scannen makkelijk is</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QRCode;
