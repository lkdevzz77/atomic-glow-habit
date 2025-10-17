import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";

const Step1Welcome = () => {
  const { user } = useAuth();
  const { updateOnboardingData } = useApp();
  
  // Set user's name from auth context when component mounts
  React.useEffect(() => {
    if (user?.user_metadata?.name) {
      updateOnboardingData({ name: user.user_metadata.name });
    }
  }, [user, updateOnboardingData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-slate-50">
          Transforme sua vida com
        </h1>
        <h2 className="text-5xl font-bold gradient-text flex items-center justify-center gap-3">
          pequenos hábitos
          <img
            src="/atom-logo.png"
            alt=""
            className="w-16 h-16 animate-float"
            style={{
              filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))"
            }}
          />
        </h2>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-slate-50 mb-6 text-center">
          {user?.user_metadata?.name ? (
            <>Olá, {user.user_metadata.name}! 👋</>
          ) : (
            <>Olá! 👋</>
          )}
        </h3>

        <div className="flex items-start gap-3 bg-slate-800 border-l-4 border-violet-500 rounded-lg p-4">
          <span className="text-2xl">💡</span>
          <p className="text-slate-300">
            Vamos começar sua jornada de transformação através de pequenos hábitos diários.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Welcome;
