-- FASE 2: Melhorar RPC Function
-- Atualizar get_user_todays_completions com filtro de percentage >= 100
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
    AND hc.date = CURRENT_DATE
    AND hc.percentage >= 100
  ORDER BY hc.completed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Adicionar função helper para debug de data do servidor
CREATE OR REPLACE FUNCTION public.get_server_date()
RETURNS DATE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- FASE 3: Função centralizada para cálculo de streak
CREATE OR REPLACE FUNCTION public.calculate_habit_streak(p_habit_id BIGINT)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_streak INT := 0;
  v_longest_streak INT := 0;
  v_check_date DATE := CURRENT_DATE;
  v_completion_exists BOOLEAN;
BEGIN
  -- Calcular streak atual (de trás pra frente a partir de hoje)
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM habit_completions
      WHERE habit_id = p_habit_id
        AND date = v_check_date
        AND percentage >= 100
    ) INTO v_completion_exists;
    
    EXIT WHEN NOT v_completion_exists;
    
    v_current_streak := v_current_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
  END LOOP;
  
  -- Buscar longest streak da tabela
  SELECT h.longest_streak INTO v_longest_streak
  FROM habits h
  WHERE h.id = p_habit_id;
  
  -- Atualizar se current > longest
  v_longest_streak := GREATEST(v_current_streak, COALESCE(v_longest_streak, 0));
  
  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql;

-- FASE 4: Prevenir completions duplicados no mesmo dia
ALTER TABLE habit_completions
DROP CONSTRAINT IF EXISTS unique_habit_completion_per_day;

ALTER TABLE habit_completions
ADD CONSTRAINT unique_habit_completion_per_day 
UNIQUE (habit_id, date);

-- Índice para queries rápidas de completions
CREATE INDEX IF NOT EXISTS idx_completions_lookup
ON habit_completions(user_id, date, percentage)
WHERE percentage >= 100;