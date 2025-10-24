-- Adicionar política RLS para permitir que usuários deletem suas próprias completions
CREATE POLICY "Users can delete their own completions"
ON public.habit_completions
FOR DELETE
USING (auth.uid() = user_id);