import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  progress?: number
}

export function LoadingScreen({ progress = 60 }: LoadingScreenProps) {
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    setProgressValue(progress)
  }, [progress])

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <img 
          src="/atom-logo.png" 
          alt="atomicTracker"
          className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.8))',
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        />
        <h2 className="text-xl sm:text-2xl font-bold text-violet-400 mb-2">
          atomicTracker
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-6">
          Carregando sua jornada...
        </p>
        
        {/* Progress bar */}
        <div className="w-48 sm:w-64 mx-auto">
          <Progress value={progressValue} className="h-1.5 bg-slate-800" />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.6));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(124, 58, 237, 1));
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}