import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save, Lock } from "lucide-react";
import { OpeningHoursEditor, OpeningHours, defaultOpeningHours } from "@/components/OpeningHoursEditor";
import { Json } from "@/integrations/supabase/types";
import { hasOrderingSubscription } from "@/lib/subscription-tiers";

interface OrderingSettings {
  id?: string;
  restaurant_id: string;
  is_ordering_enabled: boolean;
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  minimum_order_amount: number;
  delivery_fee: number;
  estimated_pickup_time: number;
  estimated_delivery_time: number;
  accepts_cash: boolean;
  accepts_card: boolean;
  accepts_ideal: boolean;
  opening_hours: OpeningHours;
}

const OrderingSettings = () => {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasOrdering, setHasOrdering] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [settings, setSettings] = useState<OrderingSettings>({
    restaurant_id: restaurantId || "",
    is_ordering_enabled: false,
    accepts_pickup: true,
    accepts_delivery: false,
    minimum_order_amount: 0,
    delivery_fee: 0,
    estimated_pickup_time: 20,
    estimated_delivery_time: 45,
    accepts_cash: true,
    accepts_card: true,
    accepts_ideal: true,
    opening_hours: defaultOpeningHours,
  });

  useEffect(() => {
    checkSubscription();
  }, []);

  useEffect(() => {
    if (restaurantId && hasOrdering) {
      fetchSettings();
    }
  }, [restaurantId, hasOrdering]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      
      const productIds = data?.product_ids || [];
      setHasOrdering(hasOrderingSubscription(productIds));
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasOrdering(false);
    } finally {
      setCheckingSubscription(false);
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurant_ordering_settings")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          ...data,
          opening_hours: (data.opening_hours as unknown as OpeningHours) || defaultOpeningHours,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...settings,
        opening_hours: settings.opening_hours as unknown as Json,
      };

      if (settings.id) {
        const { error } = await supabase
          .from("restaurant_ordering_settings")
          .update(dataToSave)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("restaurant_ordering_settings")
          .insert(dataToSave);
        if (error) throw error;
      }

      toast({
        title: "Instellingen opgeslagen",
        description: "Je bestelinstellingen zijn bijgewerkt.",
      });
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || checkingSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasOrdering) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/restaurant/${restaurantId}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-serif text-primary">Bestelinstellingen</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Bestellen abonnement vereist</CardTitle>
              <CardDescription>
                Om online bestellingen te ontvangen heeft u het Bestellen abonnement nodig (€29,50/maand).
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate("/prijzen")}>
                Bekijk abonnementen
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/restaurant/${restaurantId}/orders`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-serif text-primary">Bestelinstellingen</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Opslaan
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Algemeen</CardTitle>
            <CardDescription>Schakel online bestellen in of uit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="ordering-enabled">Online bestellen inschakelen</Label>
              <Switch
                id="ordering-enabled"
                checked={settings.is_ordering_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, is_ordering_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Openingstijden</CardTitle>
            <CardDescription>Bestellingen worden alleen geaccepteerd tijdens openingstijden</CardDescription>
          </CardHeader>
          <CardContent>
            <OpeningHoursEditor
              value={settings.opening_hours}
              onChange={(opening_hours) => setSettings({ ...settings, opening_hours })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Besteltypen</CardTitle>
            <CardDescription>Kies welke besteltypen je accepteert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts-pickup">Afhalen</Label>
              <Switch
                id="accepts-pickup"
                checked={settings.accepts_pickup}
                onCheckedChange={(checked) => setSettings({ ...settings, accepts_pickup: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts-delivery">Bezorgen</Label>
              <Switch
                id="accepts-delivery"
                checked={settings.accepts_delivery}
                onCheckedChange={(checked) => setSettings({ ...settings, accepts_delivery: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tijden</CardTitle>
            <CardDescription>Stel de geschatte bereidingstijden in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pickup-time">Afhalen - geschatte tijd (minuten)</Label>
              <Input
                id="pickup-time"
                type="number"
                value={settings.estimated_pickup_time}
                onChange={(e) => setSettings({ ...settings, estimated_pickup_time: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery-time">Bezorgen - geschatte tijd (minuten)</Label>
              <Input
                id="delivery-time"
                type="number"
                value={settings.estimated_delivery_time}
                onChange={(e) => setSettings({ ...settings, estimated_delivery_time: parseInt(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bezorging</CardTitle>
            <CardDescription>Instellingen voor bezorgbestellingen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="min-order">Minimaal bestelbedrag (€)</Label>
              <Input
                id="min-order"
                type="number"
                step="0.01"
                value={settings.minimum_order_amount}
                onChange={(e) => setSettings({ ...settings, minimum_order_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery-fee">Bezorgkosten (€)</Label>
              <Input
                id="delivery-fee"
                type="number"
                step="0.01"
                value={settings.delivery_fee}
                onChange={(e) => setSettings({ ...settings, delivery_fee: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Betaalmethoden</CardTitle>
            <CardDescription>Selecteer welke betaalmethoden je accepteert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts-cash">Contant</Label>
              <Switch
                id="accepts-cash"
                checked={settings.accepts_cash}
                onCheckedChange={(checked) => setSettings({ ...settings, accepts_cash: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts-card">Pin/Creditcard</Label>
              <Switch
                id="accepts-card"
                checked={settings.accepts_card}
                onCheckedChange={(checked) => setSettings({ ...settings, accepts_card: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts-ideal">iDEAL</Label>
              <Switch
                id="accepts-ideal"
                checked={settings.accepts_ideal}
                onCheckedChange={(checked) => setSettings({ ...settings, accepts_ideal: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderingSettings;
