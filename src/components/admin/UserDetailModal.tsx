import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Target, Trophy, Clock } from 'lucide-react';

interface User {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
  tier: string;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  total_habits: number;
  total_completions: number;
  last_activity: string | null;
  is_admin: boolean;
}

interface UserDetailModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações completas sobre {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.name || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-xs">{user.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                {user.is_admin ? (
                  <Badge className="bg-violet-500">Admin</Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Assinatura</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tier</p>
                <p className="font-medium capitalize">
                  {user.subscription_tier || user.tier || 'Free'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">
                  {user.subscription_status || 'Sem assinatura'}
                </p>
              </div>
              {user.subscription_expires_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Expira em</p>
                  <p className="font-medium">
                    {format(new Date(user.subscription_expires_at), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Atividade</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Target className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Hábitos</p>
                  <p className="text-2xl font-bold">{user.total_habits}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Trophy className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-2xl font-bold">{user.total_completions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Cadastro</p>
                  <p className="text-sm font-medium">
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Última atividade</p>
                  <p className="text-sm font-medium">
                    {user.last_activity
                      ? format(new Date(user.last_activity), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Nunca'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
