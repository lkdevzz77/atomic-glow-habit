-- Sprint 1: Backend Validation & Performance

-- 1. Add language field to profiles for i18n
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'auto';

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date 
ON habit_completions(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_habits_user_status 
ON habits(user_id, status) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked 
ON user_badges(user_id, unlocked);

-- 3. Fix streak break logic - reset streaks for habits not completed today
CREATE OR REPLACE FUNCTION check_and_reset_broken_streaks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_habit RECORD;
  v_yesterday DATE;
  v_completion_exists BOOLEAN;
BEGIN
  v_yesterday := CURRENT_DATE - INTERVAL '1 day';
  
  -- Para cada hábito ativo com streak > 0
  FOR v_habit IN 
    SELECT id, user_id, streak 
    FROM habits 
    WHERE status = 'active' AND streak > 0
  LOOP
    -- Verificar se foi completado ontem
    SELECT EXISTS(
      SELECT 1 FROM habit_completions
      WHERE habit_id = v_habit.id
        AND date = v_yesterday
        AND percentage >= 100
    ) INTO v_completion_exists;
    
    -- Se não foi completado ontem, resetar streak
    IF NOT v_completion_exists THEN
      UPDATE habits 
      SET streak = 0 
      WHERE id = v_habit.id;
      
      RAISE NOTICE 'Streak resetado para habit_id=%', v_habit.id;
    END IF;
  END LOOP;
END;
$$;

-- 4. Fix Function Search Path warnings - update existing functions
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, p_xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE profiles SET xp = xp + p_xp_amount WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, desired_identity, specific_change)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'desired_identity', ''),
    COALESCE(NEW.raw_user_meta_data->>'specific_change', '')
  );
  RETURN NEW;
END;
$$;

-- 5. Create RPC to get user XP earned today (for Dashboard fix)
CREATE OR REPLACE FUNCTION get_user_xp_earned_today(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total_xp INT := 0;
  v_completion RECORD;
BEGIN
  -- Somar XP de todas as completions de hoje
  FOR v_completion IN
    SELECT habit_id, date
    FROM habit_completions
    WHERE user_id = p_user_id
      AND date = CURRENT_DATE
      AND percentage >= 100
  LOOP
    -- Buscar XP calculado para cada completion
    SELECT COALESCE(total_xp, 15) INTO v_total_xp
    FROM get_habit_completion_xp(p_user_id, v_completion.habit_id, v_completion.date)
    LIMIT 1;
    
    v_total_xp := v_total_xp + v_total_xp;
  END LOOP;
  
  RETURN COALESCE(v_total_xp, 0);
END;
$$;