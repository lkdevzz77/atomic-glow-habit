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
import { Shield, ShieldOff, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserDetailModal } from './UserDetailModal';

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

interface UsersTableProps {
  users: User[];
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
  onEditSubscription: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onToggleAdmin,
  onEditSubscription,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadge = (tier: string | null) => {
    if (!tier || tier === 'free') return <Badge variant="outline">Free</Badge>;
    if (tier === 'pro') return <Badge className="bg-violet-500">Pro</Badge>;
    return <Badge className="bg-purple-600">Enterprise</Badge>;
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    if (status === 'active') return <Badge className="bg-green-600">Ativa</Badge>;
    if (status === 'cancelled') return <Badge variant="destructive">Cancelada</Badge>;
    if (status === 'expired') return <Badge variant="outline">Expirada</Badge>;
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
              <TableHead>Hábitos</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name || 'Sem nome'}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      {user.is_admin && (
                        <Badge variant="outline" className="mt-1 w-fit bg-violet-500/10 text-violet-400">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTierBadge(user.subscription_tier || user.tier)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.subscription_status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.total_habits} criados</div>
                      <div className="text-muted-foreground">
                        {user.total_completions} completados
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditSubscription(user.user_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.is_admin ? 'destructive' : 'default'}
                        onClick={() => onToggleAdmin(user.user_id, user.is_admin)}
                      >
                        {user.is_admin ? (
                          <ShieldOff className="h-4 w-4" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};
