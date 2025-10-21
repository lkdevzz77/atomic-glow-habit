import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/HabitsPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <Routes>
              {/* Rotas públicas */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Landing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } 
              />

              {/* Rota de onboarding */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute requireAuth>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/habits" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <HabitsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stats" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/badges" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requireAuth requireOnboarding>
                    <Settings />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas de erro */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ReactQueryDevtools initialIsOpen={false} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
