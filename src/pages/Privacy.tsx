import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button>30 dagen gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Privacybeleid
          </h1>
          <p className="text-muted-foreground">
            Laatst bijgewerkt: december 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h2>1. Inleiding</h2>
            <p>
              Digitale Menukaart (hierna: "wij", "ons" of "onze") respecteert uw privacy en is toegewijd aan 
              het beschermen van uw persoonlijke gegevens. Dit privacybeleid legt uit hoe wij uw persoonlijke 
              informatie verzamelen, gebruiken en beschermen wanneer u onze diensten gebruikt.
            </p>

            <h2>2. Gegevens die wij verzamelen</h2>
            <h3>2.1 Account gegevens</h3>
            <p>Wanneer u een account aanmaakt, verzamelen wij:</p>
            <ul>
              <li>E-mailadres</li>
              <li>Wachtwoord (versleuteld opgeslagen)</li>
            </ul>

            <h3>2.2 Restaurant gegevens</h3>
            <p>Voor het aanmaken van uw digitale menukaart verzamelen wij:</p>
            <ul>
              <li>Restaurantnaam</li>
              <li>Logo (optioneel)</li>
              <li>Menu informatie (gerechten, prijzen, beschrijvingen)</li>
            </ul>

            <h3>2.3 Bestelgegevens</h3>
            <p>Wanneer klanten bestellen via uw menukaart, verzamelen wij:</p>
            <ul>
              <li>Naam van de klant</li>
              <li>Telefoonnummer</li>
              <li>E-mailadres (optioneel)</li>
              <li>Bezorgadres (bij bezorging)</li>
              <li>Bestelgegevens</li>
            </ul>

            <h2>3. Hoe wij uw gegevens gebruiken</h2>
            <p>Wij gebruiken uw gegevens voor:</p>
            <ul>
              <li>Het leveren van onze diensten</li>
              <li>Het verwerken van betalingen</li>
              <li>Het verzenden van belangrijke meldingen over uw account</li>
              <li>Het verbeteren van onze diensten</li>
              <li>Klantenondersteuning</li>
            </ul>

            <h2>4. Gegevensbescherming</h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om uw persoonlijke gegevens 
              te beschermen tegen ongeoorloofde toegang, wijziging, openbaarmaking of vernietiging. 
              Dit omvat versleuteling van gegevens, beveiligde servers en regelmatige beveiligingsaudits.
            </p>

            <h2>5. Delen van gegevens</h2>
            <p>
              Wij delen uw persoonlijke gegevens niet met derden, behalve:
            </p>
            <ul>
              <li>Met betalingsverwerkers voor het afhandelen van transacties</li>
              <li>Wanneer wettelijk vereist</li>
              <li>Met uw uitdrukkelijke toestemming</li>
            </ul>

            <h2>6. Bewaartermijn</h2>
            <p>
              Wij bewaren uw gegevens zolang uw account actief is of zolang nodig is om onze diensten 
              aan u te leveren. U kunt op elk moment verzoeken om verwijdering van uw gegevens.
            </p>

            <h2>7. Uw rechten</h2>
            <p>U heeft het recht om:</p>
            <ul>
              <li>Toegang te vragen tot uw persoonlijke gegevens</li>
              <li>Correctie te vragen van onjuiste gegevens</li>
              <li>Verwijdering te vragen van uw gegevens</li>
              <li>Bezwaar te maken tegen de verwerking van uw gegevens</li>
              <li>Gegevensoverdraagbaarheid te verzoeken</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              Wij gebruiken functionele cookies die noodzakelijk zijn voor het functioneren van onze dienst. 
              Deze cookies worden niet gebruikt voor tracking of advertentiedoeleinden.
            </p>

            <h2>9. Wijzigingen in dit beleid</h2>
            <p>
              Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. Wijzigingen worden op deze pagina 
              gepubliceerd met een bijgewerkte datum. Wij raden u aan dit beleid regelmatig te raadplegen.
            </p>

            <h2>10. Contact</h2>
            <p>
              Voor vragen over dit privacybeleid of uw persoonlijke gegevens kunt u contact met ons 
              opnemen via <a href="mailto:info@digitalemenukaart.nl" className="text-primary">info@digitalemenukaart.nl</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-bold font-serif">Digitale Menukaart</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/algemene-voorwaarden" className="hover:text-foreground">Algemene voorwaarden</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
