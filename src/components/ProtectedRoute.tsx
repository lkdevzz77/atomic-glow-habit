import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requireOnboarding = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/atom-logo.png" 
            alt="Loading" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.8))'
            }}
          />
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Handle authentication
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect authenticated users away from auth/landing pages
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle onboarding requirement
  if (requireOnboarding && user?.user_metadata?.onboarding_completed !== true) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;