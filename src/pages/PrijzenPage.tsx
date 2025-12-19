import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PrijzenPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Prijzen"
        description="Bekijk de transparante prijzen van onze digitale menukaart. Gratis starten, upgrade wanneer je wilt."
        canonicalUrl="/prijzen"
      />
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Gratis digitale menukaart</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Prijzen
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start gratis en upgrade wanneer je meer nodig hebt.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="border-primary border-2">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary">Gratis</Badge>
                <CardTitle>Starter</CardTitle>
                <p className="text-muted-foreground">Perfect om te starten</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-foreground">€0</div>
                  <p className="text-muted-foreground">voor altijd</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    1 restaurant
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    1 menukaart
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    1 taal (Nederlands)
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    QR-code downloaden
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Onbeperkt gerechten
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full">
                    Gratis registreren
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Populair
              </Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <p className="text-muted-foreground">Meerdere talen & restaurants</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary">€14,95</div>
                  <p className="text-muted-foreground">/maand</p>
                  <p className="text-sm text-muted-foreground mt-1">of €149/jaar (bespaar €30)</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Onbeperkt restaurants
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Onbeperkt menukaarten
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    4 talen (NL, EN, DE, FR)
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Vertalingen beheren
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full">
                    Gratis registreren
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Bestellen */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Bestellen</CardTitle>
                <p className="text-muted-foreground">Online bestellingen</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary">€29,50</div>
                  <p className="text-muted-foreground">/maand</p>
                  <p className="text-sm text-muted-foreground mt-1">Compleet pakket</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Alles van Pro
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Online bestellingen
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Afhalen & bezorgen
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    iDEAL betalingen
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Bestellingendashboard
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full">
                    Gratis registreren
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-serif mb-4">
              Veelgestelde vragen over prijzen
            </h2>
            <div className="text-left space-y-6 mt-8">
              <div>
                <h3 className="font-semibold mb-2">Is er een proefperiode?</h3>
                <p className="text-muted-foreground">
                  U kunt gratis starten met 1 restaurant en 1 menukaart. Geen creditcard nodig.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kan ik op elk moment opzeggen?</h3>
                <p className="text-muted-foreground">
                  Ja, u kunt uw abonnement op elk moment opzeggen. Er is geen opzegtermijn.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hoe werkt de betaling?</h3>
                <p className="text-muted-foreground">
                  Betalingen verlopen via iDEAL met automatische SEPA-incasso. U ontvangt een factuur per e-mail.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kan ik later upgraden?</h3>
                <p className="text-muted-foreground">
                  Ja, u kunt op elk moment upgraden naar een hoger pakket. U betaalt dan het prijsverschil.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/faq">
                <Button variant="outline">
                  Meer veelgestelde vragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground font-serif mb-4">
            Start vandaag nog gratis
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Gratis digitale menukaart. Upgrade wanneer je wilt.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary">
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

export default PrijzenPage;
