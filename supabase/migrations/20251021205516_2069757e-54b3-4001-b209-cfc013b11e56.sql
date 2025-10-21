-- Verificar e garantir que coluna 'date' seja do tipo DATE (não TIMESTAMP)
-- Isso garante que comparações de data funcionem corretamente sem problemas de timezone

-- A coluna já deve ser DATE, mas vamos garantir
DO $$ 
BEGIN
  -- Verificar tipo atual
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'habit_completions' 
    AND column_name = 'date' 
    AND data_type != 'date'
  ) THEN
    -- Se não for DATE, converter
    ALTER TABLE habit_completions 
    ALTER COLUMN date TYPE DATE USING date::DATE;
    
    RAISE NOTICE 'Coluna date convertida para tipo DATE';
  ELSE
    RAISE NOTICE 'Coluna date já é do tipo DATE - OK';
  END IF;
END $$;