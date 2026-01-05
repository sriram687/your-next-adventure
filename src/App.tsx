import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TripProvider } from "@/contexts/TripContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import TripViewer from "./pages/TripViewer";
import BudgetDashboard from "./pages/BudgetDashboard";
import Profile from "./pages/Profile";
import SharedItinerary from "./pages/SharedItinerary";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        
        {/* Public shared itinerary route */}
        <Route path="/share/:tripId" element={<SharedItinerary />} />
        
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/:tripId" element={<TripViewer />} />
          <Route path="/trips/:tripId/edit" element={<ItineraryBuilder />} />
          <Route path="/trips/:tripId/budget" element={<BudgetDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="globe-trotter-theme">
      <TooltipProvider>
        <AuthProvider>
          <TripProvider>
            <Toaster />
            <Sonner position="top-right" richColors closeButton />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRoutes />
            </BrowserRouter>
          </TripProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
