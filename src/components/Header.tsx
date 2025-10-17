import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Nome */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/atom-logo.png" 
              alt="atomicTracker"
              className="w-8 h-8 sm:w-9 sm:h-9 logo-atom"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))'
              }}
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              atomicTracker
            </span>
          </div>

          {/* Desktop: Links de navegação */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-slate-300 hover:text-violet-400 font-medium transition-colors">
              Dashboard
            </a>
            <a href="/habits" className="text-slate-300 hover:text-violet-400 font-medium transition-colors">
              Hábitos
            </a>
            <a href="/reports" className="text-slate-300 hover:text-violet-400 font-medium transition-colors">
              Relatórios
            </a>
          </nav>

          {/* User + Pontos */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-violet-900/30 px-3 py-1.5 rounded-full border border-violet-500/30">
              <span className="text-violet-400 text-sm font-semibold">⭐ 245</span>
            </div>
            <Button 
              variant="default"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-violet-400/50"
            >
              A
            </Button>
          </div>

          {/* Mobile: Menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-violet-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile: Navigation menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-3">
            <div className="flex flex-col gap-2">
              <a href="/dashboard" className="text-slate-300 hover:text-violet-400 font-medium transition-colors px-2 py-2">
                Dashboard
              </a>
              <a href="/habits" className="text-slate-300 hover:text-violet-400 font-medium transition-colors px-2 py-2">
                Hábitos
              </a>
              <a href="/reports" className="text-slate-300 hover:text-violet-400 font-medium transition-colors px-2 py-2">
                Relatórios
              </a>
            </div>
          </nav>
        )}
      </div>

      <style jsx>{`
        .logo-atom {
          transition: all 0.3s ease;
        }
        
        .logo-atom:hover {
          filter: drop-shadow(0 0 16px rgba(124, 58, 237, 0.9));
          transform: scale(1.1) rotate(10deg);
        }
      `}</style>
    </header>
  )
}