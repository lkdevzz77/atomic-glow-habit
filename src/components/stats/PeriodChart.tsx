import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Bar, BarChart } from 'recharts';
import { motion } from 'framer-motion';
import { usePeriodStats } from '@/hooks/usePeriodStats';
import { useIsMobile } from '@/hooks/use-mobile';
import PeriodFilter, { PeriodType } from './PeriodFilter';
import { TrendingUp } from 'lucide-react';

const PeriodChart = () => {
  const [period, setPeriod] = useState<PeriodType>('14d');
  const { data: stats, isLoading } = usePeriodStats(period);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="neuro-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-48 mb-6"></div>
        <div className="h-64 bg-slate-800 rounded mb-6"></div>
      </div>
    );
  }

  if (!stats) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border-2 border-violet-500 rounded-lg p-3 shadow-xl">
          <p className="text-slate-50 font-semibold mb-1">{data.label}</p>
          <p className="text-violet-400 text-sm">
            {data.completed}/{data.total} hábitos
          </p>
          <p className="text-slate-300 text-sm font-bold">
            {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neuro-card rounded-2xl p-4 sm:p-6">
      {/* Header com filtro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          Evolução no Tempo
        </h3>
        <PeriodFilter selectedPeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* Gráfico com animação */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-slate-800/40 rounded-xl p-4 sm:p-6 border border-slate-700/80">
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 240}>
            <BarChart data={stats.data}>
              <XAxis
                dataKey="label"
                stroke="#cbd5e1"
                tick={{
                  fill: '#cbd5e1',
                  fontSize: isMobile ? 9 : 11
                }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
                axisLine={{ stroke: '#475569' }}
              />
              <YAxis
                stroke="#cbd5e1"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                axisLine={{ stroke: '#475569' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} />
              <Bar dataKey="completed" radius={[8, 8, 0, 0]} maxBarSize={40}>
                {stats.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isToday
                        ? '#a78bfa'
                        : entry.percentage >= 80
                        ? '#7c3aed'
                        : entry.percentage >= 50
                        ? '#a78bfa'
                        : entry.percentage > 0
                        ? '#f59e0b'
                        : '#475569'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas do período */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/80">
            <p className="text-xs text-slate-400 mb-1">Taxa Média</p>
            <p className="text-2xl font-bold text-violet-400">{stats.averagePercentage}%</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/80">
            <p className="text-xs text-slate-400 mb-1">Melhor Período</p>
            <p className="text-lg font-bold text-emerald-400">{stats.bestPeriod.label}</p>
            <p className="text-xs text-slate-500">{stats.bestPeriod.percentage}%</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/80">
            <p className="text-xs text-slate-400 mb-1">Precisa Atenção</p>
            <p className="text-lg font-bold text-amber-400">{stats.worstPeriod.label}</p>
            <p className="text-xs text-slate-500">{stats.worstPeriod.percentage}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PeriodChart;
