import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Target, Sparkles, Rocket, PartyPopper } from "lucide-react";
import Button from "@/components/Button";
import heroAtom from "@/assets/hero-atom.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const laws = [
    {
      icon: Target,
      title: "Torne Óbvio",
      description: "Crie gatilhos claros e impossíveis de ignorar",
      color: "from-violet-600 to-purple-600"
    },
    {
      icon: Sparkles,
      title: "Torne Atraente",
      description: "Faça seus hábitos irresistíveis e prazerosos",
      color: "from-purple-600 to-fuchsia-600"
    },
    {
      icon: Rocket,
      title: "Torne Fácil",
      description: "Comece pequeno com a Regra dos 2 Minutos",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: PartyPopper,
      title: "Torne Satisfatório",
      description: "Celebre cada vitória e construa momentum",
      color: "from-fuchsia-600 to-violet-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-float">⚛️</div>
            <span className="text-2xl font-bold gradient-text">atomicTracker</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/onboarding")}
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">Transforme sua vida</span>
            <br />
            <span className="text-slate-50">1% por dia</span>
            <span className="text-6xl ml-4 inline-block animate-float">⚛️</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Construa hábitos que duram usando as{" "}
            <span className="text-violet-400 font-semibold">4 Leis da Mudança de Comportamento</span>
          </p>

          <div className="pt-6">
            <Button 
              size="xl" 
              onClick={() => navigate("/onboarding")}
              className="group"
            >
              Começar Agora - Grátis
              <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Hero Illustration */}
          <div className="pt-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse-violet" />
              <img 
                src={heroAtom} 
                alt="Atomic Habits Visualization" 
                className="relative w-full h-auto rounded-3xl shadow-2xl shadow-violet-900/50 animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Laws Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="gradient-text">As 4 Leis</span>
        </h2>
        <p className="text-center text-slate-300 text-lg mb-16">
          Cientificamente comprovadas para formar hábitos duradouros
        </p>

        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          {laws.map((law, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20 hover-scale-sm transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${law.color} flex items-center justify-center mb-4 glow-violet`}>
                <law.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">{law.title}</h3>
              <p className="text-slate-300 text-lg">{law.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-violet p-12 rounded-3xl text-center space-y-6 border-2 animate-pulse-violet">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center animate-spin-gradient">
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold gradient-text">
            Seu Coach Pessoal 24/7
          </h2>
          
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Nossa IA analisa seus padrões, detecta obstáculos e otimiza seu sistema 
            automaticamente para maximizar suas chances de sucesso
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass p-12 rounded-3xl text-center border-l-4 border-violet-500">
          <p className="text-2xl md:text-3xl text-slate-200 font-semibold mb-4">
            "1% melhor todo dia = 37x melhor em 1 ano"
          </p>
          <p className="text-lg text-violet-400">— James Clear, Hábitos Atômicos</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 pb-32">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50">
            Pronto para sua transformação?
          </h2>
          <Button 
            size="xl" 
            onClick={() => navigate("/onboarding")}
            className="group animate-pulse-violet"
          >
            Começar Minha Jornada
            <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
