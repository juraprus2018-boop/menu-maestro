import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  QrCode, 
  ArrowRight,
  Check,
  Smartphone,
  Settings,
  ShoppingBag,
  Users,
  ChefHat,
  Truck,
  CreditCard
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button>30 dagen gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Stap voor stap</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Hoe werkt het?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Begin eenvoudig met een digitale menukaart en breid later uit naar online bestellingen. 
            U bepaalt zelf het tempo.
          </p>
        </div>
      </section>

      {/* Step 1: Basic Menu */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif">
                Start met uw digitale menukaart
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-muted-foreground mb-6">
                  In slechts een paar minuten heeft u een professionele digitale menukaart. 
                  Uw gasten scannen de QR-code en bekijken direct het menu op hun telefoon.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Account aanmaken (gratis proefperiode)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Restaurant toevoegen met logo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Menu's en gerechten invoeren</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>QR-code downloaden en plaatsen</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FeatureIcon icon={<QrCode />} label="QR-code" />
                <FeatureIcon icon={<Smartphone />} label="Mobiel menu" />
                <FeatureIcon icon={<Settings />} label="Eenvoudig beheer" />
                <FeatureIcon icon={<ChefHat />} label="Onbeperkt menu's" />
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Basic pakket</h3>
                    <p className="text-muted-foreground text-sm">Alles wat u nodig heeft voor een digitale menukaart</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">€9/maand</div>
                    <p className="text-sm text-muted-foreground">of €95/jaar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Arrow */}
      <div className="flex justify-center py-8">
        <ArrowRight className="h-12 w-12 text-primary rotate-90" />
      </div>

      {/* Step 2: Add Ordering */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif">
                Breid uit met online bestellen
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-muted-foreground mb-6">
                  Wanneer u klaar bent, kunt u eenvoudig upgraden naar het Premium pakket. 
                  Gasten kunnen dan direct bestellen via uw digitale menukaart.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Online bestellingen ontvangen</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Afhalen én bezorgen aanbieden</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>iDEAL & contante betalingen</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Realtime bestellingendashboard</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FeatureIcon icon={<ShoppingBag />} label="Online bestellen" />
                <FeatureIcon icon={<Truck />} label="Bezorgen" />
                <FeatureIcon icon={<Users />} label="Afhalen" />
                <FeatureIcon icon={<CreditCard />} label="iDEAL betalen" />
              </div>
            </div>

            <Card className="border-primary bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <Badge className="mb-2">Meest gekozen</Badge>
                    <h3 className="font-semibold mb-1">Premium pakket</h3>
                    <p className="text-muted-foreground text-sm">Digitale menukaart + online bestellen</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">€29,50/maand</div>
                    <p className="text-sm text-muted-foreground">inclusief Basic functies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">
              U bepaalt het tempo
            </h2>
            <p className="text-muted-foreground mb-8">
              Begin klein met alleen een digitale menukaart. Wanneer u klaar bent om online bestellingen 
              te ontvangen, upgradet u eenvoudig. Geen gedoe, geen verrassingen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg">
                  Start gratis proefperiode
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/prijzen">
                <Button size="lg" variant="outline">
                  Bekijk prijzen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-bold font-serif">Digitale Menukaart</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/algemene-voorwaarden" className="hover:text-foreground">Algemene voorwaarden</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border">
    <div className="text-primary mb-2">{icon}</div>
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

export default HowItWorks;
