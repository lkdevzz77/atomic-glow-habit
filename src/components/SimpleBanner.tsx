import React from 'react';

interface SimpleBannerProps {
  userName: string;
  dateString: string;
  completedToday: number;
  totalToday: number;
  completionRate: number;
}

const SimpleBanner: React.FC<SimpleBannerProps> = ({
  userName,
  dateString,
  completedToday,
  totalToday,
  completionRate,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-2">
        {getGreeting()}, {userName}! 👋
      </h1>
      <p className="text-slate-400 mb-4">{dateString}</p>
      
      <div className="mb-2">
        <div className="flex justify-between items-center text-slate-300 text-sm mb-2">
          <span>Progresso do Dia</span>
          <span className="font-semibold">{completedToday}/{totalToday} Completos</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleBanner;
