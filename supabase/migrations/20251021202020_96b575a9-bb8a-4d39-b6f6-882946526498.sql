-- Converter ícones emoji para nomes Lucide
UPDATE habits SET icon = 'BookOpen' WHERE icon = '📚';
UPDATE habits SET icon = 'Dumbbell' WHERE icon = '💪';
UPDATE habits SET icon = 'Brain' WHERE icon = '🧠';
UPDATE habits SET icon = 'Heart' WHERE icon = '❤️' OR icon = '♥️';
UPDATE habits SET icon = 'Droplet' WHERE icon = '💧';
UPDATE habits SET icon = 'Utensils' WHERE icon = '🍽️';
UPDATE habits SET icon = 'Moon' WHERE icon = '🌙';
UPDATE habits SET icon = 'Sun' WHERE icon = '☀️' OR icon = '🌞';
UPDATE habits SET icon = 'Target' WHERE icon = '🎯';
UPDATE habits SET icon = 'Zap' WHERE icon = '⚡';
UPDATE habits SET icon = 'Award' WHERE icon = '🏆';
UPDATE habits SET icon = 'Coffee' WHERE icon = '☕';

-- Para ícones que não correspondem a nenhum emoji conhecido, manter o atom como padrão
UPDATE habits SET icon = 'Atom' WHERE icon = '⚛️' OR icon NOT IN (
  'BookOpen', 'Dumbbell', 'Brain', 'Heart', 'Droplet', 'Utensils', 
  'Moon', 'Sun', 'Target', 'Zap', 'Award', 'Coffee'
);