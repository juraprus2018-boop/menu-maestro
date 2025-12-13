import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, Sun, Umbrella, IceCream, Clock, Smartphone } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-strandpaviljoen",
  title: "Digitale Menukaart Strandpaviljoen",
  metaTitle: "Digitale Menukaart voor Strandpaviljoens | QR Menu aan Zee",
  metaDescription: "Digitale menukaart voor strandpaviljoens en beachclubs. QR-code op de strandstoel, gasten bestellen direct. Ideaal voor seizoenslocaties. Probeer gratis.",
  badge: "Voor Strandpaviljoens",
  heroTitle: "Digitale menukaart voor uw strandpaviljoen",
  heroSubtitle: "Gasten liggen op het strand en bekijken uw kaart via hun telefoon. Van cocktails tot lunch - alles binnen handbereik. Perfect voor de seizoensdrukte.",
  features: [
    {
      icon: Umbrella,
      title: "QR-code bij strandstoel",
      description: "Gasten scannen de code bij hun strandbed en bekijken direct uw menu."
    },
    {
      icon: Sun,
      title: "Seizoenskaarten",
      description: "Wissel makkelijk tussen voorjaar, zomer en najaarskaart. Direct actueel."
    },
    {
      icon: IceCream,
      title: "Van ijsje tot lunch",
      description: "IJs, snacks, lunch, drankjes - overzichtelijk gepresenteerd per categorie."
    },
    {
      icon: Clock,
      title: "Direct wijzigen",
      description: "Uitverkocht? Even aanpassen. Nieuwe special? Binnen minuten online."
    },
    {
      icon: QrCode,
      title: "Weerbestendig",
      description: "Print waterbestendige QR-codes. Werkt ook met zand op de telefoon."
    },
    {
      icon: Smartphone,
      title: "Gasten bestellen zelf",
      description: "Optioneel: laat gasten direct bestellen via hun telefoon. Minder personeel nodig."
    }
  ],
  benefitsTitle: "Voordelen voor uw strandpaviljoen",
  benefits: [
    "Gasten hoeven niet naar de bar te lopen",
    "Minder drukte aan de balie",
    "Eenvoudig seizoenskaarten wisselen",
    "Meertalig voor toeristen",
    "Geen papieren kaarten die nat worden",
    "Direct prijzen aanpassen",
    "Optioneel bestellen via telefoon",
    "Perfect voor drukke zomerdagen"
  ],
  ctaTitle: "Klaar voor het seizoen?",
  ctaSubtitle: "Start nu en wees klaar voor de zomer. 30 dagen gratis proberen."
};

const MenukaartStrandpaviljoen = () => <LandingPageTemplate config={config} />;

export default MenukaartStrandpaviljoen;
