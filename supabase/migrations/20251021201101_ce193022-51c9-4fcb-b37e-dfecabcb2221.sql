-- Primeiro remover o constraint antigo se existir
ALTER TABLE habits 
DROP CONSTRAINT IF EXISTS habits_status_check;

ALTER TABLE habits 
DROP CONSTRAINT IF EXISTS valid_habit_status;

-- Resetar todos os hábitos para 'active'
UPDATE habits 
SET status = 'active' 
WHERE status NOT IN ('active', 'archived', 'paused');

-- Adicionar novo check constraint para validar status
ALTER TABLE habits 
ADD CONSTRAINT valid_habit_status 
CHECK (status IN ('active', 'archived', 'paused'));