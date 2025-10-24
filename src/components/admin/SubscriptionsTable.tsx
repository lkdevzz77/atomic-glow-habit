import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Subscription {
  subscription_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  tier: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onEdit: (subscriptionId: string, userId: string) => void;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  onEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadge = (tier: string) => {
    if (tier === 'pro') return <Badge className="bg-violet-500">Pro</Badge>;
    if (tier === 'enterprise') return <Badge className="bg-purple-600">Enterprise</Badge>;
    return <Badge variant="outline">{tier}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-600">Ativa</Badge>;
    if (status === 'cancelled') return <Badge variant="destructive">Cancelada</Badge>;
    if (status === 'expired') return <Badge variant="outline">Expirada</Badge>;
    if (status === 'trial') return <Badge className="bg-blue-600">Trial</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por email ou nome..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Expiração</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma assinatura encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((sub) => (
                <TableRow key={sub.subscription_id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.user_name || 'Sem nome'}</span>
                      <span className="text-xs text-muted-foreground">{sub.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(sub.tier)}</TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(sub.started_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {sub.expires_at
                      ? format(new Date(sub.expires_at), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Sem data'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(sub.subscription_id, sub.user_id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
