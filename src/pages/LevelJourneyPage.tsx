import React from 'react';
import { useLevel } from '@/hooks/useLevel';
import { getLevelInfo, getAllLevels } from '@/systems/levelSystem';
import { Progress } from '@/components/ui/progress';
import LevelBadge from '@/components/LevelBadge';
import { cn } from '@/lib/utils';
import { Check, Lock, Sparkles, Star, Trophy } from 'lucide-react';
import { ICON_SIZES } from '@/config/iconSizes';
import { useIsMobile } from '@/hooks/use-mobile';

export default function LevelJourneyPage() {
  const { level, xp, currentLevelXP, nextLevelXP, progress, isLoading } = useLevel();
  const currentLevelInfo = getLevelInfo(level);
  const allLevels = getAllLevels();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-card rounded-2xl"></div>
          <div className="h-96 bg-card rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const xpToNext = nextLevelXP - currentLevelXP;

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header com Level Atual */}
      <div className="card-rounded card-padding-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-500/30">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <LevelBadge level={level} size="lg" showTooltip={false} animated />
          
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <p className="text-label text-violet-400">SEU NÍVEL ATUAL</p>
              <h1 className="text-page-title text-white mt-1">
                Nível {level} • {currentLevelInfo.title}
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-violet-300 font-semibold">{currentLevelXP} XP</span>
                <span className="text-violet-400/70">{nextLevelXP} XP</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-violet-300">
                {xpToNext} XP para o próximo nível
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Desbloqueados */}
      {currentLevelInfo.perks.length > 0 && (
        <div className="card-rounded card-padding bg-card border-2 border-border">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-amber-500" size={ICON_SIZES.lg} />
            <h2 className="text-section-title">Benefícios Desbloqueados</h2>
          </div>
          <ul className="space-y-2">
            {currentLevelInfo.perks.map((perk, index) => (
              <li key={index} className="flex items-start gap-2 text-body">
                <Check className="text-emerald-500 flex-shrink-0 mt-0.5" size={ICON_SIZES.md} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline de Níveis */}
      <div className="card-rounded card-padding bg-card border-2 border-border">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-violet-400" size={ICON_SIZES.lg} />
          <h2 className="text-section-title">Jornada de Níveis</h2>
        </div>

        <div className="space-y-6">
          {allLevels.map((lvl) => {
            const lvlInfo = getLevelInfo(lvl);
            const Icon = lvlInfo.icon;
            const isCompleted = lvl < level;
            const isCurrent = lvl === level;
            const isLocked = lvl > level;

            return (
              <div
                key={lvl}
                className={cn(
                  'relative pb-6 border-l-2',
                  isMobile ? 'pl-8' : 'pl-12',
                  isCompleted && 'border-emerald-500',
                  isCurrent && 'border-violet-500',
                  isLocked && 'border-border opacity-50'
                )}
              >
                {/* Badge do nível na linha - Compact on mobile */}
                <div className="absolute left-0 top-0 -translate-x-1/2">
                  <div className={cn(
                    'rounded-full flex items-center justify-center border-2',
                    isMobile ? 'w-8 h-8' : 'w-10 h-10',
                    isCompleted && 'bg-emerald-500 border-emerald-400',
                    isCurrent && 'bg-gradient-to-br from-violet-500 to-purple-600 border-violet-400 animate-pulse',
                    isLocked && 'bg-card border-border'
                  )}>
                    {isCompleted && <Check className="text-white" size={isMobile ? 16 : ICON_SIZES.md} />}
                    {isCurrent && <Icon size={isMobile ? 16 : ICON_SIZES.md} className="text-white" />}
                    {isLocked && <Lock className="text-muted-foreground" size={isMobile ? 16 : ICON_SIZES.md} />}
                  </div>
                </div>

                {/* Indicador "VOCÊ ESTÁ AQUI" */}
                {isCurrent && (
                  <div className="absolute -left-2 top-12 px-2 py-1 bg-violet-500 text-white text-xs font-bold rounded animate-pulse">
                    ← VOCÊ ESTÁ AQUI
                  </div>
                )}

                {/* Conteúdo do nível */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      'text-card-title',
                      isCurrent && 'text-violet-400'
                    )}>
                      Nível {lvl} • {lvlInfo.title}
                    </h3>
                    {isCompleted && (
                      <Star className="text-amber-500 fill-amber-500" size={ICON_SIZES.sm} />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {lvlInfo.minXP} - {lvlInfo.maxXP} XP
                  </p>

                  {lvlInfo.perks.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-label text-xs">Benefícios:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {lvlInfo.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-violet-400">•</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-rounded card-padding bg-card border-2 border-border">
          <p className="text-label mb-2">TOTAL DE XP</p>
          <p className="text-stat-value text-violet-400">{xp.toLocaleString()}</p>
        </div>

        <div className="card-rounded card-padding bg-card border-2 border-border">
          <p className="text-label mb-2">PRÓXIMO NÍVEL</p>
          <p className="text-stat-value">Nível {level + 1}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {getLevelInfo(level + 1).title}
          </p>
        </div>
      </div>
    </div>
  );
}
