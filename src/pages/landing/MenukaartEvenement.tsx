import LandingPageTemplate, { LandingPageConfig } from "./LandingPageTemplate";
import { QrCode, PartyPopper, Users, Clock, Smartphone, Calendar } from "lucide-react";

const config: LandingPageConfig = {
  slug: "digitale-menukaart-evenement",
  title: "Digitale Menukaart Evenement",
  metaTitle: "Digitale Menukaart voor Evenementen | QR Menu voor Festivals & Events",
  metaDescription: "Digitale menukaart voor evenementen, festivals en partijen. QR-codes voor eten en drinken. Makkelijk te beheren, snel aanpasbaar. Probeer 30 dagen gratis.",
  badge: "Voor Evenementen",
  heroTitle: "Digitale menukaart voor uw evenement",
  heroSubtitle: "Festival, bedrijfsfeest of bruiloft - bied uw gasten een overzichtelijk menu via QR-code. Makkelijk te beheren, geen gedoe met papieren kaarten.",
  features: [
    {
      icon: PartyPopper,
      title: "Perfect voor events",
      description: "Van bedrijfsfeesten tot festivals - uw gasten scannen en zien direct het aanbod."
    },
    {
      icon: Users,
      title: "Grote groepen",
      description: "Honderden gasten? Geen probleem. Iedereen scant dezelfde QR-code."
    },
    {
      icon: Calendar,
      title: "Tijdelijk menu",
      description: "Maak een menu specifiek voor uw event. Activeer en deactiveer wanneer u wilt."
    },
    {
      icon: Clock,
      title: "Live aanpassingen",
      description: "Iets uitverkocht? Pas het direct aan. Gasten zien altijd de actuele kaart."
    },
    {
      icon: QrCode,
      title: "Meerdere locaties",
      description: "Verschillende bars op het event? Maak aparte menu's met eigen QR-codes."
    },
    {
      icon: Smartphone,
      title: "Geen app nodig",
      description: "Gasten scannen de code en het menu opent direct. Geen download vereist."
    }
  ],
  benefitsTitle: "Waarom een digitale menukaart voor uw event?",
  benefits: [
    "Minder wachttijd aan de bar",
    "Gasten weten vooraf wat beschikbaar is",
    "Eenvoudig meerdere bars beheren",
    "Direct updates bij uitverkocht",
    "Professionele uitstraling",
    "Geen drukkosten voor eenmalig event",
    "Meertalig voor internationale gasten",
    "Herbruikbaar voor volgende evenementen"
  ],
  ctaTitle: "Uw event professioneel cateren?",
  ctaSubtitle: "Probeer 30 dagen gratis. Perfect voor uw volgende evenement."
};

const MenukaartEvenement = () => <LandingPageTemplate config={config} />;

export default MenukaartEvenement;
