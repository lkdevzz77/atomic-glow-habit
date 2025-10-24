import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaktoWebhookPayload {
  event: string;
  data: {
    id: string;
    customer: {
      email: string;
      name: string;
    };
    status: string;
    amount: number;
    subscription?: {
      id: string;
      status: string;
      plan: {
        interval: string;
      };
    };
  };
  signature: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('CAKTO_WEBHOOK_SECRET não configurado');
    }

    const payload: CaktoWebhookPayload = await req.json();
    console.log('Webhook recebido:', payload.event);

    // Verificar assinatura do webhook
    const signature = req.headers.get('x-cakto-signature');
    if (signature !== webhookSecret) {
      console.error('Assinatura inválida do webhook');
      return new Response(JSON.stringify({ error: 'Assinatura inválida' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar user_id pelo email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === payload.data.customer.email)?.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Usuário não encontrado:', payload.data.customer.email);
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = profile.id;

    // Processar eventos
    switch (payload.event) {
      case 'payment.approved':
      case 'subscription.created':
      case 'subscription.renewed': {
        const tier = payload.data.subscription?.plan.interval === 'yearly' ? 'pro' : 'pro';
        const expiresAt = payload.data.subscription?.plan.interval === 'yearly'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Atualizar ou criar subscription
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            tier,
            status: 'active',
            stripe_subscription_id: payload.data.subscription?.id || payload.data.id,
            expires_at: expiresAt,
            started_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          });

        if (subError) {
          console.error('Erro ao atualizar subscription:', subError);
          throw subError;
        }

        console.log(`Subscription ${payload.event} para user ${userId}`);
        break;
      }

      case 'payment.rejected':
      case 'subscription.cancelled':
      case 'subscription.expired': {
        // Cancelar subscription
        const { error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            expires_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (cancelError) {
          console.error('Erro ao cancelar subscription:', cancelError);
          throw cancelError;
        }

        console.log(`Subscription cancelada para user ${userId}`);
        break;
      }

      default:
        console.log(`Evento não tratado: ${payload.event}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
