import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Vul alle verplichte velden in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, subject, message }
      });

      if (error) throw error;

      toast({
        title: "Bericht verzonden",
        description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op."
      });
      
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('Error sending contact email:', error);
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw of stuur een e-mail naar info@digitalemenukaart.nl",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Contact"
        description="Neem contact op met Digitale Menukaart. Wij helpen u graag met vragen over onze digitale menukaart en QR-code oplossingen."
        canonicalUrl="/contact"
      />
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Contact
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Heeft u een vraag of wilt u meer informatie? Neem gerust contact met ons op.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Stuur ons een bericht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Uw naam"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mailadres *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="uw@email.nl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Onderwerp</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Waar gaat uw vraag over?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Bericht *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Uw bericht..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verzenden...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Verstuur bericht
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-muted-foreground">
              <p>Of mail direct naar:</p>
              <a href="mailto:info@digitalemenukaart.nl" className="text-primary hover:underline">
                info@digitalemenukaart.nl
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
