import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock, Phone, MapPin, User, RefreshCw, Settings, Lock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { hasOrderingSubscription } from "@/lib/subscription-tiers";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  order_type: string;
  delivery_address: string | null;
  delivery_postal_code: string | null;
  delivery_city: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  estimated_time: number | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  confirmed: "bg-yellow-500",
  preparing: "bg-orange-500",
  ready: "bg-green-500",
  out_for_delivery: "bg-purple-500",
  delivered: "bg-gray-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  new: "Nieuw",
  confirmed: "Bevestigd",
  preparing: "In bereiding",
  ready: "Klaar",
  out_for_delivery: "Onderweg",
  delivered: "Bezorgd/Afgehaald",
  cancelled: "Geannuleerd",
};

const OrdersDashboard = () => {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [hasOrdering, setHasOrdering] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      
      const productIds = data?.product_ids || [];
      const mainProductId = data?.product_id;
      const hasOrderingViaArray = hasOrderingSubscription(productIds);
      const hasOrderingViaMain = mainProductId === "prod_TYAfzP0Dw0QUCD";
      
      setHasOrdering(hasOrderingViaArray || hasOrderingViaMain);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasOrdering(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    if (restaurantId && hasOrdering) {
      fetchOrders();
    } else if (!checkingSubscription && !hasOrdering) {
      setLoading(false);
    }
  }, [restaurantId, statusFilter, hasOrdering, checkingSubscription]);

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          toast({
            title: "🔔 Nieuwe bestelling!",
            description: `Bestelling #${payload.new.order_number} van ${payload.new.customer_name}`,
          });
          fetchOrders();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (statusFilter === "active") {
        query = query.in("order_status", ["new", "confirmed", "preparing", "ready"]);
      } else if (statusFilter !== "all") {
        query = query.eq("order_status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);

      if (data && data.length > 0) {
        const orderIds = data.map((o) => o.id);
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        if (items) {
          const itemsByOrder: Record<string, OrderItem[]> = {};
          items.forEach((item) => {
            if (!itemsByOrder[item.order_id]) {
              itemsByOrder[item.order_id] = [];
            }
            itemsByOrder[item.order_id].push(item);
          });
          setOrderItems(itemsByOrder);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Status bijgewerkt",
        description: `Bestelling is nu: ${statusLabels[newStatus]}`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getNextStatus = (currentStatus: string, orderType: string): string | null => {
    if (orderType === "delivery") {
      const flow: Record<string, string> = {
        new: "confirmed",
        confirmed: "preparing",
        preparing: "ready",
        ready: "out_for_delivery",
        out_for_delivery: "delivered",
      };
      return flow[currentStatus] || null;
    } else {
      const flow: Record<string, string> = {
        new: "confirmed",
        confirmed: "preparing",
        preparing: "ready",
        ready: "delivered",
      };
      return flow[currentStatus] || null;
    }
  };

  if (checkingSubscription) {
    return (
      <DashboardLayout title="Bestellingen">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!hasOrdering) {
    return (
      <DashboardLayout title="Bestellingen">
        <div className="p-6 max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Bestellen abonnement vereist</CardTitle>
              <CardDescription>
                Om online bestellingen te ontvangen heeft u het Bestellen abonnement nodig (€29,50/maand).
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate("/prijzen")}>
                Bekijk abonnementen
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bestellingen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-serif">Bestellingen</h1>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actieve bestellingen</SelectItem>
                <SelectItem value="all">Alle bestellingen</SelectItem>
                <SelectItem value="new">Nieuw</SelectItem>
                <SelectItem value="confirmed">Bevestigd</SelectItem>
                <SelectItem value="preparing">In bereiding</SelectItem>
                <SelectItem value="ready">Klaar</SelectItem>
                <SelectItem value="out_for_delivery">Onderweg</SelectItem>
                <SelectItem value="delivered">Bezorgd/Afgehaald</SelectItem>
                <SelectItem value="cancelled">Geannuleerd</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate(`/dashboard/restaurant/${restaurantId}/ordering-settings`)}>
              <Settings className="h-4 w-4 mr-2" />
              Instellingen
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Geen bestellingen gevonden</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-shadow hover:shadow-lg ${
                  selectedOrder?.id === order.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                    <Badge className={statusColors[order.order_status]}>
                      {statusLabels[order.order_status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "d MMM HH:mm", { locale: nl })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_phone}</span>
                    </div>
                    {order.order_type === "delivery" && order.delivery_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>
                          {order.delivery_address}, {order.delivery_postal_code} {order.delivery_city}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{order.order_type === "pickup" ? "Afhalen" : "Bezorgen"}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium mb-2">Items:</p>
                    <ul className="space-y-1 text-sm">
                      {orderItems[order.id]?.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.item_name}
                          </span>
                          <span>€{(item.item_price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <p className="font-medium">Opmerking:</p>
                      <p>{order.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">€{order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.payment_method === "cash" && "Contant"}
                        {order.payment_method === "card" && "Pin"}
                        {order.payment_method === "ideal" && "iDEAL"}
                        {" - "}
                        {order.payment_status === "pending" && "Nog te betalen"}
                        {order.payment_status === "paid" && "Betaald"}
                      </p>
                    </div>
                    {getNextStatus(order.order_status, order.order_type) && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, getNextStatus(order.order_status, order.order_type)!);
                        }}
                      >
                        {statusLabels[getNextStatus(order.order_status, order.order_type)!]}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersDashboard;
