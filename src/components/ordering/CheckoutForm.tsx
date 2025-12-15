import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/hooks/useCart";
import { Loader2, Clock } from "lucide-react";

interface OrderingSettings {
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  accepts_cash: boolean;
  accepts_card: boolean;
  accepts_ideal: boolean;
  delivery_fee: number | null;
  estimated_pickup_time: number | null;
  estimated_delivery_time: number | null;
}

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  restaurantId: string;
  restaurantName: string;
  orderingSettings: OrderingSettings;
  onOrderComplete: () => void;
}

// Generate time slots for the next 3 hours in 15 minute intervals
function generateTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [
    { value: "asap", label: "Zo snel mogelijk" }
  ];
  
  const now = new Date();
  const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
  now.setMinutes(roundedMinutes, 0, 0);
  
  // Add 30 minutes minimum prep time
  now.setMinutes(now.getMinutes() + 30);
  
  for (let i = 0; i < 12; i++) { // 3 hours = 12 slots of 15 minutes
    const slotTime = new Date(now.getTime() + i * 15 * 60 * 1000);
    const hours = slotTime.getHours().toString().padStart(2, "0");
    const minutes = slotTime.getMinutes().toString().padStart(2, "0");
    slots.push({
      value: slotTime.toISOString(),
      label: `${hours}:${minutes}`
    });
  }
  
  return slots;
}

export function CheckoutForm({
  isOpen,
  onClose,
  items,
  subtotal,
  restaurantId,
  restaurantName,
  orderingSettings,
  onOrderComplete,
}: CheckoutFormProps) {
  const [orderType, setOrderType] = useState<"pickup" | "delivery">(
    orderingSettings.accepts_pickup ? "pickup" : "delivery"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "ideal">(
    orderingSettings.accepts_cash ? "cash" : orderingSettings.accepts_card ? "card" : "ideal"
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPostalCode, setDeliveryPostalCode] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [notes, setNotes] = useState("");
  const [requestedTime, setRequestedTime] = useState("asap");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots();
  const deliveryFee = orderType === "delivery" ? (orderingSettings.delivery_fee || 0) : 0;
  const total = subtotal + deliveryFee;
  const estimatedTime = orderType === "pickup" 
    ? orderingSettings.estimated_pickup_time 
    : orderingSettings.estimated_delivery_time;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone) {
      toast.error("Vul je naam en telefoonnummer in");
      return;
    }

    if (orderType === "delivery" && (!deliveryAddress || !deliveryPostalCode || !deliveryCity)) {
      toast.error("Vul je bezorgadres in");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurantId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || null,
          order_type: orderType,
          payment_method: paymentMethod,
          delivery_address: orderType === "delivery" ? deliveryAddress : null,
          delivery_postal_code: orderType === "delivery" ? deliveryPostalCode : null,
          delivery_city: orderType === "delivery" ? deliveryCity : null,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          notes: notes || null,
          estimated_time: estimatedTime,
          requested_time: requestedTime === "asap" ? null : requestedTime,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        notes: item.notes || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Handle iDEAL payment - redirect to Stripe
      if (paymentMethod === "ideal") {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
          "create-order-payment",
          {
            body: {
              orderId: order.id,
              customerEmail: customerEmail || undefined,
              customerName,
              totalAmount: total,
              restaurantName,
            },
          }
        );

        if (paymentError || !paymentData?.url) {
          throw new Error("Kon betaallink niet aanmaken");
        }

        // Redirect to Stripe Checkout
        window.location.href = paymentData.url;
        return;
      }

      // For cash/card payments, send notifications and complete
      supabase.functions.invoke("send-order-notification", {
        body: { orderId: order.id, restaurantId },
      }).catch((err) => console.error("Error sending order notification:", err));

      toast.success(`Bestelling #${order.order_number} is geplaatst!`);
      onOrderComplete();
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Er ging iets mis bij het plaatsen van je bestelling");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Afrekenen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Type */}
          {orderingSettings.accepts_pickup && orderingSettings.accepts_delivery && (
            <div className="space-y-2">
              <Label>Hoe wil je je bestelling ontvangen?</Label>
              <RadioGroup
                value={orderType}
                onValueChange={(v) => setOrderType(v as "pickup" | "delivery")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="cursor-pointer">
                    Afhalen {estimatedTime && orderType === "pickup" && `(~${orderingSettings.estimated_pickup_time} min)`}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="cursor-pointer">
                    Bezorgen {deliveryFee > 0 && `(+€${deliveryFee.toFixed(2)})`}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Requested Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Gewenst tijdstip
            </Label>
            <Select value={requestedTime} onValueChange={setRequestedTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoonnummer *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (optioneel)</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Address */}
          {orderType === "delivery" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Straat en huisnummer *</Label>
                <Input
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal">Postcode *</Label>
                  <Input
                    id="postal"
                    value={deliveryPostalCode}
                    onChange={(e) => setDeliveryPostalCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Plaats *</Label>
                  <Input
                    id="city"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Betaalmethode</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "cash" | "card" | "ideal")}
              className="flex flex-wrap gap-4"
            >
              {orderingSettings.accepts_cash && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Contant</Label>
                </div>
              )}
              {orderingSettings.accepts_card && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Pin</Label>
                </div>
              )}
              {orderingSettings.accepts_ideal && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ideal" id="ideal" />
                  <Label htmlFor="ideal" className="cursor-pointer">iDEAL</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijv. graag bellen bij aankomst"
            />
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotaal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Bezorgkosten</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Totaal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            {requestedTime !== "asap" && (
              <p className="text-sm text-muted-foreground text-center">
                Gewenst tijdstip: {new Date(requestedTime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            {requestedTime === "asap" && estimatedTime && (
              <p className="text-sm text-muted-foreground text-center">
                Geschatte tijd: ~{estimatedTime} minuten
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {paymentMethod === "ideal" ? "Doorsturen naar iDEAL..." : "Bestelling plaatsen..."}
              </>
            ) : (
              paymentMethod === "ideal" 
                ? `Betalen met iDEAL (€${total.toFixed(2)})`
                : `Bestelling plaatsen (€${total.toFixed(2)})`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
