-- Adicionar coluna identity_goal aos hábitos para sistema de "Identity Votes"
ALTER TABLE public.habits 
ADD COLUMN IF NOT EXISTS identity_goal text;

COMMENT ON COLUMN public.habits.identity_goal IS 'A identidade que o usuário quer construir com este hábito (ex: "pessoa que lê", "pessoa saudável")';

-- Atualizar hábitos existentes com identidades padrão baseadas no título
UPDATE public.habits 
SET identity_goal = CASE
  WHEN title ILIKE '%ler%' OR title ILIKE '%livro%' THEN 'pessoa que aprende constantemente'
  WHEN title ILIKE '%exerc%' OR title ILIKE '%treino%' OR title ILIKE '%academia%' THEN 'pessoa saudável e ativa'
  WHEN title ILIKE '%medita%' THEN 'pessoa equilibrada e consciente'
  WHEN title ILIKE '%estud%' THEN 'pessoa dedicada ao conhecimento'
  WHEN title ILIKE '%escrev%' THEN 'pessoa criativa e expressiva'
  ELSE 'pessoa disciplinada e consistente'
END
WHERE identity_goal IS NULL;