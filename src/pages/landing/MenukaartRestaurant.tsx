import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Smartphone, ChefHat, Clock, Leaf, Utensils } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-restaurant",
  title: "Digitale Menukaart Restaurant",
  metaTitle: "Digitale Menukaart voor Restaurants | QR Menu Oplossing",
  metaDescription: "Professionele digitale menukaart voor restaurants. Gasten scannen QR-code en bekijken direct uw menu. Meerdere menu's, allergenen, real-time updates. Start gratis.",
  badge: "Voor Restaurants",
  heroTitle: "Digitale menukaart voor uw restaurant",
  heroSubtitle: "Bied uw gasten een moderne eetervaring. Geen stoffige papieren kaarten meer, maar een altijd actuele digitale menukaart die uw gerechten perfect presenteert.",
  features: [
    {
      icon: QrCode,
      title: "QR-code op elke tafel",
      description: "Gasten scannen de code en bekijken direct uw lunch-, diner- of dessertkaart."
    },
    {
      icon: ChefHat,
      title: "Meerdere menu's",
      description: "Lunchkaart, dinerkaart, seizoensmenu, wijnkaart - allemaal in één systeem."
    },
    {
      icon: Utensils,
      title: "Categorieën & gerechten",
      description: "Organiseer uw menu met voorgerechten, hoofdgerechten, desserts en meer."
    },
    {
      icon: Leaf,
      title: "Allergenen & dieetwensen",
      description: "Gasten kunnen filteren op allergenen. Ideaal voor glutenvrij, lactosevrij, vegetarisch."
    },
    {
      icon: Clock,
      title: "Direct aanpassen",
      description: "Dagschotel uitverkocht? Wijzig het in seconden. Altijd actuele prijzen."
    },
    {
      icon: Smartphone,
      title: "Professionele uitstraling",
      description: "Kies uit meerdere thema's. Upload uw logo en foto's van uw gerechten."
    }
  ],
  benefitsTitle: "Waarom restaurants kiezen voor digitale menukaarten",
  benefits: [
    "Geen drukkosten meer voor menukaarten",
    "Wijzig prijzen en gerechten in real-time",
    "Hygiënischer dan gedeelde papieren menu's",
    "Gasten kunnen allergeenfilters gebruiken",
    "Meerdere talen ondersteunen (Pro)",
    "Professionele uitstraling voor uw restaurant",
    "Makkelijk seizoensgebonden menu's wisselen",
    "Gasten kunnen direct bestellen (optioneel)"
  ],
  ctaTitle: "Uw restaurant digitaal?",
  ctaSubtitle: "Start vandaag nog met uw digitale menukaart. 30 dagen gratis proberen."
};

const MenukaartRestaurant = () => <LandingPageTemplate config={config} />;

export default MenukaartRestaurant;
