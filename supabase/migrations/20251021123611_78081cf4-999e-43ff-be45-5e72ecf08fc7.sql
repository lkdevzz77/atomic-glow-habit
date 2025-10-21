-- Add XP and level fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Migrate existing points to XP (1:1 conversion)
UPDATE public.profiles SET xp = points WHERE xp = 0;

-- Calculate level based on XP
UPDATE public.profiles SET level = 
  CASE 
    WHEN xp >= 20000 THEN 10
    WHEN xp >= 10000 THEN 9
    WHEN xp >= 6000 THEN 8
    WHEN xp >= 3500 THEN 7
    WHEN xp >= 2000 THEN 6
    WHEN xp >= 1000 THEN 5
    WHEN xp >= 500 THEN 4
    WHEN xp >= 250 THEN 3
    WHEN xp >= 100 THEN 2
    ELSE 1
  END;

-- Create function to automatically update level when XP changes
CREATE OR REPLACE FUNCTION public.update_level_from_xp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Create trigger to auto-update level
DROP TRIGGER IF EXISTS on_xp_change_update_level ON public.profiles;
CREATE TRIGGER on_xp_change_update_level
  BEFORE UPDATE OF xp ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_level_from_xp();