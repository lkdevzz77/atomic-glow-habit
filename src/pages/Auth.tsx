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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/atom-logo.png" 
              alt="atomicTracker" 
              className="w-12 h-12 sm:w-16 sm:h-16 animate-float"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.8))'
              }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter gradient-text mb-2">
            atomicTracker
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Construa hábitos que duram
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-slate-700/50 animate-scale-in">

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-2 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome
                </label>
                <Input
                  type="text"
                  placeholder="Como podemos te chamar?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              {isSignUp && (
                <p className="text-xs text-slate-400 mt-1">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full group"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-slate-300 hover:text-violet-400 transition-colors w-full text-center"
              disabled={loading}
            >
              {isSignUp ? (
                <>
                  Já tem uma conta? <span className="font-semibold text-violet-400">Entre aqui</span>
                </>
              ) : (
                <>
                  Não tem uma conta? <span className="font-semibold text-violet-400">Cadastre-se</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-6">
          Grátis para sempre • Sem cartão
        </p>
      </div>
    </div>
  );
};

export default Auth;