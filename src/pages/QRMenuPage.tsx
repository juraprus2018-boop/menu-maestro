import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  QrCode, 
  Smartphone, 
  Settings, 
  Check, 
  ArrowRight,
  Leaf,
  Clock,
  ChefHat,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const QRMenuPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              QR Menu Oplossing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              Digitale menukaart met QR-code
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Gasten scannen de QR-code en bekijken direct uw menu op hun telefoon. 
              Geen app nodig, geen gedoe. Simpel en professioneel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start gratis proefperiode
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/menu/le-troubadour-valkenswaard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Bekijk demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Wat krijgt u met QR Menu?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alles wat u nodig heeft voor een professionele digitale menukaart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<QrCode className="h-8 w-8" />}
              title="Unieke QR-code"
              description="Download uw QR-code en plaats deze op uw tafels. Gasten scannen en zien direct uw menu."
            />
            <FeatureCard
              icon={<Smartphone className="h-8 w-8" />}
              title="Responsive design"
              description="Uw menu ziet er perfect uit op elk apparaat - telefoon, tablet of computer."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Eenvoudig beheer"
              description="Voeg menu's, categorieën en gerechten toe via een intuïtief dashboard."
            />
            <FeatureCard
              icon={<ChefHat className="h-8 w-8" />}
              title="Meerdere menu's"
              description="Maak verschillende menu's aan: Lunch, Diner, Drankkaart en meer."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Direct aanpassen"
              description="Prijzen of gerechten wijzigen? Pas het aan en het is direct zichtbaar."
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="Allergenen"
              description="Voeg allergenen toe aan gerechten. Gasten kunnen filteren op dieetwensen."
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-serif mb-4">
              Simpele prijzen
            </h2>
            <Card className="border-primary">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">€9/maand</div>
                <p className="text-muted-foreground mb-6">of €95/jaar (bespaar €13)</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Onbeperkt menu's aanmaken
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    QR-code downloaden
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Allergenen beheer
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Eigen logo en thema
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full" size="lg">
                    30 dagen gratis proberen
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-4">
              Meer nodig? Bekijk onze <Link to="/oplossingen/qr-menu-bestellen" className="text-primary hover:underline">QR Menu + Bestellen</Link> oplossing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif mb-4">
            Klaar om te starten?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Probeer 30 dagen gratis. Geen creditcard nodig.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary">
              Start gratis proefperiode
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="text-center">
    <CardContent className="p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);

export default QRMenuPage;
