import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import RestaurantForm from "./pages/RestaurantForm";
import MenuList from "./pages/MenuList";
import MenuManager from "./pages/MenuManager";
import QRCode from "./pages/QRCode";
import RestaurantMenuOverview from "./pages/RestaurantMenuOverview";
import PublicMenu from "./pages/PublicMenu";
import OrdersDashboard from "./pages/OrdersDashboard";
import OrderingSettings from "./pages/OrderingSettings";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import NotFound from "./pages/NotFound";
import QRMenuPage from "./pages/QRMenuPage";
import QRMenuOrderingPage from "./pages/QRMenuOrderingPage";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PrijzenPage from "./pages/PrijzenPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/prijzen" element={<PrijzenPage />} />
            <Route path="/oplossingen/qr-menu" element={<QRMenuPage />} />
            <Route path="/oplossingen/qr-menu-bestellen" element={<QRMenuOrderingPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hoe-werkt-het" element={<HowItWorks />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/algemene-voorwaarden" element={<Terms />} />
            <Route path="/dashboard/restaurant/new" element={<RestaurantForm />} />
            <Route path="/dashboard/restaurant/:id" element={<RestaurantForm />} />
            <Route path="/dashboard/restaurant/:id/menus" element={<MenuList />} />
            <Route path="/dashboard/restaurant/:id/menu/:menuId" element={<MenuManager />} />
            <Route path="/dashboard/restaurant/:id/qr" element={<QRCode />} />
            <Route path="/dashboard/restaurant/:id/orders" element={<OrdersDashboard />} />
            <Route path="/dashboard/restaurant/:id/ordering-settings" element={<OrderingSettings />} />
            <Route path="/menu/:slug" element={<RestaurantMenuOverview />} />
            <Route path="/menu/:slug/:menuId" element={<PublicMenu />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
