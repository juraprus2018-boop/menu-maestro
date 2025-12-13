import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Coffee, Sandwich, Clock, Leaf, Smartphone } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-lunchroom",
  title: "Digitale Menukaart Lunchroom",
  metaTitle: "Digitale Menukaart voor Lunchrooms | QR Menu voor Broodjes & Koffie",
  metaDescription: "Digitale menukaart voor lunchrooms en broodjeszaken. Broodjes, salades, koffie - alles overzichtelijk via QR-code. Allergenen duidelijk aangegeven. Probeer gratis.",
  badge: "Voor Lunchrooms",
  heroTitle: "Digitale menukaart voor uw lunchroom",
  heroSubtitle: "Van broodjes tot salades, van koffie tot verse sappen - presenteer uw hele aanbod via één handige QR-code. Inclusief allergeneninformatie voor bewuste gasten.",
  features: [
    {
      icon: Sandwich,
      title: "Broodjes & salades",
      description: "Organiseer uw menu met warme broodjes, koude broodjes, salades en meer."
    },
    {
      icon: Coffee,
      title: "Drankenkaart",
      description: "Koffie, thee, verse sappen, smoothies - alles overzichtelijk gepresenteerd."
    },
    {
      icon: Leaf,
      title: "Allergenen & diëten",
      description: "Gasten filteren op glutenvrij, lactosevrij, vegetarisch of veganistisch."
    },
    {
      icon: Clock,
      title: "Dagschotel toevoegen",
      description: "Voeg eenvoudig een dagschotel of weekspecial toe. Direct zichtbaar."
    },
    {
      icon: QrCode,
      title: "QR-code op tafel",
      description: "Gasten scannen en bekijken rustig het menu voordat ze bestellen."
    },
    {
      icon: Smartphone,
      title: "Makkelijk beheer",
      description: "Pas prijzen en items aan vanaf uw telefoon. Ideaal tijdens de lunch rush."
    }
  ],
  benefitsTitle: "Voordelen voor uw lunchroom",
  benefits: [
    "Gasten zien direct alle opties",
    "Allergenen duidelijk aangegeven",
    "Minder vragen aan de balie",
    "Eenvoudig dagschotels toevoegen",
    "Altijd actuele prijzen",
    "Professionele uitstraling",
    "Bespaar op drukkosten",
    "Gasten kunnen vooraf kiezen"
  ],
  ctaTitle: "Uw lunchroom digitaal?",
  ctaSubtitle: "Probeer 30 dagen gratis. Ideaal voor de moderne lunchroom."
};

const MenukaartLunchroom = () => <LandingPageTemplate config={config} />;

export default MenukaartLunchroom;
