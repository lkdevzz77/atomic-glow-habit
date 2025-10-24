import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/layouts/AppLayout';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '@/components/admin/StatsCards';
import { UsersTable } from '@/components/admin/UsersTable';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { EditSubscriptionModal } from '@/components/admin/EditSubscriptionModal';
import { useToast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/PageLoader';
import { Shield } from 'lucide-react';

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      if (error) throw error;
      return data[0];
    },
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_users_stats');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all subscriptions
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_subscriptions');
      if (error) throw error;
      return data;
    },
  });

  // Toggle admin role
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        const { error } = await supabase.rpc('remove_user_role', {
          p_user_id: userId,
          p_role: 'admin',
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('add_user_role', {
          p_user_id: userId,
          p_role: 'admin',
        });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: isAdmin ? 'Admin removido' : 'Admin promovido',
        description: isAdmin
          ? 'Permissões de admin removidas com sucesso'
          : 'Usuário promovido a admin com sucesso',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível modificar as permissões',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  // Update subscription
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({
      userId,
      tier,
      status,
      expiresAt,
    }: {
      userId: string;
      tier: string;
      status: string;
      expiresAt: string | null;
    }) => {
      const { error } = await supabase.rpc('update_user_subscription', {
        p_user_id: userId,
        p_tier: tier,
        p_status: status,
        p_expires_at: expiresAt,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Assinatura atualizada',
        description: 'A assinatura foi modificada com sucesso',
      });
      setEditingUserId(null);
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a assinatura',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const handleToggleAdmin = (userId: string, isAdmin: boolean) => {
    toggleAdminMutation.mutate({ userId, isAdmin });
  };

  const handleEditSubscription = (userId: string) => {
    setEditingUserId(userId);
  };

  const handleSaveSubscription = async (
    tier: string,
    status: string,
    expiresAt: string | null
  ) => {
    if (!editingUserId) return;
    await updateSubscriptionMutation.mutateAsync({
      userId: editingUserId,
      tier,
      status,
      expiresAt,
    });
  };

  const editingUser = users?.find((u) => u.user_id === editingUserId);

  if (statsLoading || usersLoading || subscriptionsLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-violet-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie usuários, assinaturas e monitore métricas
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <StatsCards
              totalUsers={Number(stats.total_users) || 0}
              activeUsers={Number(stats.active_users_30d) || 0}
              totalSubscriptions={Number(stats.total_subscriptions) || 0}
              activeSubscriptions={Number(stats.active_subscriptions) || 0}
              monthlyRevenue={Number(stats.monthly_revenue) || 0}
            />
          )}

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {users && (
                <UsersTable
                  users={users}
                  onToggleAdmin={handleToggleAdmin}
                  onEditSubscription={handleEditSubscription}
                />
              )}
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              {subscriptions && (
                <SubscriptionsTable
                  subscriptions={subscriptions}
                  onEdit={(_, userId) => handleEditSubscription(userId)}
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Edit Subscription Modal */}
          {editingUser && (
            <EditSubscriptionModal
              open={!!editingUserId}
              onClose={() => setEditingUserId(null)}
              userId={editingUserId!}
              currentTier={editingUser.subscription_tier || editingUser.tier}
              currentStatus={editingUser.subscription_status || 'active'}
              currentExpiresAt={editingUser.subscription_expires_at}
              onSave={handleSaveSubscription}
            />
          )}
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
