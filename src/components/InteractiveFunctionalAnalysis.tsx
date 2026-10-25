import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';

interface PresetCase {
  label: string;
  antecedent: string;
  response: string;
  responseType: 'Motora' | 'Fisiológica' | 'Cognitiva Encubierta';
  consequence: string;
  functionType: 'Reforzamiento Negativo (Evitación/Escape)' | 'Reforzamiento Positivo' | 'Extinción Operante';
  behavioralAnalysis: string;
  therapeuticIntervention: string;
}

const PRESET_CASES: PresetCase[] = [
  {
    label: 'Caso 1: Ansiedad en Presentaciones (Evitación)',
    antecedent: 'El jefe convoca a una reunión virtual y pide encender la cámara para exponer los resultados del trimestre.',
    response: 'Apagar el micrófono, inventar una falla de conexión en el chat de Slack y no presentar.',
    responseType: 'Motora',
    consequence: 'Alivio fisiológico e inmediato de la taquicardia y desaparición momentánea del miedo al juicio.',
    functionType: 'Reforzamiento Negativo (Evitación/Escape)',
    behavioralAnalysis: 'La conducta de apagar la cámara y mentir es reforzada negativamente al suprimir el estímulo aversivo condicionado (taquicardia / miedo). A largo plazo, previene la habituación y perpetúa el aprendizaje de indefensión.',
    therapeuticIntervention: 'Exposición graduada con Prevención de Respuesta (EPR) y clarificación de valores (ACT) para tolerar el malestar sin emitir escape.'
  },
  {
    label: 'Caso 2: Aislamiento Depresivo (Inercia)',
    antecedent: 'Fin de semana libre en casa, sensación física de pesadez y cansancio tras semana exigente.',
    response: 'Permanecer 3 días en la cama con persianas cerradas y hacer scroll pasivo en el móvil.',
    responseType: 'Motora',
    consequence: 'No confrontar la incertidumbre del mundo exterior, pero extinción masiva de oportunidades de reforzadores naturales.',
    functionType: 'Reforzamiento Negativo (Evitación/Escape)',
    behavioralAnalysis: 'La inactividad funciona como conducta de escape frente a demandas ambientales. Sin embargo, priva al organismo de fuentes contingentes de reforzamiento positivo, intensificando el afecto depresivo.',
    therapeuticIntervention: 'Activación Conductual (BA): Programación estructurada de actividades graduales orientadas al dominio y al agrado.'
  },
  {
    label: 'Caso 3: Rumiación Obsesiva (Control de Pensamientos)',
    antecedent: 'Aparición del pensamiento intrusivo encubierto: "¿Y si no apagué la llave de gas de la cocina?".',
    response: 'Repetir mentalmente 10 veces "todo está bien" y regresar 4 veces a la cocina a inspeccionar la perilla.',
    responseType: 'Cognitiva Encubierta',
    consequence: 'Reducción momentánea de la inquietud subjetiva por 15 minutos.',
    functionType: 'Reforzamiento Negativo (Evitación/Escape)',
    behavioralAnalysis: 'El ritual compulsivo (motor y cognitivo) reduce la activación autonómica de forma contingente e inmediata, reforzando la regla verbal de que el pensamiento es peligroso en sí mismo (fusión cognitiva).',
    therapeuticIntervention: 'Defusión Cognitiva y Exposición con Bloqueo de Rituales (EPR).'
  }
];

