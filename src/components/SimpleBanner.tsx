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
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 h-12">
        <div className="text-sm text-slate-400">
          {getGreeting()}, {userName} • {dateString}
        </div>
        <div className="text-sm font-semibold text-slate-300">
          {completedToday}/{totalToday} hoje ({completionRate}%)
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-800 mt-2">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
};

export default SimpleBanner;
