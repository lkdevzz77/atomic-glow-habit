import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupAdmin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMakeAdmin = async () => {
    if (!user) return;
    
    setLoading(true);
    setStatus('idle');

    try {
      // Insert admin role directly
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) {
        // Se já existe, atualizar
        if (error.code === '23505') {
          setStatus('success');
          toast.success('Você já é admin!');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        toast.success('Admin configurado com sucesso! Redirecionando...', {
          duration: 2000,
        });
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error setting admin:', error);
      setStatus('error');
      toast.error('Erro ao configurar admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              Não Autenticado
            </CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth'} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            Setup de Admin
          </CardTitle>
          <CardDescription>
            Configure sua conta como administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>User ID:</strong> <code className="text-xs">{user.id}</code>
            </p>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Admin configurado com sucesso!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Erro ao configurar. Verifique o console.</span>
            </div>
          )}

          <Button 
            onClick={handleMakeAdmin} 
            disabled={loading || status === 'success'}
            className="w-full"
            size="lg"
          >
            {loading ? 'Configurando...' : status === 'success' ? 'Configurado ✓' : 'Tornar-se Admin'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Esta página é apenas para setup inicial. Após configurar, acesse <code>/admin</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
