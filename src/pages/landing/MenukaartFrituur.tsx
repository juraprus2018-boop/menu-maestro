import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Flame, Clock, CreditCard, Smartphone, ShoppingBag } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-frituur",
  title: "Digitale Menukaart Frituur",
  metaTitle: "Digitale Menukaart voor Frituren & Snackbars | QR Menu Bestellen",
  metaDescription: "Digitale menukaart voor frituren en snackbars. Klanten scannen, kiezen en bestellen. Friet, snacks, sauzen - alles overzichtelijk. Probeer 30 dagen gratis.",
  badge: "Voor Frituren & Snackbars",
  heroTitle: "Digitale menukaart voor uw frituur",
  heroSubtitle: "Klanten scannen de QR-code bij de balie en kiezen rustig wat ze willen. Van friet tot frikandel - alles duidelijk op een rijtje. Modern en efficiënt.",
  features: [
    {
      icon: Flame,
      title: "Complete snackkaart",
      description: "Friet, snacks, broodjes, sauzen - organiseer alles in overzichtelijke categorieën."
    },
    {
      icon: QrCode,
      title: "QR-code aan de balie",
      description: "Klanten scannen terwijl ze wachten. Ze weten precies wat ze willen bestellen."
    },
    {
      icon: Clock,
      title: "Minder wachttijd",
      description: "Klanten kiezen vooraf. Minder lang nadenken aan de balie, snellere doorstroom."
    },
    {
      icon: CreditCard,
      title: "Optioneel: vooraf bestellen",
      description: "Laat klanten online bestellen en betalen. Alleen nog ophalen."
    },
    {
      icon: ShoppingBag,
      title: "Afhalen & bezorgen",
      description: "Bied afhalen en bezorging aan. Alles via één systeem."
    },
    {
      icon: Smartphone,
      title: "Eenvoudig beheer",
      description: "Pas prijzen en items aan via uw telefoon of computer. Direct zichtbaar."
    }
  ],
  benefitsTitle: "Voordelen voor uw frituur",
  benefits: [
    "Klanten kiezen rustig zonder druk",
    "Minder vragen aan de balie",
    "Snellere doorstroom in drukke tijden",
    "Altijd actuele prijzen",
    "Eenvoudig acties toevoegen",
    "Professionele uitstraling",
    "Optioneel online bestellen",
    "Geen verouderde papieren menu's"
  ],
  ctaTitle: "Uw frituur digitaal?",
  ctaSubtitle: "Start vandaag nog. 30 dagen gratis, daarna vanaf €9/maand."
};

const MenukaartFrituur = () => <LandingPageTemplate config={config} />;

export default MenukaartFrituur;
