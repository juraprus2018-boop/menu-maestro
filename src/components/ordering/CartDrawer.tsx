import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/hooks/useCart";

interface CartDrawerProps {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onCheckout: () => void;
  minimumOrderAmount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({
  items,
  subtotal,
  totalItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onCheckout,
  minimumOrderAmount,
  isOpen,
  onOpenChange,
}: CartDrawerProps) {
  const canCheckout = subtotal >= minimumOrderAmount;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg"
          size="icon"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Winkelwagen ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Je winkelwagen is leeg
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        €{item.price.toFixed(2)} per stuk
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="ml-auto font-medium">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <Input
                    placeholder="Notities (bijv. zonder ui)"
                    value={item.notes || ""}
                    onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotaal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              {!canCheckout && (
                <p className="text-sm text-destructive text-center">
                  Minimale bestelling: €{minimumOrderAmount.toFixed(2)}
                </p>
              )}
              
              <Button
                className="w-full"
                size="lg"
                onClick={onCheckout}
                disabled={!canCheckout}
              >
                Bestellen
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
