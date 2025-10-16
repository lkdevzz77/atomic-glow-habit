import React from "react";
import { HabitFormData } from "../NewHabitModal";

interface Law1StepProps {
  formData: HabitFormData;
  updateFormData: (data: Partial<HabitFormData>) => void;
}

const icons = ["📚", "💪", "🧘", "💧", "✍️", "🎯", "🏃", "🎨", "🎵", "🌱", "⏰", "🔥"];

const Law1Step = ({ formData, updateFormData }: Law1StepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-violet-400 mb-2">
          🎯 Lei #1: TORNE ÓBVIO
        </h2>
        <p className="text-slate-300">Hábitos precisam de gatilhos claros</p>
      </div>

      {/* Nome do hábito */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-2">
          Qual hábito você quer criar?
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Ex: Meditar, Exercitar, Ler, Estudar..."
          className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-700 transition-all duration-200"
        />
      </div>

      {/* Escolha de ícone */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">
          Escolha um ícone:
        </label>
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {icons.map((icon) => (
            <button
              key={icon}
              onClick={() => updateFormData({ icon })}
              className={`w-full aspect-square bg-slate-700 hover:bg-violet-900/50 rounded-xl flex items-center justify-center text-3xl transition-all duration-200 ${
                formData.icon === icon
                  ? "border-2 border-violet-500 bg-violet-900/50 shadow-lg shadow-violet-500/50"
                  : "border-2 border-slate-700"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Quando */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">
          QUANDO você fará esse hábito?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "Manhã", icon: "🌅" },
            { value: "Tarde", icon: "☕" },
            { value: "Noite", icon: "🌆" },
            { value: "Horário específico", icon: "⏰" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateFormData({ when: option.value })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.when === option.value
                  ? "border-violet-500 bg-violet-900/30 shadow-lg shadow-violet-500/30"
                  : "border-slate-700 bg-slate-700 hover:border-violet-500/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm text-slate-200">{option.value}</div>
            </button>
          ))}
        </div>

        {formData.when === "Horário específico" && (
          <input
            type="time"
            value={formData.customTime || ""}
            onChange={(e) => updateFormData({ customTime: e.target.value })}
            className="mt-3 w-full bg-slate-700/50 border border-slate-600 text-slate-50 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
          />
        )}
      </div>

      {/* Onde */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-2">
          📍 ONDE você fará?
        </label>
        <input
          type="text"
          value={formData.where}
          onChange={(e) => updateFormData({ where: e.target.value })}
          placeholder="Ex: Sala, quarto, academia, escritório..."
          className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-700 transition-all duration-200"
        />
      </div>

      {/* Gatilho */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-2">
          ⚡ GATILHO: Logo após qual atividade?
        </label>
        <input
          type="text"
          value={formData.trigger}
          onChange={(e) => updateFormData({ trigger: e.target.value })}
          placeholder="Ex: Tomar café, escovar dentes, fechar notebook..."
          className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-700 transition-all duration-200"
        />
      </div>

      {/* Preview do gatilho */}
      {formData.trigger && formData.title && formData.where && (
        <div className="bg-gradient-to-r from-violet-900/50 to-slate-800 border-l-4 border-violet-500 p-4 rounded-lg animate-slide-in-right">
          <div className="text-sm text-violet-400 font-semibold mb-1">
            📌 Seu gatilho:
          </div>
          <div className="text-slate-50">
            "Logo após <span className="font-semibold text-violet-300">{formData.trigger}</span>,
            vou <span className="font-semibold text-violet-300">{formData.title}</span> na{" "}
            <span className="font-semibold text-violet-300">{formData.where}</span>"
          </div>
        </div>
      )}
    </div>
  );
};

export default Law1Step;
