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
  ExternalLink,
  LucideIcon
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, WebPageSchema } from "@/components/StructuredData";

export interface LandingPageConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  badge: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  benefitsTitle?: string;
  benefits?: string[];
  ctaTitle?: string;
  ctaSubtitle?: string;
}

interface LandingPageTemplateProps {
  config: LandingPageConfig;
}

const LandingPageTemplate = ({ config }: LandingPageTemplateProps) => {
  const defaultFeatures = [
    {
      icon: QrCode,
      title: "Unieke QR-code",
      description: "Download uw QR-code en plaats deze op uw tafels. Gasten scannen en zien direct uw menu."
    },
    {
      icon: Smartphone,
      title: "Responsive design",
      description: "Uw menu ziet er perfect uit op elk apparaat - telefoon, tablet of computer."
    },
    {
      icon: Settings,
      title: "Eenvoudig beheer",
      description: "Voeg menu's, categorieën en gerechten toe via een intuïtief dashboard."
    },
    {
      icon: ChefHat,
      title: "Meerdere menu's",
      description: "Maak verschillende menu's aan: Lunch, Diner, Drankkaart en meer."
    },
    {
      icon: Clock,
      title: "Direct aanpassen",
      description: "Prijzen of gerechten wijzigen? Pas het aan en het is direct zichtbaar."
    },
    {
      icon: Leaf,
      title: "Allergenen",
      description: "Voeg allergenen toe aan gerechten. Gasten kunnen filteren op dieetwensen."
    }
  ];

  const features = config.features.length > 0 ? config.features : defaultFeatures;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={config.metaTitle}
        description={config.metaDescription}
        canonicalUrl={`/${config.slug}`}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: config.title, url: `/${config.slug}` }
      ]} />
      <WebPageSchema 
        title={config.metaTitle}
        description={config.metaDescription}
        url={`/${config.slug}`}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {config.badge}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              {config.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {config.heroSubtitle}
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
              Wat krijgt u met onze digitale menukaart?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alles wat u nodig heeft voor een professionele digitale menukaart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      {config.benefits && config.benefits.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold font-serif mb-8 text-center">
                {config.benefitsTitle || "Waarom kiezen voor onze oplossing?"}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {config.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Preview */}
      <section className="py-20">
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
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    30 dagen gratis proberen
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full" size="lg">
                    Start gratis proefperiode
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-4">
              Bekijk alle mogelijkheden op onze{" "}
              <Link to="/prijzen" className="text-primary hover:underline">
                prijzenpagina
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif mb-4">
            {config.ctaTitle || "Klaar om te starten?"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {config.ctaSubtitle || "Probeer 30 dagen gratis. Geen creditcard nodig."}
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

export default LandingPageTemplate;
