import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateOnboardingStatus: (completed: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Redirecionar baseado no status de onboarding
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const onboardingCompleted = session.user.user_metadata?.onboarding_completed;
            if (!onboardingCompleted) {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          }
          
          // Initialize user badges
          supabase.rpc('initialize_user_badges', { p_user_id: session.user.id });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Verificar status do onboarding na inicialização
      if (session?.user && !session.user.user_metadata?.onboarding_completed) {
        navigate('/onboarding');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error) {
      navigate('/dashboard');
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    if (!user) return;
    
    await supabase.auth.updateUser({
      data: {
        onboarding_completed: completed
      }
    });
    
    // Update local user state with new metadata
    if (session) {
      setSession({
        ...session,
        user: {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            onboarding_completed: completed
          }
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp, 
      signIn, 
      signOut, 
      loading,
      updateOnboardingStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};