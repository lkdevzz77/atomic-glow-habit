import React, { useState } from 'react';
import { CheckCircle, Search, GripVertical, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HabitCardCompact from '../HabitCardCompact';
import confetti from 'canvas-confetti';

interface Habit {
  id: number;
  title: string;
  icon: string;
  status: string;
  streak: number;
  where_location: string;
  when_time: string;
  goal_current: number;
  goal_target: number;
  goal_unit: string;
  completedToday?: boolean;
}

interface KanbanViewProps {
  habits: Habit[];
  onComplete: (habitId: number) => void;
  onAddHabit?: () => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ habits, onComplete, onAddHabit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [completingId, setCompletingId] = useState<number | null>(null);

  const handleComplete = (habitId: number) => {
    setCompletingId(habitId);
    
    // Mini confetti animation
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#8b5cf6', '#a78bfa', '#c4b5fd']
    });
    
    // Slight delay for visual feedback
    setTimeout(() => {
      onComplete(habitId);
      setCompletingId(null);
    }, 300);
  };
  
  // Filtrar hábitos baseado em completedToday
  const filteredHabits = habits.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pendingHabits = filteredHabits.filter(h => !h.completedToday);
  const completedHabits = filteredHabits.filter(h => h.completedToday);

  const completionPercentage = habits.length > 0 
    ? Math.round((completedHabits.length / habits.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-700/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-50">
              {completedHabits.length}/{habits.length} Completados
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {completionPercentage}% do progresso diário
            </p>
          </div>
          {completionPercentage === 100 && habits.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl"
            >
              🎉
            </motion.div>
          )}
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Search Bar */}
      {habits.length > 3 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar hábitos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Column */}
        <motion.div 
          layout
          className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-50">Pendentes</h2>
            </div>
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-semibold text-slate-300">
              {pendingHabits.length}
            </span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {pendingHabits.length > 0 ? (
              <div className="space-y-3">
                {pendingHabits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative"
                  >
                    <HabitCardCompact
                      habit={habit}
                      onComplete={() => handleComplete(habit.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  Tudo pronto! 🎉
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">
                  Você completou todos os hábitos de hoje. Continue assim!
                </p>
                {onAddHabit && (
                  <button 
                    onClick={onAddHabit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Mais Hábitos
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Completed Column */}
        <motion.div 
          layout
          className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-bold text-slate-50">Completados</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-xs font-semibold text-emerald-400">
              {completedHabits.length}
            </span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {completedHabits.length > 0 ? (
              <div className="space-y-3">
                {completedHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <HabitCardCompact habit={habit} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="text-6xl mb-4 opacity-30">📋</div>
                <p className="text-slate-500 text-sm">
                  Nenhum hábito completado ainda
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default KanbanView;
