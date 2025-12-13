import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Globe, Bed, UtensilsCrossed, Clock, Smartphone } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-hotel",
  title: "Digitale Menukaart Hotel",
  metaTitle: "Digitale Menukaart voor Hotels | Roomservice & Restaurant QR Menu",
  metaDescription: "Digitale menukaart voor hotels. Roomservice, restaurant, bar - alles in één QR-code. Meertalig voor internationale gasten. Probeer 30 dagen gratis.",
  badge: "Voor Hotels",
  heroTitle: "Digitale menukaart voor uw hotel",
  heroSubtitle: "Van roomservice tot het hotelrestaurant - bied uw internationale gasten een meertalige digitale menukaart. Professioneel en gastvrij.",
  features: [
    {
      icon: Bed,
      title: "Roomservice menu",
      description: "QR-code op de hotelkamer. Gasten bekijken het roomservice menu en kunnen bestellen."
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurant & bar",
      description: "Ontbijt, lunch, diner en barkaart - allemaal digitaal toegankelijk voor uw gasten."
    },
    {
      icon: Globe,
      title: "Meertalig",
      description: "Nederlands, Engels, Duits, Frans. Internationale gasten voelen zich welkom."
    },
    {
      icon: Clock,
      title: "24/7 beschikbaar",
      description: "Gasten kunnen altijd het menu bekijken, ook midden in de nacht."
    },
    {
      icon: QrCode,
      title: "Verschillende locaties",
      description: "Aparte QR-codes voor restaurant, terras, bar en kamers."
    },
    {
      icon: Smartphone,
      title: "Geen app nodig",
      description: "Werkt direct in de browser. Geen download vereist voor uw gasten."
    }
  ],
  benefitsTitle: "Waarom hotels kiezen voor digitale menukaarten",
  benefits: [
    "Meertalig voor internationale gasten",
    "Roomservice menu op elke kamer",
    "Eén systeem voor restaurant, bar en roomservice",
    "Altijd actuele prijzen en beschikbaarheid",
    "Hygiënischer dan papieren menu's",
    "Professionele uitstraling passend bij uw hotel",
    "Eenvoudig seizoensgebonden menu's wisselen",
    "Bespaar op drukkosten en vertalingen"
  ],
  ctaTitle: "Uw hotel digitaal uitrusten?",
  ctaSubtitle: "Probeer 30 dagen gratis. Ideaal voor hotels die service willen verbeteren."
};

const MenukaartHotel = () => <LandingPageTemplate config={config} />;

export default MenukaartHotel;
