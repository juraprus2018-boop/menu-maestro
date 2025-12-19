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
  Zap,
  ArrowRight,
  Star,
  ExternalLink,
  MonitorSmartphone,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Coffee,
  Building2,
  Umbrella,
  Pizza,
  PartyPopper,
  Sandwich
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { OrganizationSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import qrTableMockup from "@/assets/qr-table-mockup.png";
import screenshotDashboard from "@/assets/screenshot-dashboard.png";
import screenshotMenu from "@/assets/screenshot-menu.png";
import screenshotQrcode from "@/assets/screenshot-qrcode.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Digitale Menukaart | Creëer uw QR-code menu"
        description="Maak eenvoudig een gratis digitale menukaart voor uw restaurant met QR-code. Gasten scannen en bekijken direct uw menu op hun telefoon."
        canonicalUrl="/"
      />
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Zap className="h-3 w-3 mr-1" />
              Gratis digitale menukaart
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
                  Gratis registreren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/menu/demo">
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
                1 restaurant gratis
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Banner */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-primary-foreground text-center">
            <Zap className="h-8 w-8" />
            <p className="text-xl md:text-2xl font-bold font-serif">
              Gratis digitale menukaart – voor altijd! Upgrade voor meer features.
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
                  Gratis registreren
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
                  alt="Dashboard overzicht voor digitale menukaart beheer - restaurants beheren met logo en welkomsttekst" 
                  className="rounded-xl shadow-lg border border-border w-full"
                  loading="lazy"
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
                  alt="Menu beheer interface - categorieën en gerechten toevoegen aan digitale menukaart" 
                  className="rounded-xl shadow-lg border border-border w-full"
                  loading="lazy"
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
                  alt="QR code generator voor restaurant menukaart - download en print uw unieke QR-code" 
                  className="rounded-xl shadow-lg border border-border w-full"
                  loading="lazy"
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
              title="Gratis starten"
              description="Gratis digitale menukaart voor 1 restaurant. Upgrade naar Pro voor meer talen en restaurants."
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

      {/* Voor Wie Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Voor wie</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Perfect voor elk horecabedrijf
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Onze digitale menukaart is geschikt voor diverse horecaondernemingen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <TargetCard
              icon={<UtensilsCrossed className="h-8 w-8" />}
              title="Restaurants"
              description="Van bistro tot fine dining"
              href="/digitale-menukaart-restaurant"
            />
            <TargetCard
              icon={<Coffee className="h-8 w-8" />}
              title="Cafés"
              description="Koffiezaken en eetcafés"
              href="/digitale-menukaart-cafe"
            />
            <TargetCard
              icon={<Building2 className="h-8 w-8" />}
              title="Hotels"
              description="Roomservice en restaurants"
              href="/digitale-menukaart-hotel"
            />
            <TargetCard
              icon={<Umbrella className="h-8 w-8" />}
              title="Strandpaviljoens"
              description="Beachclubs en paviljoens"
              href="/digitale-menukaart-strandpaviljoen"
            />
            <TargetCard
              icon={<Truck className="h-8 w-8" />}
              title="Foodtrucks"
              description="Mobiele eetgelegenheden"
              href="/digitale-menukaart-foodtruck"
            />
            <TargetCard
              icon={<PartyPopper className="h-8 w-8" />}
              title="Evenementen"
              description="Festivals en catering"
              href="/digitale-menukaart-evenement"
            />
            <TargetCard
              icon={<Pizza className="h-8 w-8" />}
              title="Frituren"
              description="Snackbars en cafetaria's"
              href="/digitale-menukaart-frituur"
            />
            <TargetCard
              icon={<Sandwich className="h-8 w-8" />}
              title="Lunchrooms"
              description="Broodjes en lunchgerechten"
              href="/digitale-menukaart-lunchroom"
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
                alt="QR code standaard op restauranttafel - gasten scannen voor digitale menukaart" 
                className="rounded-2xl shadow-xl"
                loading="lazy"
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
              alles online staan. Het gratis plan was perfect om te starten!"
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
              Gratis digitale menukaart
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start vandaag nog gratis. Upgrade wanneer je meer nodig hebt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-primary border-2">
              <CardContent className="p-8 text-center">
                <Badge className="mb-4 bg-primary text-primary-foreground">Gratis</Badge>
                <h3 className="text-2xl font-bold font-serif mb-2">Starter</h3>
                <p className="text-5xl font-bold text-primary mb-2">€0</p>
                <p className="text-muted-foreground mb-6">voor altijd</p>
                <ul className="space-y-3 text-left mb-8">
                  {[
                    "1 restaurant",
                    "1 menukaart",
                    "1 taal (Nederlands)",
                    "QR-code downloaden",
                    "Onbeperkt gerechten"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup" className="block">
                  <Button size="lg" className="w-full">
                    Gratis registreren
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold font-serif mb-2">Pro</h3>
                <p className="text-5xl font-bold text-primary mb-2">€14,95</p>
                <p className="text-muted-foreground mb-6">per maand</p>
                <ul className="space-y-3 text-left mb-8">
                  {[
                    "Onbeperkt restaurants",
                    "Onbeperkt menukaarten",
                    "4 talen (NL, EN, DE, FR)",
                    "Vertalingen beheren",
                    "Afbeeldingen uploaden"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" className="block">
                  <Button size="lg" variant="outline" className="w-full">
                    Bekijk Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ordering Plan */}
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold font-serif mb-2">Bestellen</h3>
                <p className="text-5xl font-bold text-primary mb-2">€29,50</p>
                <p className="text-muted-foreground mb-6">per maand</p>
                <ul className="space-y-3 text-left mb-8">
                  {[
                    "Alles van Pro",
                    "Online bestellingen",
                    "Afhalen & bezorgen",
                    "iDEAL betalingen",
                    "Bestellingendashboard"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" className="block">
                  <Button size="lg" variant="outline" className="w-full">
                    Bekijk Bestellen
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
            Maak vandaag nog uw gratis digitale menukaart aan. Binnen 5 minuten live!
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Gratis registreren
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

const TargetCard = ({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) => (
  <Link to={href}>
    <Card className="bg-background hover:border-primary/50 hover:shadow-lg transition-all h-full cursor-pointer group">
      <CardContent className="p-6 text-center">
        <div className="text-primary mb-4 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-lg font-semibold mb-1 font-serif">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default Index;
