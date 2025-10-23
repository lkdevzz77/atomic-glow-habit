import i18n from '@/i18n/config';

export function getLevelTitle(level: number): string {
  const key = `levels.${level}`;
  const translation = i18n.t(key);
  
  // Fallback for levels not in translation files
  if (translation === key) {
    const defaultTitles: Record<number, string> = {
      1: "Próton Iniciante",
      2: "Elétron Curioso",
      3: "Átomo Formador",
      4: "Molécula Ativa",
      5: "Composto Estável",
      6: "Cristal Organizado",
      7: "Reator Controlado",
      8: "Fusão Nuclear",
      9: "Supernova Radiante",
      10: "Estrela de Nêutrons"
    };
    return defaultTitles[level] || `Nível ${level}`;
  }
  
  return translation;
}
