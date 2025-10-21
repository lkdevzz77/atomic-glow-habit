-- ⚡ FASE 1: Correção de Restauração Diária
-- Criar RPC Function para buscar completions de hoje com cálculo server-side de data

CREATE OR REPLACE FUNCTION public.get_user_todays_completions(p_user_id UUID)
RETURNS TABLE(
  habit_id BIGINT, 
  date DATE, 
  percentage INTEGER, 
  completed_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hc.habit_id,
    hc.date,
    hc.percentage,
    hc.completed_at
  FROM habit_completions hc
  WHERE hc.user_id = p_user_id
    AND hc.date = CURRENT_DATE -- ⚡ Data calculada no servidor
    AND hc.percentage >= 100;
END;
$$ LANGUAGE plpgsql;