import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast({
          title: "Account aangemaakt!",
          description: "U bent nu ingelogd.",
        });
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
