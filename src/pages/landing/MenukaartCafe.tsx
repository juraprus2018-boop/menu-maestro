import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Coffee, Beer, Clock, Smartphone, CreditCard } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-cafe",
  title: "Digitale Menukaart Café",
  metaTitle: "Digitale Menukaart voor Cafés | QR Menu voor Horeca",
  metaDescription: "Digitale menukaart speciaal voor cafés en bars. QR-code op de bar of tafel, gasten scannen en bestellen. Drankkaart, snacks, specials. Probeer gratis.",
  badge: "Voor Cafés & Bars",
  heroTitle: "Digitale menukaart voor uw café",
  heroSubtitle: "Van bier tot borrelhapjes - laat uw gasten het complete aanbod bekijken via hun telefoon. Modern, snel en altijd actueel.",
  features: [
    {
      icon: QrCode,
      title: "QR-code op bar & tafels",
      description: "Gasten scannen en zien direct uw drankkaart, bieren, wijnen en hapjes."
    },
    {
      icon: Beer,
      title: "Speciaalbieren & seizoensdrinks",
      description: "Wissel eenvoudig tussen zomer- en winterkaart. Voeg specials toe wanneer u wilt."
    },
    {
      icon: Coffee,
      title: "Van koffie tot cocktails",
      description: "Warme dranken, frisdranken, bieren, wijnen, cocktails - alles overzichtelijk."
    },
    {
      icon: Clock,
      title: "Happy hour deals",
      description: "Pas prijzen direct aan voor happy hour. Geen nieuwe kaarten nodig."
    },
    {
      icon: CreditCard,
      title: "Optioneel: online bestellen",
      description: "Laat gasten direct bestellen en afrekenen via hun telefoon."
    },
    {
      icon: Smartphone,
      title: "Geen app downloaden",
      description: "Gasten scannen de QR-code en het menu opent direct in hun browser."
    }
  ],
  benefitsTitle: "Voordelen voor uw café",
  benefits: [
    "Altijd actuele drankkaart",
    "Eenvoudig specials en acties toevoegen",
    "Geen gedoe met papieren kaarten",
    "Gasten zien direct prijzen",
    "Meerdere talen voor toeristen",
    "Professionele uitstraling",
    "Bespaar op drukkosten",
    "Makkelijk te onderhouden"
  ],
  ctaTitle: "Uw café digitaal?",
  ctaSubtitle: "Start vandaag nog. 30 dagen gratis, daarna vanaf €9/maand."
};

const MenukaartCafe = () => <LandingPageTemplate config={config} />;

export default MenukaartCafe;
