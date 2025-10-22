-- ===== FASE 1: ATUALIZAR TABELA BADGES =====
ALTER TABLE badges ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'bronze';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 50;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_tier ON badges(tier);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked ON user_badges(user_id, unlocked);

-- ===== FASE 2: LIMPAR E INSERIR NOVAS BADGES =====
DELETE FROM user_badges;
DELETE FROM badges;

-- CATEGORIA: STREAKS (Bronze → Legendary)
INSERT INTO badges (id, name, description, icon, category, tier, target, xp_reward, hidden) VALUES
('seed', 'Semente', 'Complete 3 dias consecutivos', '🌱', 'streak', 'bronze', 3, 50, false),
('sprout', 'Broto', 'Complete 7 dias consecutivos', '🌿', 'streak', 'bronze', 7, 75, false),
('sapling', 'Mudinha', 'Complete 14 dias consecutivos', '🪴', 'streak', 'silver', 14, 150, false),
('identity', 'Nova Identidade', '21 dias - Formação de hábito', '⚛️', 'streak', 'silver', 21, 250, false),
('tree', 'Árvore Forte', 'Complete 30 dias consecutivos', '🌳', 'streak', 'gold', 30, 400, false),
('forest', 'Floresta', 'Complete 60 dias consecutivos', '🌲', 'streak', 'gold', 60, 800, false),
('transform', 'Transformação', '90 dias de consistência absoluta', '🦋', 'streak', 'gold', 90, 1500, false),
('eternal', 'Eterno', '180 dias de dedicação implacável', '♾️', 'streak', 'legendary', 180, 3000, false),
('atomic', 'Atômico', '365 dias - 1 ano completo', '⚛️✨', 'streak', 'legendary', 365, 7500, false);

-- CATEGORIA: HÁBITOS (Quantidade de completions)
INSERT INTO badges (id, name, description, icon, category, tier, target, xp_reward, hidden) VALUES
('starter', 'Iniciante', 'Complete 10 hábitos', '✅', 'habits', 'bronze', 10, 50, false),
('doer', 'Fazedor', 'Complete 50 hábitos', '💪', 'habits', 'silver', 50, 150, false),
('champion', 'Campeão', 'Complete 100 hábitos', '🏆', 'habits', 'gold', 100, 400, false),
('legend', 'Lenda', 'Complete 500 hábitos', '👑', 'habits', 'legendary', 500, 1000, false);

-- CATEGORIA: IDENTIDADE
INSERT INTO badges (id, name, description, icon, category, tier, target, xp_reward, hidden) VALUES
('believer', 'Crente', 'Defina sua identidade desejada', '🎯', 'identity', 'bronze', 1, 30, false),
('voter', 'Eleitor', '100 votos de identidade', '🗳️', 'identity', 'silver', 100, 150, false),
('become', 'Manifestado', '500 votos - Você se tornou', '✨', 'identity', 'gold', 500, 400, false);

-- CATEGORIA: MAESTRIA (Completions de um único hábito)
INSERT INTO badges (id, name, description, icon, category, tier, target, xp_reward, hidden) VALUES
('specialist', 'Especialista', 'Complete 1 hábito 50 vezes', '🎓', 'mastery', 'silver', 50, 150, false),
('master', 'Mestre', 'Complete 1 hábito 100 vezes', '🥋', 'mastery', 'gold', 100, 500, false),
('grandmaster', 'Grão-Mestre', 'Complete 1 hábito 365 vezes', '🔥👑', 'mastery', 'legendary', 365, 2000, false);

-- CATEGORIA: SPECIAL (Easter Eggs)
INSERT INTO badges (id, name, description, icon, category, tier, target, xp_reward, hidden) VALUES
('phoenix', 'Fênix', 'Volte após quebrar streak de 30+ dias', '🔥🐦', 'special', 'silver', 1, 200, true),
('nightowl', 'Coruja', 'Complete hábito após meia-noite', '🦉', 'special', 'bronze', 1, 50, true),
('earlybird', 'Madrugador', 'Complete hábito antes das 6h', '🐦', 'special', 'bronze', 1, 50, true),
('perfect_month', 'Mês Perfeito', '30 dias sem falhas', '📅✨', 'special', 'gold', 1, 600, false),
('resilient', 'Resiliente', 'Retorne após quebrar uma sequência', '💎', 'special', 'bronze', 1, 50, false),
('stacker', 'Empilhador', 'Complete 5 hábitos empilhados', '📚', 'special', 'silver', 5, 100, false);

-- ===== FASE 3: FUNÇÃO DE CÁLCULO DE XP REESCRITA =====
DROP FUNCTION IF EXISTS get_habit_completion_xp(uuid, bigint, date);

CREATE OR REPLACE FUNCTION get_habit_completion_xp(
  p_user_id UUID,
  p_habit_id BIGINT,
  p_date DATE
) RETURNS TABLE(total_xp INTEGER, reasons TEXT[]) AS $$
DECLARE
  v_base_xp INT := 15;
  v_bonus_xp INT := 0;
  v_multiplier NUMERIC := 1.0;
  v_total_xp INT := 0;
  v_reasons TEXT[] := ARRAY[]::TEXT[];
  v_streak INT;
  v_goal_target INT;
  v_is_first_today BOOLEAN;
  v_all_completed BOOLEAN;
  v_today_completions INT;
  v_active_habits_count INT;
