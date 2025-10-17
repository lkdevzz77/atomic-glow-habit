import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
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
      navigate('/dashboard');
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
              src="/atom-logo.svg" 
              alt="atomicTracker" 
              className="w-12 h-12 sm:w-16 sm:h-16"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.8))',
                animation: 'float 3s ease-in-out infinite'
              }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter gradient-text mb-2">
            atomicTracker
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Transforme sua vida 1% por dia
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-2 border-slate-700 animate-scale-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold heading-section text-slate-50 mb-2">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp 
                ? 'Comece sua jornada de transformação' 
                : 'Continue sua jornada de hábitos'}
            </p>
          </div>

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
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Como podemos te chamar?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
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
          Ao criar uma conta, você concorda com nossos Termos de Uso
        </p>
      </div>
    </div>
  );
};

export default Auth;