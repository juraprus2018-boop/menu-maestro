import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Smartphone, Settings, ChefHat } from "lucide-react";

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
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button>Gratis starten</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
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
                  Gratis beginnen
                </Button>
              </Link>
              <Link to="/menu/le-troubadour-valkenswaard/752af5cf-43bc-4965-a777-7c680d9169b1">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Bekijk demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-serif">
            Waarom digitaal?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Een digitale menukaart biedt talloze voordelen voor uw restaurant en uw gasten.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Smartphone className="h-10 w-10" />}
              title="Altijd up-to-date"
              description="Pas prijzen en gerechten direct aan. Geen gedateerde papieren menu's meer."
            />
            <FeatureCard
              icon={<QrCode className="h-10 w-10" />}
              title="Eenvoudig scannen"
              description="Gasten scannen de QR-code op tafel en bekijken direct uw menu."
            />
            <FeatureCard
              icon={<Settings className="h-10 w-10" />}
              title="Makkelijk beheren"
              description="Intuïtief dashboard om categorieën en gerechten toe te voegen."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif">
            Hoe werkt het?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StepCard number={1} title="Registreer" description="Maak gratis een account aan" />
            <StepCard number={2} title="Creëer" description="Voeg uw restaurant en menu toe" />
            <StepCard number={3} title="Download" description="Download uw unieke QR-code" />
            <StepCard number={4} title="Plaats" description="Zet de QR-code op tafel" />
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
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Maak vandaag nog uw digitale menukaart aan en verbeter de ervaring van uw gasten.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Gratis account aanmaken
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground font-serif">Digitale Menukaart</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} digitalemenukaart.nl - Alle rechten voorbehouden</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-background rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 font-serif">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-1 font-serif">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Index;
