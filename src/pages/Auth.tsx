import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido').min(1, 'Email é obrigatório');
const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');
const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const onboardingCompleted = user.user_metadata?.onboarding_completed;
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      if (isSignUp) {
        nameSchema.parse(name);
        const { error } = await signUp(email, password, name);
        
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Este email já está cadastrado. Tente fazer login.');
          } else {
            setError(error.message);
          }
        } else {
          navigate('/onboarding');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Email ou senha incorretos.');
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err: any) {
      if (err?.issues) {
        setError(err.issues[0].message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/atom-logo.png" 
              alt="atomicTracker" 
              className="w-16 h-16 sm:w-20 sm:h-20 opacity-90"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
            atomicTracker
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Construa hábitos que duram
          </p>
        </div>

        {/* Auth Card */}
        <div className="neuro-card rounded-2xl p-6 sm:p-8 animate-scale-in">

          {error && (
            <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-2.5 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2.5">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Como podemos te chamar?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2.5">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2.5">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-2">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>{isSignUp ? 'Criando conta...' : 'Entrando...'}</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
              disabled={loading}
            >
              {isSignUp ? (
                <>
                  Já tem uma conta? <span className="font-medium text-primary">Entre aqui</span>
                </>
              ) : (
                <>
                  Não tem uma conta? <span className="font-medium text-primary">Cadastre-se</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground/70 text-xs mt-8">
          Grátis para sempre • Sem cartão
        </p>
      </div>
    </div>
  );
};

export default Auth;