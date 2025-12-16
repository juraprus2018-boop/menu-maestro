import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Store, 
  Menu, 
  QrCode, 
  ShoppingBag, 
  Settings, 
  CreditCard,
  Shield,
  LayoutDashboard
} from "lucide-react";

interface DashboardSidebarProps {
  restaurants: Array<{ id: string; name: string; logo_url: string | null }>;
  isAdmin: boolean;
}

export function DashboardSidebar({ restaurants, isAdmin }: DashboardSidebarProps) {
  const location = useLocation();
  const { id: restaurantId } = useParams();

  const isActive = (path: string) => location.pathname === path;
  const isRestaurantActive = (id: string) => location.pathname.includes(`/dashboard/restaurant/${id}`);

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-65px)] p-4">
      <nav className="space-y-2">
        {/* Main Dashboard */}
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive("/dashboard")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Overzicht
        </Link>

        {/* Abonnement */}
        <Link
          to="/dashboard/subscription"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive("/dashboard/subscription")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <CreditCard className="h-4 w-4" />
          Abonnement
        </Link>

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        )}

        {/* Restaurants Section */}
        {restaurants.length > 0 && (
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mijn Restaurants
            </h3>
            <div className="space-y-1">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                      isRestaurantActive(restaurant.id)
                        ? "bg-muted"
                        : ""
                    )}
                  >
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="h-5 w-5 rounded object-cover"
                      />
                    ) : (
                      <Store className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="truncate flex-1">{restaurant.name}</span>
                  </div>

                  {/* Sub-navigation - always visible */}
                    <div className="ml-4 pl-4 border-l border-border space-y-1">
                      <Link
                        to={`/dashboard/restaurant/${restaurant.id}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          isActive(`/dashboard/restaurant/${restaurant.id}`)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Instellingen
                      </Link>
                      <Link
                        to={`/dashboard/restaurant/${restaurant.id}/menus`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          isActive(`/dashboard/restaurant/${restaurant.id}/menus`)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Menu className="h-3.5 w-3.5" />
                        Menu's
                      </Link>
                      <Link
                        to={`/dashboard/restaurant/${restaurant.id}/qr`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          isActive(`/dashboard/restaurant/${restaurant.id}/qr`)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        QR-code
                      </Link>
                      <Link
                        to={`/dashboard/restaurant/${restaurant.id}/orders`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          location.pathname.includes(`/dashboard/restaurant/${restaurant.id}/orders`)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Bestellingen
                      </Link>
                      <Link
                        to={`/dashboard/restaurant/${restaurant.id}/ordering-settings`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          isActive(`/dashboard/restaurant/${restaurant.id}/ordering-settings`)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Bestel instellingen
                      </Link>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Restaurant */}
        <div className="pt-4">
          <Link
            to="/dashboard/restaurant/new"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-dashed border-border",
              isActive("/dashboard/restaurant/new")
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Store className="h-4 w-4" />
            Restaurant toevoegen
          </Link>
        </div>
      </nav>
    </aside>
  );
}
