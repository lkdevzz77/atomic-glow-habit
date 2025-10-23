-- Criar RPC para award XP
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id UUID, p_xp_amount INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET xp = xp + p_xp_amount WHERE id = p_user_id;
END;
$$;