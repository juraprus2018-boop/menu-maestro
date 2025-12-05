import { useSearchParams, Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <XCircle className="h-10 w-10 text-orange-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Betaling geannuleerd</h1>
          <p className="text-muted-foreground">
            Je betaling is niet voltooid. Je bestelling is nog niet geplaatst.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Je kunt teruggaan naar het restaurant om opnieuw te bestellen.
        </p>

        <Button asChild>
          <Link to="/">Terug naar home</Link>
        </Button>
      </div>
    </div>
  );
}
