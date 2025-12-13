import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Loader2, Mail, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              company_name: companyName,
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              business_info: businessInfo,
            },
          },
        });
        if (error) throw error;
        
        // Send notification email to admin (fire and forget)
        supabase.functions.invoke("send-new-account-notification", {
          body: {
            email,
            companyName,
            firstName,
            lastName,
            phone,
            businessInfo,
          },
        }).catch(err => console.error("Failed to send notification:", err));
        
        toast({
          title: "Account aangemaakt!",
          description: "U wordt nu doorgestuurd naar uw dashboard.",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welkom terug!",
          description: "U bent succesvol ingelogd.",
        });
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message === "User already registered") {
        message = "Dit e-mailadres is al geregistreerd. Probeer in te loggen.";
      } else if (error.message === "Invalid login credentials") {
        message = "Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.";
      } else if (error.message === "Email not confirmed") {
        message = "Uw e-mailadres is nog niet geverifieerd. Controleer uw inbox.";
      }
      toast({
        title: "Fout",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Email verification success screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO 
          title="Bevestig uw e-mailadres"
          description="Controleer uw inbox om uw e-mailadres te bevestigen."
          canonicalUrl="/auth"
        />
        <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif">
                Controleer uw inbox
              </CardTitle>
              <CardDescription className="text-base mt-2">
                We hebben een verificatie-e-mail gestuurd naar:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="font-medium text-lg bg-muted px-4 py-2 rounded-md">
                {email}
              </p>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Klik op de link in de e-mail om uw account te activeren</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Na verificatie kunt u direct inloggen</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Controleer ook uw spam/ongewenste map</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Geen e-mail ontvangen?
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEmailSent(false);
                    setIsSignUp(false);
                  }}
                  className="w-full"
                >
                  Terug naar inloggen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={isSignUp ? "Account aanmaken" : "Inloggen"}
        description="Log in of maak een account aan om uw digitale menukaart te beheren. Start direct met 30 dagen gratis uitproberen."
        canonicalUrl="/auth"
      />
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif">Digitale Menukaart</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">
              {isSignUp ? "Account aanmaken" : "Inloggen"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Maak een gratis account aan om te beginnen"
                : "Log in om uw menukaarten te beheren"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Naam van uw bedrijf"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Voornaam *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Voornaam"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Achternaam *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Achternaam"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefoonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+31 6 12345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessInfo">Wat voor bedrijf heeft u en in welk(e) product(en) bent u geïnteresseerd? *</Label>
                    <textarea
                      id="businessInfo"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Beschrijf uw bedrijf en welke producten u interesseren..."
                      value={businessInfo}
                      onChange={(e) => setBusinessInfo(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@voorbeeld.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimaal 6 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Account aanmaken" : "Inloggen"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              {isSignUp ? (
                <p className="text-muted-foreground">
                  Heeft u al een account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Inloggen
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Nog geen account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Registreren
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
