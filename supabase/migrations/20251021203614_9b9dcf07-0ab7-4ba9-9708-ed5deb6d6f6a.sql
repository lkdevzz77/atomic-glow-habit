-- FASE 1: Correções Críticas e Novas Funcionalidades

-- 1. Adicionar colunas de avatar na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_type TEXT DEFAULT 'initials' CHECK (avatar_type IN ('initials', 'upload', 'icon')),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_icon TEXT,
ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT 'violet';

-- 2. Adicionar trigger para atualizar level automaticamente baseado em XP
CREATE OR REPLACE FUNCTION update_level_from_xp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = CASE 
    WHEN NEW.xp >= 20000 THEN 10
    WHEN NEW.xp >= 10000 THEN 9
    WHEN NEW.xp >= 6000 THEN 8
    WHEN NEW.xp >= 3500 THEN 7
    WHEN NEW.xp >= 2000 THEN 6
    WHEN NEW.xp >= 1000 THEN 5
    WHEN NEW.xp >= 500 THEN 4
    WHEN NEW.xp >= 250 THEN 3
    WHEN NEW.xp >= 100 THEN 2
    ELSE 1
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_trigger
BEFORE UPDATE OF xp ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_level_from_xp();

-- 3. Adicionar colunas das 4 leis de James Clear na tabela habits
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS two_minute_version TEXT,
ADD COLUMN IF NOT EXISTS immediate_reward TEXT,
ADD COLUMN IF NOT EXISTS accountability_partner TEXT,
ADD COLUMN IF NOT EXISTS habit_stack TEXT;

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habits_user_status ON habits(user_id, status);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp);

-- 5. Adicionar função para calcular XP de completion (será chamada por edge function ou app)
CREATE OR REPLACE FUNCTION get_habit_completion_xp(p_user_id UUID, p_habit_id BIGINT, p_date DATE)
RETURNS TABLE(total_xp INT, reasons TEXT[]) AS $$
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
  
  -- Verificar semana perfeita (completou pelo menos um hábito todos os dias da semana)
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
  
  RETURN QUERY SELECT v_total_xp, v_reasons;
END;
$$ LANGUAGE plpgsql;