import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, LogOut, AlertTriangle, CreditCard, Menu } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { isPast, differenceInDays } from "date-fns";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Profile {
  trial_ends_at: string;
}

interface SubscriptionStatus {
  subscribed: boolean;
  plan: string | null;
  subscription_end: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showTrialBanner?: boolean;
}

export function DashboardLayout({ children, title, showTrialBanner = true }: DashboardLayoutProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email ?? null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email ?? null);
        fetchRestaurants();
        fetchProfile(session.user.id);
        checkSubscription();
        checkAdminRole(session.user.id);
      }
    });

    return () => authSub.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("trial_ends_at")
      .eq("user_id", uid)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (!error && data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const checkAdminRole = async (uid: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();

    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const fetchRestaurants = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name, logo_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setRestaurants(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getTrialInfo = () => {
    if (isAdmin) return null;
    if (!profile) return null;
    
    const trialEndDate = new Date(profile.trial_ends_at);
    const trialEnded = isPast(trialEndDate);
    const daysLeft = differenceInDays(trialEndDate, new Date());

    if (subscription?.subscribed) {
      return {
        status: "subscribed",
        message: `${subscription.plan === "yearly" ? "Jaarlijks" : "Maandelijks"} abonnement`,
        variant: "default" as const,
      };
    }

    if (trialEnded) {
      return {
        status: "expired",
        message: "Proefperiode verlopen",
        variant: "destructive" as const,
      };
    }

    return {
      status: "trial",
      message: `Nog ${daysLeft} ${daysLeft === 1 ? "dag" : "dagen"} proefperiode`,
      variant: "secondary" as const,
    };
  };

  const trialInfo = getTrialInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 h-[65px]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="pt-4">
                  <DashboardSidebar restaurants={restaurants} isAdmin={isAdmin} />
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/dashboard" className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground font-serif hidden sm:inline">Digitale Menukaart</span>
            </Link>

            {title && (
              <>
                <span className="text-muted-foreground hidden md:inline">/</span>
                <span className="text-foreground font-medium hidden md:inline">{title}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {trialInfo && (
              <Badge variant={trialInfo.variant} className="hidden sm:flex">
                {trialInfo.message}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground hidden md:inline">
              {userEmail}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Trial/Subscription Banner */}
      {showTrialBanner && trialInfo && trialInfo.status === "expired" && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">
                Je proefperiode is verlopen. Activeer een abonnement om door te gaan.
              </span>
            </div>
            <Link to="/prijzen">
              <Button size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Bekijk abonnementen
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar restaurants={restaurants} isAdmin={isAdmin} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
