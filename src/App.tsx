import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/HabitsPage";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import BadgesPage from "./pages/BadgesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoute requireAuth={false}><Landing /></ProtectedRoute>} />
        <Route path="/auth" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute requireAuth><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute requireAuth requireOnboarding><Dashboard /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute requireAuth requireOnboarding><HabitsPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute requireAuth requireOnboarding><CalendarPage /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute requireAuth requireOnboarding><StatsPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute requireAuth requireOnboarding><BadgesPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireAuth requireOnboarding><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute requireAuth requireOnboarding><Settings /></ProtectedRoute>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <AnimatedRoutes />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ReactQueryDevtools initialIsOpen={false} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
