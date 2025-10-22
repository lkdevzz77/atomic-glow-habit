import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/LoadingStates';
import { User, Edit3, Calendar } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AnimatedPage } from '@/components/AnimatedPage';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  desiredIdentity: z.string().min(10, 'Descreva sua identidade desejada em pelo menos 10 caracteres'),
  specificChange: z.string().min(10, 'Descreva a mudança específica em pelo menos 10 caracteres'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  // Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || '',
      desiredIdentity: user?.user_metadata?.desired_identity || '',
      specificChange: user?.user_metadata?.specific_change || '',
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: values.name,
          desired_identity: values.desiredIdentity,
          specific_change: values.specificChange,
        },
      });

      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
        variant: "default",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile.mutate(values);
  }

  if (!user) return null;

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <Breadcrumbs />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-200">Perfil</h1>
              <p className="text-slate-400 mt-1">Gerencie suas informações pessoais e objetivos</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="gap-2"
            >
              <Edit3 size={16} />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>

          <div className="grid gap-4 md:gap-6">
        {/* Card Principal */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle>{user.user_metadata?.name || 'Usuário'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Calendar size={12} />
                  <span>
                    Membro desde{' '}
                    {new Date(user.created_at).toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Formulário de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Identidade e Objetivos</CardTitle>
            <CardDescription>
              Defina quem você quer se tornar e que mudanças específicas deseja alcançar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="Seu nome completo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desiredIdentity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identidade Desejada</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          placeholder="Como você quer se descrever daqui a 6 meses?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Ex: "Uma pessoa que pratica exercícios regularmente e mantém uma dieta saudável"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specificChange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mudança Específica</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          placeholder="Que mudança específica você quer alcançar?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Ex: "Conseguir correr 5km sem parar e estabelecer uma rotina de alimentação balanceada"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvar Alterações
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Acompanhe seu progresso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total de Hábitos */}
              <div className="p-4 rounded-lg bg-slate-800/50 space-y-2">
                <div className="text-sm font-medium text-slate-400">Total de Hábitos</div>
                <div className="text-2xl font-bold text-slate-200">12</div>
              </div>

              {/* Streak mais longo */}
              <div className="p-4 rounded-lg bg-slate-800/50 space-y-2">
                <div className="text-sm font-medium text-slate-400">Melhor Streak</div>
                <div className="text-2xl font-bold text-slate-200">7 dias</div>
              </div>

              {/* Badges */}
              <div className="p-4 rounded-lg bg-slate-800/50 space-y-2">
                <div className="text-sm font-medium text-slate-400">Badges Conquistados</div>
                <div className="text-2xl font-bold text-slate-200">3</div>
              </div>

              {/* Dias Ativos */}
              <div className="p-4 rounded-lg bg-slate-800/50 space-y-2">
                <div className="text-sm font-medium text-slate-400">Dias Ativos</div>
                <div className="text-2xl font-bold text-slate-200">15</div>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
      </AnimatedPage>
    </AppLayout>
  );
}