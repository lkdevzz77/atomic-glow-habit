-- Otimizar função get_habit_completion_xp com error handling
CREATE OR REPLACE FUNCTION public.get_habit_completion_xp(
  p_user_id uuid,
  p_habit_id bigint,
  p_date date
)
RETURNS TABLE(total_xp integer, reasons text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_xp INT := 50;
  first_habit_bonus INT := 100;
  all_habits_bonus INT := 300;
  streak_7_bonus INT := 500;
  streak_30_bonus INT := 1000;
  streak_90_bonus INT := 2000;
  perfect_week_bonus INT := 700;
  
  v_total_xp INT := 0;
  v_reasons TEXT[] := ARRAY[]::TEXT[];
  v_today_completions INT;
  v_active_habits_count INT;
  v_current_streak INT;
  v_week_completion_days INT;
BEGIN
  -- Log de debug
  RAISE NOTICE 'Calculando XP para user:% habit:% date:%', p_user_id, p_habit_id, p_date;
  
  -- XP base
  v_total_xp := base_xp;
  v_reasons := array_append(v_reasons, 'Hábito completado');
  
  -- Verificar se é primeiro hábito do dia
  SELECT COUNT(*) INTO v_today_completions
  FROM habit_completions
  WHERE user_id = p_user_id 
    AND date = p_date 
    AND percentage >= 100;
  
  IF v_today_completions = 1 THEN
    v_total_xp := v_total_xp + first_habit_bonus;
    v_reasons := array_append(v_reasons, 'Primeiro hábito do dia! 🌅');
  END IF;
  
  -- Verificar se completou todos os hábitos do dia
  SELECT COUNT(*) INTO v_active_habits_count
  FROM habits
  WHERE user_id = p_user_id AND status = 'active';
  
  IF v_today_completions >= v_active_habits_count AND v_active_habits_count > 0 THEN
    v_total_xp := v_total_xp + all_habits_bonus;
    v_reasons := array_append(v_reasons, 'Todos os hábitos completados! 🎯');
  END IF;
  
  -- Verificar streak
  SELECT streak INTO v_current_streak
  FROM habits
  WHERE id = p_habit_id;
  
  IF v_current_streak = 7 THEN
    v_total_xp := v_total_xp + streak_7_bonus;
    v_reasons := array_append(v_reasons, '7 dias de sequência! 🔥');
  ELSIF v_current_streak = 30 THEN
    v_total_xp := v_total_xp + streak_30_bonus;
    v_reasons := array_append(v_reasons, '30 dias de sequência! 🔥🔥');
  ELSIF v_current_streak = 90 THEN
    v_total_xp := v_total_xp + streak_90_bonus;
    v_reasons := array_append(v_reasons, '90 dias de sequência! 🔥🔥🔥');
  END IF;
  
  -- Verificar semana perfeita
  SELECT COUNT(DISTINCT date) INTO v_week_completion_days
  FROM habit_completions
  WHERE user_id = p_user_id
    AND date >= DATE_TRUNC('week', p_date::TIMESTAMP)
    AND date < DATE_TRUNC('week', p_date::TIMESTAMP) + INTERVAL '7 days'
    AND percentage >= 100;
  
  IF v_week_completion_days = 7 THEN
    v_total_xp := v_total_xp + perfect_week_bonus;
    v_reasons := array_append(v_reasons, 'Semana perfeita! 🌟');
  END IF;
  
  -- Garantir que sempre retorna algo
  IF v_total_xp IS NULL THEN
    v_total_xp := 50;
    v_reasons := ARRAY['Hábito completado (fallback)'];
  END IF;
  
  RETURN QUERY SELECT v_total_xp, v_reasons;
  
EXCEPTION WHEN OTHERS THEN
  -- Em caso de erro, retornar XP mínimo
  RAISE WARNING 'Erro ao calcular XP: %', SQLERRM;
  RETURN QUERY SELECT 50::integer, ARRAY['Hábito completado (erro)']::text[];
END;
$function$;