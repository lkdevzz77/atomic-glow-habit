import React, { useState, useRef, useEffect } from 'react';
import { Target, List, Columns3 } from 'lucide-react';

type ViewType = 'focus' | 'list' | 'kanban';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const views = [
    { type: 'focus' as ViewType, icon: Target, label: 'Foco' },
    { type: 'list' as ViewType, icon: List, label: 'Lista' },
    { type: 'kanban' as ViewType, icon: Columns3, label: 'Kanban' },
  ];

  const currentViewData = views.find(v => v.type === currentView);
  const CurrentIcon = currentViewData?.icon || Target;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-all duration-200"
      >
        <CurrentIcon className="w-4 h-4 text-slate-300" />
        <span className="hidden sm:inline text-sm font-medium text-slate-300">
          {currentViewData?.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.type}
                onClick={() => {
                  onViewChange(view.type);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  currentView === view.type
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{view.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewToggle;
