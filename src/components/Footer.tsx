import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground font-serif">Digitale Menukaart</span>
            </div>
            <p className="text-sm text-muted-foreground">
              De eenvoudigste manier om uw menu digitaal aan te bieden aan uw gasten.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Oplossingen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/oplossingen/qr-menu" className="hover:text-foreground transition-colors">
                  QR Menu
                </Link>
              </li>
              <li>
                <Link to="/oplossingen/qr-menu-bestellen" className="hover:text-foreground transition-colors">
                  QR Menu + Bestellen
                </Link>
              </li>
              <li>
                <Link to="/prijzen" className="hover:text-foreground transition-colors">
                  Prijzen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Informatie</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/hoe-werkt-het" className="hover:text-foreground transition-colors">
                  Hoe werkt het?
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors">
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Juridisch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link to="/algemene-voorwaarden" className="hover:text-foreground transition-colors">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p className="text-sm">© {new Date().getFullYear()} digitalemenukaart.nl - Alle rechten voorbehouden</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
