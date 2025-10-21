import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { calculateLevel, checkLevelUp, type LevelUpResult } from '@/systems/levelSystem';
import { toast } from 'sonner';

export function useLevel() {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAwarding, setIsAwarding] = useState(false);

  useEffect(() => {
    if (user) {
      fetchXP();
    }
  }, [user]);

  const fetchXP = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setXp(data.xp || 0);
    } catch (error) {
      console.error('Error fetching XP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const awardXP = async (amount: number, reason: string): Promise<LevelUpResult> => {
    if (!user) return { didLevelUp: false };
    
    setIsAwarding(true);
    const oldXP = xp;
    const newXP = oldXP + amount;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', user.id);

      if (error) throw error;
      
      setXp(newXP);
      const levelUpResult = checkLevelUp(oldXP, newXP);
      
      if (!levelUpResult.didLevelUp) {
        toast.success(`+${amount} XP`, {
          description: reason,
        });
      }
      
      return levelUpResult;
    } catch (error) {
      console.error('Error awarding XP:', error);
      toast.error('Erro ao adicionar XP');
      return { didLevelUp: false };
    } finally {
      setIsAwarding(false);
    }
  };

  const levelData = calculateLevel(xp);

  return {
    xp,
    level: levelData.level,
    levelInfo: levelData.levelInfo,
    progress: levelData.percentage,
    currentLevelXP: levelData.currentLevelXP,
    nextLevelXP: levelData.nextLevelXP,
    isLoading,
    isAwarding,
    awardXP,
    refetch: fetchXP,
  };
}
