import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; className?: string },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; className?: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={cn(
          'min-h-[400px] flex flex-col items-center justify-center p-8 text-center',
          'bg-slate-900/50 rounded-lg border-2 border-slate-800',
          this.props.className
        )}>
          <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" strokeWidth={1.5} />
          
          <h2 className="text-xl font-semibold text-slate-200 mb-2">
            Ops! Algo deu errado
          </h2>
          
          <p className="text-slate-400 mb-6 max-w-md">
            Desculpe pelo inconveniente. Você pode tentar recarregar a página ou voltar
            para a tela inicial.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <pre className="mb-6 p-4 bg-slate-900 rounded text-left text-xs text-slate-400 max-w-md overflow-auto">
              {this.state.error?.toString()}
            </pre>
          )}

          <div className="flex gap-4">
            <button
              onClick={this.handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
            >
              <RefreshCcw size={18} />
              <span>Recarregar página</span>
            </button>
            
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-violet-500 text-slate-300 transition-colors"
            >
              <Home size={18} />
              <span>Voltar ao início</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}