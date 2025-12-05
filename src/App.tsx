import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard/restaurant/new" element={<RestaurantForm />} />
          <Route path="/dashboard/restaurant/:id" element={<RestaurantForm />} />
          <Route path="/dashboard/restaurant/:id/menus" element={<MenuList />} />
          <Route path="/dashboard/restaurant/:id/menu/:menuId" element={<MenuManager />} />
          <Route path="/dashboard/restaurant/:id/qr" element={<QRCode />} />
          <Route path="/dashboard/restaurant/:id/orders" element={<OrdersDashboard />} />
          <Route path="/dashboard/restaurant/:id/ordering-settings" element={<OrderingSettings />} />
          <Route path="/menu/:slug" element={<RestaurantMenuOverview />} />
          <Route path="/menu/:slug/:menuId" element={<PublicMenu />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
