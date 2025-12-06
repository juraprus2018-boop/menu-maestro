import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  ChevronDown
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isSolutionsActive = location.pathname.startsWith("/oplossingen");

  const navLinkClass = (path: string) => cn(
    "transition-colors",
    isActive(path) 
      ? "text-primary font-medium" 
      : "text-muted-foreground hover:text-foreground"
  );

  const mobileNavLinkClass = (path: string) => cn(
    "py-2 text-lg font-medium transition-colors",
    isActive(path) 
      ? "text-primary" 
      : "hover:text-primary"
  );

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Digitale Menukaart" className="h-10 w-10" />
          <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <button className={cn(
              "transition-colors flex items-center gap-1",
              isSolutionsActive 
                ? "text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}>
              Oplossingen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link 
                to="/oplossingen/qr-menu" 
                className={cn(
                  "block px-4 py-3 text-sm transition-colors rounded-t-lg",
                  isActive("/oplossingen/qr-menu") 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-muted"
                )}
              >
                QR Menu
              </Link>
              <Link 
                to="/oplossingen/qr-menu-bestellen" 
                className={cn(
                  "block px-4 py-3 text-sm transition-colors rounded-b-lg",
                  isActive("/oplossingen/qr-menu-bestellen") 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-muted"
                )}
              >
                QR Menu + Bestellen
              </Link>
            </div>
          </div>
          <Link to="/prijzen" className={navLinkClass("/prijzen")}>
            Prijzen
          </Link>
          <Link to="/hoe-werkt-het" className={navLinkClass("/hoe-werkt-het")}>
            Hoe werkt het?
          </Link>
          <Link to="/faq" className={navLinkClass("/faq")}>
            FAQ
          </Link>
          <Link to="/contact" className={navLinkClass("/contact")}>
            Contact
          </Link>
        </div>
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Inloggen</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button>30 dagen gratis</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/auth?mode=signup">
            <Button size="sm">Gratis proberen</Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card">
              <div className="flex flex-col gap-4 mt-8">
                {/* Oplossingen Dropdown */}
                <Collapsible open={solutionsOpen} onOpenChange={setSolutionsOpen}>
                  <CollapsibleTrigger className={cn(
                    "flex items-center justify-between w-full py-2 text-lg font-medium transition-colors",
                    isSolutionsActive ? "text-primary" : "hover:text-primary"
                  )}>
                    Oplossingen
                    <ChevronDown className={`h-5 w-5 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 mt-2">
                    <SheetClose asChild>
                      <Link 
                        to="/oplossingen/qr-menu" 
                        className={cn(
                          "block py-2 transition-colors",
                          isActive("/oplossingen/qr-menu") 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        QR Menu
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/oplossingen/qr-menu-bestellen" 
                        className={cn(
                          "block py-2 transition-colors",
                          isActive("/oplossingen/qr-menu-bestellen") 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        QR Menu + Bestellen
                      </Link>
                    </SheetClose>
                  </CollapsibleContent>
                </Collapsible>
                
                <SheetClose asChild>
                  <Link to="/prijzen" className={mobileNavLinkClass("/prijzen")}>
                    Prijzen
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/hoe-werkt-het" className={mobileNavLinkClass("/hoe-werkt-het")}>
                    Hoe werkt het?
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/faq" className={mobileNavLinkClass("/faq")}>
                    FAQ
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/contact" className={mobileNavLinkClass("/contact")}>
                    Contact
                  </Link>
                </SheetClose>
                
                <div className="border-t border-border pt-4 mt-4 space-y-3">
                  <SheetClose asChild>
                    <Link to="/auth" className="block">
                      <Button variant="outline" className="w-full">Inloggen</Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/auth?mode=signup" className="block">
                      <Button className="w-full">30 dagen gratis proberen</Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