BEGIN
  -- Log inicial
  RAISE NOTICE 'Calculando XP: user=% habit=% date=%', p_user_id, p_habit_id, p_date;
  
  -- XP Base
  v_reasons := array_append(v_reasons, 'Hábito completado (+15 XP)');
  
  -- Buscar dados do hábito
  SELECT COALESCE(streak, 0), COALESCE(goal_target, 10) 
  INTO v_streak, v_goal_target
  FROM habits 
  WHERE id = p_habit_id;
  
  -- Verificar se é primeiro hábito do dia
  SELECT COUNT(*) INTO v_today_completions
  FROM habit_completions
  WHERE user_id = p_user_id 
    AND date = p_date 
    AND percentage >= 100;
  
  v_is_first_today := (v_today_completions = 1);
  
  IF v_is_first_today THEN
    v_bonus_xp := v_bonus_xp + 10;
    v_reasons := array_append(v_reasons, 'Primeiro do dia! 🌅 (+10 XP)');
  END IF;
  
  -- Verificar se completou todos os hábitos do dia
  SELECT COUNT(*) INTO v_active_habits_count
  FROM habits
  WHERE user_id = p_user_id AND status = 'active';
  
  IF v_today_completions >= v_active_habits_count AND v_active_habits_count > 0 THEN
    v_bonus_xp := v_bonus_xp + 30;
    v_reasons := array_append(v_reasons, 'Todos completados! 🎯 (+30 XP)');
  END IF;
  
  -- Multiplicador de Streak
  IF v_streak >= 90 THEN
    v_multiplier := v_multiplier * 1.5;
    v_reasons := array_append(v_reasons, 'Streak épico 90+! 🔥🔥🔥 (x1.5)');
  ELSIF v_streak >= 30 THEN
    v_multiplier := v_multiplier * 1.25;
    v_reasons := array_append(v_reasons, 'Streak forte 30+! 🔥🔥 (x1.25)');
  ELSIF v_streak >= 7 THEN
    v_multiplier := v_multiplier * 1.1;
    v_reasons := array_append(v_reasons, 'Streak ativo 7+! 🔥 (x1.1)');
  END IF;
  
  -- Multiplicador de Dificuldade (baseado em goal_target)
  IF v_goal_target >= 30 THEN
    v_multiplier := v_multiplier * 1.5;
    v_reasons := array_append(v_reasons, 'Meta difícil! 💪 (x1.5)');
  ELSIF v_goal_target >= 15 THEN
    v_multiplier := v_multiplier * 1.2;
    v_reasons := array_append(v_reasons, 'Meta média (x1.2)');
  END IF;
  
  -- Calcular XP total
  v_total_xp := FLOOR((v_base_xp + v_bonus_xp) * v_multiplier)::INT;
  
  -- Garantir mínimo
  IF v_total_xp < 15 THEN
    v_total_xp := 15;
  END IF;
  
  RAISE NOTICE 'XP Calculado: base=% bonus=% mult=% total=%', v_base_xp, v_bonus_xp, v_multiplier, v_total_xp;
  
  RETURN QUERY SELECT v_total_xp, v_reasons;
  
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Erro ao calcular XP: %', SQLERRM;
  RETURN QUERY SELECT 15::INTEGER, ARRAY['Hábito completado (fallback)']::TEXT[];
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ===== FASE 4: SISTEMA DE PROGRESSÃO AUTOMÁTICA DE BADGES =====
DROP TRIGGER IF EXISTS trigger_update_badge_progress ON habit_completions;
DROP FUNCTION IF EXISTS update_badge_progress();

CREATE OR REPLACE FUNCTION update_badge_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_streak INT;
  v_total_completions INT;
  v_max_habit_completions INT;
BEGIN
  -- Buscar streak do hábito completado
  SELECT COALESCE(streak, 0) INTO v_streak
  FROM habits WHERE id = NEW.habit_id;
  
  -- Contar total de completions do usuário
  SELECT COUNT(*) INTO v_total_completions
  FROM habit_completions
  WHERE user_id = NEW.user_id AND percentage >= 100;
  
  -- Buscar maior número de completions de um único hábito (maestria)
  SELECT COALESCE(MAX(total_completions), 0) INTO v_max_habit_completions
  FROM habits
  WHERE user_id = NEW.user_id;
  
  -- Atualizar badges de STREAK
  UPDATE user_badges ub SET 
    progress = v_streak,
    unlocked = (v_streak >= b.target),
    unlocked_at = CASE 
      WHEN v_streak >= b.target AND ub.unlocked = false 
      THEN NOW() 
      ELSE ub.unlocked_at 
    END
  FROM badges b
  WHERE ub.user_id = NEW.user_id
    AND ub.badge_id = b.id
    AND b.category = 'streak';
  
  -- Atualizar badges de HABITS (total de completions)
  UPDATE user_badges ub SET
    progress = v_total_completions,
    unlocked = (v_total_completions >= b.target),
    unlocked_at = CASE 
      WHEN v_total_completions >= b.target AND ub.unlocked = false 
      THEN NOW() 
      ELSE ub.unlocked_at 
    END
  FROM badges b
  WHERE ub.user_id = NEW.user_id
    AND ub.badge_id = b.id
    AND b.category = 'habits';
  
  -- Atualizar badges de MASTERY (completions de um único hábito)
  UPDATE user_badges ub SET
    progress = v_max_habit_completions,
    unlocked = (v_max_habit_completions >= b.target),
    unlocked_at = CASE 
      WHEN v_max_habit_completions >= b.target AND ub.unlocked = false 
      THEN NOW() 
      ELSE ub.unlocked_at 
    END
  FROM badges b
  WHERE ub.user_id = NEW.user_id
    AND ub.badge_id = b.id
    AND b.category = 'mastery';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_badge_progress
AFTER INSERT ON habit_completions
FOR EACH ROW
EXECUTE FUNCTION update_badge_progress();