import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  QrCode, 
  Smartphone, 
  Settings, 
  ChefHat, 
  Check, 
  Clock, 
  Euro, 
  Leaf, 
  Users, 
  Zap,
  ArrowRight,
  Star,
  ExternalLink,
  MonitorSmartphone,
  ShoppingBag,
  Truck
} from "lucide-react";
import qrTableMockup from "@/assets/qr-table-mockup.png";
import screenshotDashboard from "@/assets/screenshot-dashboard.png";
import screenshotMenu from "@/assets/screenshot-menu.png";
import screenshotQrcode from "@/assets/screenshot-qrcode.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#hoe-werkt-het" className="text-muted-foreground hover:text-foreground transition-colors">
              Hoe werkt het?
            </a>
            <a href="#voordelen" className="text-muted-foreground hover:text-foreground transition-colors">
              Voordelen
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
          </div>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Zap className="h-3 w-3 mr-1" />
              30 dagen gratis uitproberen
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
              Uw menukaart,{" "}
              <span className="text-primary">digitaal</span> op tafel
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Creëer in enkele minuten een professionele digitale menukaart voor uw restaurant. 
              Gasten scannen de QR-code en bekijken direct uw menu op hun telefoon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  30 dagen gratis proberen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/menu/le-troubadour-valkenswaard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Bekijk live demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Geen creditcard nodig
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Direct online
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Onbeperkt menu's
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Banner */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-primary-foreground text-center">
            <Zap className="h-8 w-8" />
            <p className="text-xl md:text-2xl font-bold font-serif">
              30 dagen gratis uitproberen! Daarna vanaf €9/maand.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="hoe-werkt-het" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Simpel & Snel</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Hoe werkt het?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In slechts 4 eenvoudige stappen heeft u uw eigen digitale menukaart
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
            <StepCard 
              number={1} 
              title="Registreer" 
              description="Maak een account aan in minder dan een minuut"
            />
            <StepCard 
              number={2} 
              title="Creëer" 
              description="Voeg uw restaurant, menu's en gerechten toe" 
            />
            <StepCard 
              number={3} 
              title="Download" 
              description="Download uw unieke QR-code" 
            />
            <StepCard 
              number={4} 
              title="Plaats" 
              description="Zet de QR-code op tafel en klaar!" 
            />
          </div>

          {/* Dashboard Preview */}
          <div className="bg-muted/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center font-serif">
              Wat u kunt doen in het dashboard
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <DashboardFeature 
                icon={<Settings className="h-6 w-6" />}
                title="Restaurants beheren"
                description="Voeg uw restaurant toe met logo en welkomsttekst"
              />
              <DashboardFeature 
                icon={<QrCode className="h-6 w-6" />}
                title="Meerdere menu's"
                description="Maak verschillende menu's aan: Lunch, Diner, Drankkaart"
              />
              <DashboardFeature 
                icon={<ChefHat className="h-6 w-6" />}
                title="Gerechten toevoegen"
                description="Voeg categorieën en gerechten toe met beschrijving en prijs"
              />
              <DashboardFeature 
                icon={<MonitorSmartphone className="h-6 w-6" />}
                title="QR-code downloaden"
                description="Download uw QR-code en bekijk een preview van uw menu"
              />
            </div>
            <div className="mt-8 text-center">
              <Link to="/auth?mode=signup">
                <Button>
                  30 dagen gratis proberen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Bekijk het dashboard</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Zo ziet het eruit
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Een kijkje in het dashboard waar u alles beheert
            </p>
          </div>

          {/* Screenshot 1: Dashboard */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-4">Overzichtelijk dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Beheer al uw restaurants vanuit één overzichtelijk dashboard. 
                  Voeg nieuwe restaurants toe, bewerk bestaande en bekijk statistieken.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Meerdere restaurants beheren
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Eigen logo uploaden
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Welkomsttekst instellen
                  </li>
                </ul>
              </div>
              <div>
                <img 
                  src={screenshotDashboard} 
                  alt="Dashboard overzicht" 
                  className="rounded-xl shadow-lg border border-border w-full"
                />
              </div>
            </div>
          </div>

          {/* Screenshot 2: Menu beheer */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={screenshotMenu} 
                  alt="Menu beheer" 
                  className="rounded-xl shadow-lg border border-border w-full"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-bold font-serif mb-4">Menu's en gerechten beheren</h3>
                <p className="text-muted-foreground mb-4">
                  Maak eenvoudig meerdere menu's aan zoals Lunch, Diner of Drankkaart. 
                  Voeg categorieën en gerechten toe met beschrijving en prijs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Onbeperkt menu's aanmaken
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Categorieën organiseren
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Prijzen zijn optioneel
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Screenshot 3: QR Code */}
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-4">QR-code downloaden</h3>
                <p className="text-muted-foreground mb-4">
                  Download uw unieke QR-code en plaats deze op uw tafels. 
                  Gasten scannen de code en bekijken direct uw digitale menu.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Hoge kwaliteit PNG download
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Logo in QR-code mogelijk
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Direct delen via link
                  </li>
                </ul>
              </div>
              <div>
                <img 
                  src={screenshotQrcode} 
                  alt="QR code generator" 
                  className="rounded-xl shadow-lg border border-border w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="voordelen" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Voordelen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Waarom kiezen voor een digitale menukaart?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ontdek de vele voordelen voor uw restaurant en uw gasten
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Smartphone className="h-8 w-8" />}
              title="Altijd up-to-date"
              description="Pas prijzen en gerechten direct aan. Geen gedateerde papieren menu's meer. Wijzigingen zijn direct zichtbaar."
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8" />}
              title="Eenvoudig scannen"
              description="Gasten scannen de QR-code op tafel en bekijken direct uw menu op hun eigen telefoon."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Makkelijk beheren"
              description="Intuïtief dashboard om meerdere menu's, categorieën en gerechten toe te voegen en te beheren."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Tijdbesparend"
              description="Geen drukkosten meer, geen wachten op de drukker. Direct aanpassingen doorvoeren."
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="Duurzaam"
              description="Geen papieren menu's meer. Beter voor het milieu en bespaar op drukkosten."
            />
            <FeatureCard
              icon={<Euro className="h-8 w-8" />}
              title="Betaalbaar"
              description="30 dagen gratis uitproberen. Daarna vanaf €9/maand of €95/jaar. Geen verborgen kosten."
            />
            <FeatureCard
              icon={<ShoppingBag className="h-8 w-8" />}
              title="Online bestellen"
              description="Laat gasten direct bestellen via de digitale menukaart. Ontvang bestellingen in uw dashboard."
            />
            <FeatureCard
              icon={<Truck className="h-8 w-8" />}
              title="Take away & bezorgen"
              description="Bied afhalen en bezorgen aan. Stel bezorgkosten, minimale bestelbedragen en bereidingstijden in."
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Badge className="mb-4">Live Demo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
                Bekijk hoe het eruitziet
              </h2>
              <p className="text-muted-foreground mb-6">
                Probeer onze live demo en ontdek hoe eenvoudig het is. Bekijk de digitale menukaart 
                precies zoals uw gasten dat zouden doen na het scannen van de QR-code.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Meerdere menu's (Lunch, Diner, Drankkaart)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Categorieën met gerechten en prijzen</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Responsive design voor alle telefoons</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Snel laden, geen app nodig</span>
                </li>
              </ul>
              <Link to="/menu/le-troubadour-valkenswaard">
                <Button size="lg">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Bekijk de live demo
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src={qrTableMockup} 
                alt="QR code op restauranttafel" 
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-serif text-foreground mb-6">
              "Eindelijk een eenvoudige oplossing voor onze menukaart. In 10 minuten hadden we 
              alles online staan. De proefperiode van 30 dagen was perfect om alles uit te proberen!"
            </blockquote>
            <p className="text-muted-foreground">
              — Restaurant eigenaar
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Prijzen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              30 dagen gratis uitproberen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start vandaag nog met uw digitale menukaart. Geen creditcard nodig voor de proefperiode.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold font-serif mb-2">Maandelijks</h3>
                <p className="text-5xl font-bold text-primary mb-2">€9</p>
                <p className="text-muted-foreground mb-6">per maand</p>
                <ul className="space-y-3 text-left mb-8">
                  {[
                    "Onbeperkt restaurants",
                    "Onbeperkt menu's",
                    "Onbeperkt gerechten",
                    "QR-codes downloaden",
                    "Eigen logo toevoegen",
                    "Direct wijzigingen doorvoeren"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup" className="block">
                  <Button size="lg" variant="outline" className="w-full">
                    30 dagen gratis proberen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary border-2">
              <CardContent className="p-8 text-center">
                <Badge className="mb-4 bg-primary text-primary-foreground">Bespaar 12%</Badge>
                <h3 className="text-2xl font-bold font-serif mb-2">Jaarlijks</h3>
                <p className="text-5xl font-bold text-primary mb-2">€95</p>
                <p className="text-muted-foreground mb-6">per jaar</p>
                <ul className="space-y-3 text-left mb-8">
                  {[
                    "Onbeperkt restaurants",
                    "Onbeperkt menu's",
                    "Onbeperkt gerechten",
                    "QR-codes downloaden",
                    "Eigen logo toevoegen",
                    "Direct wijzigingen doorvoeren"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup" className="block">
                  <Button size="lg" className="w-full">
                    30 dagen gratis proberen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <ChefHat className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-serif">
            Klaar om te beginnen?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
            Maak vandaag nog uw digitale menukaart aan. 30 dagen gratis uitproberen, binnen 5 minuten live!
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              30 dagen gratis proberen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground font-serif">Digitale Menukaart</span>
              </div>
              <p className="text-sm text-muted-foreground">
                De eenvoudigste manier om uw menu digitaal aan te bieden aan uw gasten.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#hoe-werkt-het" className="hover:text-foreground transition-colors">
                    Hoe werkt het?
                  </a>
                </li>
                <li>
                  <a href="#voordelen" className="hover:text-foreground transition-colors">
                    Voordelen
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auth" className="hover:text-foreground transition-colors">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=signup" className="hover:text-foreground transition-colors">
                    Registreren
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p className="text-sm">© {new Date().getFullYear()} digitalemenukaart.nl - Alle rechten voorbehouden</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="bg-background hover:border-primary/50 transition-colors">
    <CardContent className="p-6">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 font-serif">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-2 font-serif">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const DashboardFeature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex gap-4 p-4 bg-background rounded-lg border border-border">
    <div className="text-primary flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;