import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";

const Terms = () => {
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
            Algemene Voorwaarden
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
            <h2>Artikel 1 - Definities</h2>
            <p>In deze algemene voorwaarden wordt verstaan onder:</p>
            <ul>
              <li><strong>Dienst:</strong> Het digitale menukaart platform aangeboden door Digitale Menukaart</li>
              <li><strong>Gebruiker:</strong> De natuurlijke of rechtspersoon die een account heeft aangemaakt</li>
              <li><strong>Account:</strong> Het persoonlijke account waarmee toegang wordt verkregen tot de Dienst</li>
              <li><strong>Abonnement:</strong> De overeenkomst voor het gebruik van de betaalde functies van de Dienst</li>
            </ul>

            <h2>Artikel 2 - Toepasselijkheid</h2>
            <p>
              Deze algemene voorwaarden zijn van toepassing op elk gebruik van de Dienst en alle 
              overeenkomsten tussen Digitale Menukaart en de Gebruiker.
            </p>

            <h2>Artikel 3 - Account</h2>
            <p>
              3.1. Om gebruik te maken van de Dienst dient u een account aan te maken.<br />
              3.2. U bent verantwoordelijk voor het geheimhouden van uw inloggegevens.<br />
              3.3. U bent verantwoordelijk voor alle activiteiten die plaatsvinden onder uw account.<br />
              3.4. U dient correcte en actuele informatie te verstrekken bij het aanmaken van uw account.
            </p>

            <h2>Artikel 4 - Proefperiode</h2>
            <p>
              4.1. Nieuwe gebruikers ontvangen een gratis proefperiode van 30 dagen.<br />
              4.2. Tijdens de proefperiode heeft u toegang tot alle functies van de Dienst.<br />
              4.3. Na afloop van de proefperiode dient u een abonnement af te sluiten om de Dienst te blijven gebruiken.<br />
              4.4. Er is geen creditcard nodig voor de proefperiode.
            </p>

            <h2>Artikel 5 - Abonnementen en betaling</h2>
            <p>
              5.1. Abonnementen worden aangeboden op maand- of jaarbasis.<br />
              5.2. Betalingen worden vooraf gefactureerd via iDEAL met automatische SEPA-incasso.<br />
              5.3. Prijzen zijn inclusief BTW, tenzij anders vermeld.<br />
              5.4. Wij behouden ons het recht voor om prijzen te wijzigen. Bestaande abonnementen worden hiervan 30 dagen van tevoren op de hoogte gesteld.
            </p>

            <h2>Artikel 6 - Opzegging</h2>
            <p>
              6.1. U kunt uw abonnement op elk moment opzeggen.<br />
              6.2. Na opzegging blijft uw account actief tot het einde van de betaalde periode.<br />
              6.3. Er vindt geen restitutie plaats van reeds betaalde abonnementsgelden.
            </p>

            <h2>Artikel 7 - Gebruik van de Dienst</h2>
            <p>U gaat ermee akkoord dat u de Dienst niet zult gebruiken voor:</p>
            <ul>
              <li>Illegale activiteiten</li>
              <li>Het verspreiden van schadelijke of misleidende inhoud</li>
              <li>Het schenden van intellectuele eigendomsrechten</li>
              <li>Het verstoren van de werking van de Dienst</li>
            </ul>

            <h2>Artikel 8 - Intellectueel eigendom</h2>
            <p>
              8.1. Alle intellectuele eigendomsrechten op de Dienst berusten bij Digitale Menukaart.<br />
              8.2. U behoudt de rechten op de content die u uploadt naar de Dienst.<br />
              8.3. Door content te uploaden verleent u ons een licentie om deze content te gebruiken voor het leveren van de Dienst.
            </p>

            <h2>Artikel 9 - Aansprakelijkheid</h2>
            <p>
              9.1. De Dienst wordt geleverd "as is" zonder garanties van enige aard.<br />
              9.2. Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst.<br />
              9.3. Onze aansprakelijkheid is beperkt tot het bedrag dat u in de afgelopen 12 maanden aan ons heeft betaald.
            </p>

            <h2>Artikel 10 - Wijzigingen</h2>
            <p>
              10.1. Wij behouden ons het recht voor om deze voorwaarden te wijzigen.<br />
              10.2. Wijzigingen worden minimaal 30 dagen van tevoren aangekondigd.<br />
              10.3. Voortgezet gebruik van de Dienst na wijzigingen geldt als acceptatie van de nieuwe voorwaarden.
            </p>

            <h2>Artikel 11 - Toepasselijk recht</h2>
            <p>
              Op deze algemene voorwaarden en alle overeenkomsten is Nederlands recht van toepassing. 
              Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
            </p>

            <h2>Artikel 12 - Contact</h2>
            <p>
              Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen via{" "}
              <a href="mailto:info@digitalemenukaart.nl" className="text-primary">info@digitalemenukaart.nl</a>.
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

export default Terms;
