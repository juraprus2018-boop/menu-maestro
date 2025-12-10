import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, Users, CreditCard, Clock, Shield } from "lucide-react";
import { format, isPast } from "date-fns";
import { nl } from "date-fns/locale";
import { SUBSCRIPTION_TIERS, PLANS } from "@/lib/subscription-tiers";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
  trial_ends_at: string;
}

interface Subscription {
  user_id: string;
  plan: string;
  status: string;
  started_at: string;
  expires_at: string | null;
}

interface UserWithSubscription extends UserProfile {
  subscription: Subscription | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [adminSubscriptions, setAdminSubscriptions] = useState<{basic: boolean, pro: boolean, ordering: boolean}>({
    basic: false,
    pro: false,
    ordering: false,
  });
  const [savingAdminSub, setSavingAdminSub] = useState(false);

  useEffect(() => {
    checkAdminAndFetchUsers();
  }, []);

  const checkAdminAndFetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setCurrentUserId(session.user.id);

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        toast({
          title: "Geen toegang",
          description: "Je hebt geen admin rechten.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchUsers();
      await fetchAdminSubscriptions(session.user.id);
    } catch (error) {
      console.error("Error checking admin:", error);
      navigate("/dashboard");
    }
  };

  const fetchAdminSubscriptions = async (userId: string) => {
    try {
      const { data: subs, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active");

      if (error) throw error;

      const activeProductIds = subs?.map(s => s.plan) || [];
      
      setAdminSubscriptions({
        basic: activeProductIds.some(id => SUBSCRIPTION_TIERS.basic.productIds.includes(id as any)),
        pro: activeProductIds.some(id => SUBSCRIPTION_TIERS.pro.productIds.includes(id as any)),
        ordering: activeProductIds.some(id => SUBSCRIPTION_TIERS.ordering.productIds.includes(id as any)),
      });
    } catch (error) {
      console.error("Error fetching admin subscriptions:", error);
    }
  };

  const toggleAdminSubscription = async (tier: "basic" | "pro" | "ordering") => {
    if (!currentUserId) return;
    setSavingAdminSub(true);

    try {
      const productId = tier === "basic" 
        ? PLANS.basic_monthly.productId 
        : tier === "pro" 
          ? PLANS.pro_monthly.productId 
          : PLANS.ordering_monthly.productId;

      if (adminSubscriptions[tier]) {
        // Remove subscription
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("user_id", currentUserId)
          .eq("plan", productId);

        if (error) throw error;

        setAdminSubscriptions(prev => ({ ...prev, [tier]: false }));
        toast({
          title: "Abonnement verwijderd",
          description: `${SUBSCRIPTION_TIERS[tier].name} abonnement is uitgeschakeld.`,
        });
      } else {
        // Add subscription
        const { error } = await supabase
          .from("subscriptions")
          .insert({
            user_id: currentUserId,
            plan: productId,
            status: "active",
            started_at: new Date().toISOString(),
            expires_at: null, // Admin subs don't expire
          });

        if (error) throw error;

        setAdminSubscriptions(prev => ({ ...prev, [tier]: true }));
        toast({
          title: "Abonnement geactiveerd",
          description: `${SUBSCRIPTION_TIERS[tier].name} abonnement is nu actief.`,
        });
      }

      // Refresh users list to update stats
      await fetchUsers();
    } catch (error: any) {
      console.error("Error toggling subscription:", error);
      toast({
        title: "Fout",
        description: "Kon abonnement niet wijzigen: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSavingAdminSub(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subsError) throw subsError;

      // Combine profiles with subscriptions
      const usersWithSubs: UserWithSubscription[] = (profiles || []).map((profile) => ({
        ...profile,
        subscription: subscriptions?.find((sub) => sub.user_id === profile.user_id) || null,
      }));

      setUsers(usersWithSubs);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Fout",
        description: "Kon gebruikers niet laden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTrialExpiryEmail = async (user: UserWithSubscription) => {
    setSendingEmail(user.user_id);
    try {
      const { data, error } = await supabase.functions.invoke("send-trial-expiry-email", {
        body: {
          userId: user.user_id,
          email: user.email,
        },
      });

      if (error) throw error;

      toast({
        title: "Email verzonden",
        description: `Email verstuurd naar ${user.email}`,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Fout",
        description: "Kon email niet verzenden: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const getTrialStatus = (user: UserWithSubscription) => {
    if (user.subscription && user.subscription.status === "active") {
      return { label: "Actief abonnement", variant: "default" as const };
    }
    
    const trialEnded = isPast(new Date(user.trial_ends_at));
    if (trialEnded) {
      return { label: "Proefperiode verlopen", variant: "destructive" as const };
    }
    return { label: "In proefperiode", variant: "secondary" as const };
  };

  const stats = {
    total: users.length,
    withSubscription: users.filter((u) => u.subscription?.status === "active").length,
    trialExpired: users.filter((u) => !u.subscription && isPast(new Date(u.trial_ends_at))).length,
    inTrial: users.filter((u) => !u.subscription && !isPast(new Date(u.trial_ends_at))).length,
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-serif text-primary">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Admin Subscription Control */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Mijn Admin Abonnementen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Als admin kun je abonnementen activeren zonder te betalen.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin-basic" 
                  checked={adminSubscriptions.basic}
                  onCheckedChange={() => toggleAdminSubscription("basic")}
                  disabled={savingAdminSub}
                />
                <label htmlFor="admin-basic" className="text-sm font-medium cursor-pointer">
                  Basis (€9/maand)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin-pro" 
                  checked={adminSubscriptions.pro}
                  onCheckedChange={() => toggleAdminSubscription("pro")}
                  disabled={savingAdminSub}
                />
                <label htmlFor="admin-pro" className="text-sm font-medium cursor-pointer">
                  Pro (€14,95/maand)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin-ordering" 
                  checked={adminSubscriptions.ordering}
                  onCheckedChange={() => toggleAdminSubscription("ordering")}
                  disabled={savingAdminSub}
                />
                <label htmlFor="admin-ordering" className="text-sm font-medium cursor-pointer">
                  Bestellen (€29,50/maand)
                </label>
              </div>
              {savingAdminSub && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Totaal gebruikers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.withSubscription}</p>
                  <p className="text-sm text-muted-foreground">Met abonnement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.inTrial}</p>
                  <p className="text-sm text-muted-foreground">In proefperiode</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Mail className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.trialExpired}</p>
                  <p className="text-sm text-muted-foreground">Proef verlopen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alle gebruikers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Geen gebruikers gevonden.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Geregistreerd</TableHead>
                      <TableHead>Proefperiode eindigt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Abonnement</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const status = getTrialStatus(user);
                      const trialEnded = isPast(new Date(user.trial_ends_at));
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            {format(new Date(user.created_at), "d MMM yyyy", { locale: nl })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.trial_ends_at), "d MMM yyyy", { locale: nl })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <span className="text-sm">
                                {user.subscription.plan === "monthly" ? "Maandelijks" : "Jaarlijks"} - €
                                {user.subscription.plan === "monthly" ? "9" : "95"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Geen</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {trialEnded && !user.subscription && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendTrialExpiryEmail(user)}
                                disabled={sendingEmail === user.user_id}
                              >
                                {sendingEmail === user.user_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Mail className="h-4 w-4 mr-1" />
                                    Stuur herinnering
                                  </>
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
