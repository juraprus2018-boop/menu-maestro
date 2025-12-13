import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Truck, Clock, MapPin, Smartphone, CreditCard } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-foodtruck",
  title: "Digitale Menukaart Foodtruck",
  metaTitle: "Digitale Menukaart voor Foodtrucks | QR Menu Mobiel",
  metaDescription: "Digitale menukaart voor foodtrucks en mobiele horecaondernemers. QR-code op uw truck, klanten bestellen snel. Ideaal voor festivals en markten. Probeer gratis.",
  badge: "Voor Foodtrucks",
  heroTitle: "Digitale menukaart voor uw foodtruck",
  heroSubtitle: "Klanten scannen, kiezen en weten direct wat u te bieden heeft. Perfect voor festivals, markten en vaste standplaatsen. Snel, modern en altijd actueel.",
  features: [
    {
      icon: Truck,
      title: "Eén QR-code voor alles",
      description: "Plak de QR-code op uw truck. Klanten scannen en zien direct uw menu."
    },
    {
      icon: Clock,
      title: "Snelle updates",
      description: "Item op? Wijzig het in seconden via uw telefoon. Direct zichtbaar voor klanten."
    },
    {
      icon: MapPin,
      title: "Wisselende locaties",
      description: "Of u nu op een markt staat of festival - dezelfde QR-code werkt overal."
    },
    {
      icon: CreditCard,
      title: "Optioneel: vooraf bestellen",
      description: "Laat klanten vooraf bestellen en betalen. Minder wachttijd in de rij."
    },
    {
      icon: Smartphone,
      title: "Beheer via telefoon",
      description: "Pas uw menu aan vanaf uw smartphone. Ideaal als u onderweg bent."
    },
    {
      icon: QrCode,
      title: "Professionele uitstraling",
      description: "Laat zien dat u modern en professioneel werkt met een digitale kaart."
    }
  ],
  benefitsTitle: "Voordelen voor foodtrucks",
  benefits: [
    "Geen papieren menu's die wegwaaien",
    "Snel items aan- of uitzetten",
    "Werkt op elke locatie",
    "Klanten zien direct prijzen",
    "Minder vragen aan de klep",
    "Professionele uitstraling",
    "Beheer onderweg via telefoon",
    "Ideaal voor festivals"
  ],
  ctaTitle: "Uw foodtruck digitaal?",
  ctaSubtitle: "Start vandaag nog. Eerste 30 dagen gratis, daarna vanaf €9/maand."
};

const MenukaartFoodtruck = () => <LandingPageTemplate config={config} />;

export default MenukaartFoodtruck;
