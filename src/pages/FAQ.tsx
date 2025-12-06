import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const FAQ = () => {
  const faqs = [
    {
      question: "Hoe werkt de digitale menukaart?",
      answer: "U maakt een account aan, voegt uw restaurant en menu's toe, en downloadt uw unieke QR-code. Gasten scannen de QR-code met hun telefoon en zien direct uw menu. Geen app nodig, het werkt in elke browser."
    },
    {
      question: "Kan ik meerdere menu's aanmaken?",
      answer: "Ja, u kunt onbeperkt menu's aanmaken. Denk aan een Lunchkaart, Dinerkaart, Drankkaart, Dessertmenu, etc. Alle menu's zijn toegankelijk via dezelfde QR-code."
    },
    {
      question: "Hoe lang is de gratis proefperiode?",
      answer: "U kunt 30 dagen gratis alle functies uitproberen. Geen creditcard nodig. Na de proefperiode kiest u zelf of u wilt doorgaan met een abonnement."
    },
    {
      question: "Wat kost het na de proefperiode?",
      answer: "Het Basic abonnement kost €9 per maand of €95 per jaar. Wilt u ook online bestellingen ontvangen? Dan kiest u voor het Premium abonnement van €29,50 per maand."
    },
    {
      question: "Kan ik mijn abonnement op elk moment opzeggen?",
      answer: "Ja, u kunt uw abonnement op elk moment opzeggen. Er is geen opzegtermijn en u betaalt alleen voor de periode die u heeft gebruikt."
    },
    {
      question: "Werkt de QR-code op alle telefoons?",
      answer: "Ja, moderne smartphones kunnen QR-codes scannen met de standaard camera-app. De menukaart opent in de browser, dus er is geen speciale app nodig."
    },
    {
      question: "Kan ik allergenen toevoegen aan gerechten?",
      answer: "Ja, u kunt de 14 EU-allergenen toevoegen aan elk gerecht. Gasten kunnen vervolgens filteren op allergenen om alleen geschikte gerechten te zien."
    },
    {
      question: "Hoe snel zijn wijzigingen zichtbaar?",
      answer: "Wijzigingen zijn direct zichtbaar. Zodra u een prijs aanpast of een gerecht toevoegt, zien gasten die de QR-code scannen meteen de nieuwe versie."
    },
    {
      question: "Kan ik mijn eigen logo toevoegen?",
      answer: "Ja, u kunt uw eigen logo uploaden en kiezen uit verschillende thema's om uw menukaart te personaliseren."
    },
    {
      question: "Hoe werkt het bestelsysteem?",
      answer: "Met het Premium abonnement kunnen gasten direct bestellen via de digitale menukaart. U ontvangt bestellingen in uw dashboard en krijgt een melding bij nieuwe bestellingen. Gasten kunnen betalen met iDEAL of contant bij afhalen/bezorgen."
    },
    {
      question: "Kan ik beginnen met alleen een menu en later bestellen toevoegen?",
      answer: "Ja, dat kan! Start met het Basic abonnement voor de digitale menukaart. Wanneer u klaar bent voor online bestellingen, kunt u eenvoudig upgraden naar Premium."
    },
    {
      question: "Welke betalingsmethoden worden ondersteund?",
      answer: "Voor online bestellingen ondersteunen we iDEAL. Daarnaast kunnen gasten kiezen voor contante betaling bij afhalen of bezorgen."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Veelgestelde vragen"
        description="Antwoorden op veelgestelde vragen over onze digitale menukaart. Lees over prijzen, functies, proefperiode en meer."
        canonicalUrl="/faq"
      />
      <Navbar />
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Veelgestelde vragen
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Heeft u een vraag? Bekijk hieronder de meest gestelde vragen of neem contact met ons op.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-serif mb-4">
            Nog vragen?
          </h2>
          <p className="text-muted-foreground mb-6">
            Neem gerust contact met ons op. We helpen u graag verder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="outline">Contact opnemen</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button>
                Gratis uitproberen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
