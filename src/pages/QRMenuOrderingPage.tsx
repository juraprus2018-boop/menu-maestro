import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ShoppingBag,
  Truck,
  CreditCard,
  Bell,
  Clock,
  Check, 
  ArrowRight,
  Settings
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const QRMenuOrderingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Complete Besteloplossing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              QR Menu + Online Bestellen
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Combineer uw digitale menukaart met een compleet bestelsysteem. 
              Ontvang bestellingen voor afhalen en bezorgen, direct in uw dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start gratis proefperiode
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/hoe-werkt-het">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Hoe werkt het?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Alles wat u nodig heeft
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Een compleet bestelsysteem gecombineerd met uw digitale menukaart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<ShoppingBag className="h-8 w-8" />}
              title="Online bestellen"
              description="Gasten bestellen direct via de digitale menukaart. Geen externe app nodig."
            />
            <FeatureCard
              icon={<Truck className="h-8 w-8" />}
              title="Afhalen & bezorgen"
              description="Bied zowel afhalen als bezorgen aan. U bepaalt de opties."
            />
            <FeatureCard
              icon={<CreditCard className="h-8 w-8" />}
              title="iDEAL & contant"
              description="Accepteer iDEAL betalingen online of contant bij afhalen/bezorgen."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Realtime meldingen"
              description="Ontvang direct een melding bij nieuwe bestellingen in uw dashboard."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Openingstijden"
              description="Stel openingstijden in. Bestellingen alleen mogelijk wanneer u open bent."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Instellingen"
              description="Bezorgkosten, minimale bestellingen, bereidingstijden - u bepaalt alles."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif mb-4">
              Zo werkt het bestelproces
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StepCard number={1} title="Scannen" description="Gast scant QR-code of bezoekt uw menu" />
            <StepCard number={2} title="Bestellen" description="Kiest gerechten en vult gegevens in" />
            <StepCard number={3} title="Betalen" description="Betaalt met iDEAL of kiest contant" />
            <StepCard number={4} title="Ontvangen" description="U ontvangt de bestelling in uw dashboard" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-serif mb-4">
              Premium Besteloplossing
            </h2>
            <Card className="border-primary">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">€29,50/maand</div>
                <p className="text-muted-foreground mb-6">Inclusief alle QR Menu functies</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Alles van QR Menu Basic
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Online bestellingen ontvangen
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    iDEAL betalingen
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Afhalen & bezorgen
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Realtime bestellingendashboard
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    E-mail notificaties
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
              Alleen menu nodig? Bekijk ons <Link to="/oplossingen/qr-menu" className="text-primary hover:underline">QR Menu</Link> pakket vanaf €9/maand.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif mb-4">
            Begin vandaag nog met online bestellingen
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            30 dagen gratis proberen. Geen creditcard nodig. Annuleer wanneer u wilt.
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

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default QRMenuOrderingPage;