export const InteractiveFunctionalAnalysis: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [antecedent, setAntecedent] = useState<string>(PRESET_CASES[0].antecedent);
  const [response, setResponse] = useState<string>(PRESET_CASES[0].response);
  const [responseType, setResponseType] = useState<PresetCase['responseType']>(PRESET_CASES[0].responseType);
  const [consequence, setConsequence] = useState<string>(PRESET_CASES[0].consequence);
  const [analyzed, setAnalyzed] = useState<boolean>(true);

  const currentCase = PRESET_CASES[selectedPresetIndex];

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const p = PRESET_CASES[idx];
    setAntecedent(p.antecedent);
    setResponse(p.response);
    setResponseType(p.responseType);
    setConsequence(p.consequence);
    setAnalyzed(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#91A7BB]/30 shadow-lg p-6 lg:p-8 overflow-hidden relative">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#6BD4FF]/10 to-[#FFE571]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#91A7BB]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Herramienta Clínica Interactiva
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-[#2A2A2A]">
            Mini-Laboratorio de Análisis Funcional de la Conducta (E-R-C)
          </h3>
          <p className="text-sm text-[#2A2A2A]/75 mt-1">
            Comprende cómo los antecedentes y las consecuencias explican el sufrimiento humano según el Conductismo Radical, sin recurrir a mitos mentalistas.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-[#91A7BB]/10 p-1.5 rounded-2xl flex-shrink-0">
          {PRESET_CASES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPresetIndex === idx
                  ? 'bg-[#4D76B4] text-white shadow-sm'
                  : 'text-[#2A2A2A] hover:bg-white/60'
              }`}
            >
              Caso {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the 3 Operant Terms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-6">
        {/* Antecedent */}
        <div className="p-5 rounded-2xl bg-[#91A7BB]/5 border border-[#91A7BB]/25 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              1. Estímulo Antecedente (E / Sᵈ)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] font-medium">
              Contexto
            </span>
          </div>
          <p className="text-sm text-[#2A2A2A] leading-relaxed">
            {antecedent}
          </p>
          <div className="mt-3 text-[11px] text-[#91A7BB] flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-[#4D76B4]" />
            Señala la ocasión para la emisión de la respuesta.
          </div>
        </div>

        {/* Response */}
        <div className="p-5 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/30 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              2. Respuesta Operante (R)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] font-bold">
              {responseType}
            </span>
          </div>
          <p className="text-sm text-[#2A2A2A] font-medium leading-relaxed">
            {response}
          </p>
          <div className="mt-3 text-[11px] text-[#4D76B4] flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            Acción observable o encubierta emitida por el organismo.
          </div>
        </div>

        {/* Consequence */}
        <div className="p-5 rounded-2xl bg-[#91A7BB]/5 border border-[#91A7BB]/25 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              3. Consecuencia Inmediata (C)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6BD4FF]/20 text-[#0074A8] font-semibold">
              Mantenimiento
            </span>
          </div>
          <p className="text-sm text-[#2A2A2A] leading-relaxed">
            {consequence}
          </p>
          <div className="mt-3 text-[11px] text-[#91A7BB] flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-[#4D76B4]" />
            Determina la probabilidad futura de la conducta.
          </div>
        </div>
      </div>

      {/* Clinical Behavioral Synthesis */}
      {analyzed && (
        <div className="mt-6 p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-[#4D76B4]/10 via-[#6BD4FF]/10 to-[#FFE571]/15 border border-[#4D76B4]/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#4D76B4]/15">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4D76B4] flex-shrink-0" />
              <span className="text-sm font-bold text-[#2A2A2A]">
                Función Conductual Identificada:
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#4D76B4] text-white text-xs font-bold">
                {currentCase.functionType}
              </span>
            </div>
            <div className="text-xs font-semibold text-[#4D76B4] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Basado en el Modelo Conductista Radical y RFT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="text-xs font-bold uppercase text-[#4D76B4] mb-1">
                Explicación Funcional de Mantenimiento
              </h5>
              <p className="text-xs lg:text-sm text-[#2A2A2A]/85 leading-relaxed">
                {currentCase.behavioralAnalysis}
              </p>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase text-[#0074A8] mb-1">
                Intervención Basada en Evidencia Recomendada
              </h5>
              <p className="text-xs lg:text-sm text-[#2A2A2A]/85 leading-relaxed">
                {currentCase.therapeuticIntervention}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
