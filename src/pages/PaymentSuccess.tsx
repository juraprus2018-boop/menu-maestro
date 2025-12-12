import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !sessionId) {
        setError("Geen order ID of sessie ID gevonden");
        setIsVerifying(false);
        return;
      }

      try {
        const { data, error: verifyError } = await supabase.functions.invoke(
          "verify-order-payment",
          { body: { orderId, sessionId } }
        );

        if (verifyError) throw verifyError;
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setOrderNumber(data.order?.order_number);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("Er ging iets mis bij het verifiëren van je betaling");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg">Betaling wordt geverifieerd...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <p className="text-lg text-destructive">{error}</p>
          <p className="text-muted-foreground">
            Neem contact op met het restaurant als je denkt dat er iets mis is gegaan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SEO 
        title="Betaling geslaagd"
        description="Uw betaling is succesvol verwerkt."
        noIndex={true}
      />
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Betaling geslaagd!</h1>
          {orderNumber && (
            <p className="text-lg">
              Je bestelnummer is <span className="font-bold">#{orderNumber}</span>
            </p>
          )}
        </div>

        <p className="text-muted-foreground">
          Je ontvangt een bevestiging per e-mail. Het restaurant gaat direct aan de slag met je bestelling.
        </p>

        <Button asChild variant="outline">
          <Link to="/">Terug naar home</Link>
        </Button>
      </div>
    </div>
  );
}
