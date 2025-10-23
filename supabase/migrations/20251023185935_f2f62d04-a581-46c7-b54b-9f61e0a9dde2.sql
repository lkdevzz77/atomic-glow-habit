-- Renomear badges para tema atômico
-- Streak Badges (científico progressivo)
UPDATE badges SET 
  name = 'Próton Iniciante',
  icon = '⚛️',
  description = 'Complete 3 dias consecutivos de hábitos. Todo grande átomo começa com um próton.'
WHERE id = 'streak_3';

UPDATE badges SET 
  name = 'Nêutron Estável',
  icon = '🔵',
  description = 'Alcance 7 dias de sequência. Você está equilibrando seu núcleo atômico.'
WHERE id = 'streak_7';

UPDATE badges SET 
  name = 'Elétron Orbital',
  icon = '⚡',
  description = 'Mantenha 14 dias de consistência. Seus elétrons estão orbitando perfeitamente.'
WHERE id = 'streak_14';

UPDATE badges SET 
  name = 'Molécula Formada',
  icon = '🧬',
  description = 'Complete 21 dias de hábitos. Você formou sua primeira molécula de disciplina.'
WHERE id = 'streak_21';

UPDATE badges SET 
  name = 'Composto Estável',
  icon = '💎',
  description = '30 dias de sequência perfeita. Seu composto atômico está cristalizado.'
WHERE id = 'streak_30';

UPDATE badges SET 
  name = 'Cristal de Diamante',
  icon = '💠',
  description = '60 dias de disciplina atômica. Você é duro como diamante.'
WHERE id = 'streak_60';

UPDATE badges SET 
  name = 'Reação em Cadeia',
  icon = '🔷',
  description = '90 dias consecutivos. Sua reação atômica é imparável.'
WHERE id = 'streak_90';

UPDATE badges SET 
  name = 'Fusão Nuclear',
  icon = '💥',
  description = '180 dias de maestria. Você alcançou a fusão nuclear de hábitos.'
WHERE id = 'streak_180';

UPDATE badges SET 
  name = 'Supernova',
  icon = '✨',
  description = '365 dias de consistência absoluta. Você explodiu em luz própria!'
WHERE id = 'streak_365';

-- Habits Badges (experimentação científica)
UPDATE badges SET 
  name = 'Experimentador Curioso',
  icon = '🔬',
  description = 'Complete 10 hábitos no total. Todo cientista começa experimentando.'
WHERE id = 'habits_10';

UPDATE badges SET 
  name = 'Observador Sistemático',
  icon = '🧪',
  description = 'Complete 50 hábitos. Você observa padrões com precisão científica.'
WHERE id = 'habits_50';

UPDATE badges SET 
  name = 'Cientista Dedicado',
  icon = '👨‍🔬',
  description = '100 hábitos completados. Você domina o método científico da disciplina.'
WHERE id = 'habits_100';

UPDATE badges SET 
  name = 'Nobel da Consistência',
  icon = '🏆',
  description = '500 hábitos completados. Você merece o Nobel de Hábitos Atômicos!'
WHERE id = 'habits_500';

-- Identity Badges (transformação molecular)
UPDATE badges SET 
  name = 'Catalisador',
  icon = '⚗️',
  description = 'Complete 3 hábitos de identidade. Você catalisa sua própria transformação.'
WHERE id = 'identity_3';

UPDATE badges SET 
  name = 'Sintetizador',
  icon = '🧬',
  description = '10 hábitos de identidade completados. Você sintetiza sua nova personalidade.'
WHERE id = 'identity_10';

UPDATE badges SET 
  name = 'Transmutado',
  icon = '🔮',
  description = '30 hábitos de identidade. Você transmutou sua essência completamente.'
WHERE id = 'identity_30';

-- Mastery Badges (maestria atômica)
UPDATE badges SET 
  name = 'Átomo Focado',
  icon = '🎯',
  description = 'Complete um hábito 100 vezes. Você dominou um único átomo de disciplina.'
WHERE id = 'mastery_100';

UPDATE badges SET 
  name = 'Molécula Refinada',
  icon = '💎',
  description = 'Complete um hábito 365 vezes. Você refinou sua molécula à perfeição.'
WHERE id = 'mastery_365';

UPDATE badges SET 
  name = 'Maestria Absoluta',
  icon = '👑',
  description = 'Complete um hábito 1000 vezes. Você alcançou a maestria atômica absoluta.'
WHERE id = 'mastery_1000';

-- Special Badges (eventos únicos)
UPDATE badges SET 
  name = 'Alvorada Atômica',
  icon = '🌅',
  description = 'Complete seu primeiro hábito. Todo átomo começa com uma partícula.'
WHERE id = 'first_habit';

UPDATE badges SET 
  name = 'Ciclo Perfeito',
  icon = '⭕',
  description = 'Complete todos os hábitos do dia. Seu ciclo orbital está perfeito.'
WHERE id = 'perfect_day';

UPDATE badges SET 
  name = 'Reversão Temporal',
  icon = '⏮️',
  description = 'Use a função de desfazer pela primeira vez. Até cientistas refazem experimentos.'
WHERE id = 'first_undo';

UPDATE badges SET 
  name = 'Regeneração Quântica',
  icon = '🔄',
  description = 'Recupere-se de uma quebra de streak. A física quântica permite segundas chances.'
WHERE id = 'recovery';

UPDATE badges SET 
  name = 'Órbita Noturna',
  icon = '🌙',
  description = 'Complete um hábito após 22h. Seus elétrons orbitam até de noite.'
WHERE id = 'night_owl';

UPDATE badges SET 
  name = 'Cadeia Atômica',
  icon = '⛓️',
  description = 'Crie uma cadeia de hábitos (habit stacking). Você domina ligações covalentes.'
WHERE id = 'habit_chain';