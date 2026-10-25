import React, { useState } from 'react';
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Shield,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { User, ProblemRate } from '../types';
import { CLINICAL_DISORDERS_LIST, validateRateWithinLimit } from '../utils/rbac';

interface PsychologistRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  psychologist: User;
  maxSessionLimitUsd: number;
  onSubmitRates: (ratesData: {
    baseRateUsd: number;
    problemRates: ProblemRate[];
    proposalNote: string;
  }) => void;
}

export const PsychologistRatesModal: React.FC<PsychologistRatesModalProps> = ({
  isOpen,
  onClose,
  psychologist,
  maxSessionLimitUsd,
  onSubmitRates
}) => {
  const [baseRate, setBaseRate] = useState<number>(
    psychologist.pendingProposedRateUsd || psychologist.sessionRateUsd || 40
  );

  // Initialize disorder rates from existing psychologist problem rates or defaults
  const [disorderRates, setDisorderRates] = useState<{ [disorderName: string]: number }>(() => {
    const initialMap: { [disorderName: string]: number } = {};
    const existing = psychologist.pendingProblemRates || psychologist.problemRates || [];

    for (const d of CLINICAL_DISORDERS_LIST) {
      const match = existing.find(
        (er) =>
          er.disorder.toLowerCase().includes(d.id) ||
          er.disorder.toLowerCase().includes(d.name.toLowerCase().split(' ')[0])
      );
      initialMap[d.name] = match ? match.priceUsd : (psychologist.sessionRateUsd || 40);
    }
    return initialMap;
  });

  const [proposalNote, setProposalNote] = useState(psychologist.rateNote || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDisorderRateChange = (disorderName: string, value: number) => {
    setDisorderRates((prev) => ({
      ...prev,
      [disorderName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check base rate
    const baseValidation = validateRateWithinLimit(baseRate, maxSessionLimitUsd);
    if (!baseValidation.isValid) {
      setErrorMessage(baseValidation.error || 'Tarifa base inválida');
      return;
    }

    // Check disorder rates
    for (const [name, price] of Object.entries(disorderRates)) {
      const val = validateRateWithinLimit(price, maxSessionLimitUsd);
      if (!val.isValid) {
        setErrorMessage(`Error en "${name}": ${val.error}`);
        return;
      }
    }

    const problemRatesList: ProblemRate[] = Object.entries(disorderRates).map(([name, price]) => ({
      disorder: name,
      priceUsd: price
    }));

    onSubmitRates({
      baseRateUsd: baseRate,
      problemRates: problemRatesList,
      proposalNote: proposalNote.trim()
    });

    onClose();
  };

  const isOverLimit = baseRate > maxSessionLimitUsd || Object.values(disorderRates).some((p) => p > maxSessionLimitUsd);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#91A7BB] hover:text-[#2A2A2A] p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" />
            Configuración de Baremos y Honorarios Profesionales
          </div>
          <h3 className="text-2xl font-black text-[#2A2A2A]">
            Postulación de Tarifas Clínicas
          </h3>
          <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
            Como psicólogo colegiado ({psychologist.name} • FPV {psychologist.fpvNumber}), puedes establecer tus honorarios profesionales. Toda tarifa enviada pasará a revisión por el <strong>Fundador (Lic. Andrés Rojas)</strong> en el panel de control administrativo antes de publicarse.
          </p>
        </div>

        {/* Max session ceiling alert */}
        <div className="p-4 rounded-2xl bg-[#FFE571]/20 border border-[#FFE571] flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#4D76B4] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#2A2A2A] space-y-1">
            <strong className="block font-bold">Límite Ético Máximo de la Plataforma: ${maxSessionLimitUsd} USD / sesión</strong>
            <span>
              Ningún honorario individual puede exceder los <strong>${maxSessionLimitUsd} USD</strong> por sesión de 50-60 minutos, garantizando accesibilidad y apego deontológico.
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base rate */}
          <div className="bg-[#4D76B4]/5 p-5 rounded-2xl border border-[#4D76B4]/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">
                Tarifa General por Sesión Estándar (USD) *
              </label>
              <span className="text-[11px] text-[#91A7BB]">50-60 min</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#4D76B4]">
                  $
                </span>
                <input
                  type="number"
                  min="5"
                  max={maxSessionLimitUsd}
                  required
                  value={baseRate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBaseRate(val);
                    if (val > maxSessionLimitUsd) {
                      setErrorMessage(`La tarifa de $${val} supera el límite máximo de $${maxSessionLimitUsd} USD.`);
                    } else {
                      setErrorMessage(null);
                    }
                  }}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-bold bg-white focus:outline-hidden ${
                    baseRate > maxSessionLimitUsd
                      ? 'border-red-500 text-red-600 focus:border-red-500'
                      : 'border-[#91A7BB]/40 text-[#2A2A2A] focus:border-[#4D76B4]'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-[#91A7BB]">USD / sesión</span>
            </div>
          </div>

          {/* Specific disorder rates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
                Tarifas por Trastorno y Problema Específico
              </h4>
              <span className="text-[11px] text-[#91A7BB]">
                Permite a los consultantes conocer el baremo según complejidad
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CLINICAL_DISORDERS_LIST.map((disorder) => {
                const currentPrice = disorderRates[disorder.name] || baseRate;
                const isOver = currentPrice > maxSessionLimitUsd;

                return (
                  <div
                    key={disorder.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isOver
                        ? 'bg-red-50/50 border-red-300'
                        : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
                    }`}
                  >
                    <label className="block text-xs font-bold text-[#2A2A2A] truncate">
                      {disorder.name}
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4D76B4]">
                          $
                        </span>
                        <input
                          type="number"
                          min="5"
                          max={maxSessionLimitUsd}
                          value={currentPrice}
                          onChange={(e) =>
                            handleDisorderRateChange(disorder.name, Number(e.target.value))
                          }
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#91A7BB]/30 text-xs font-bold text-[#2A2A2A] focus:outline-hidden focus:border-[#4D76B4]"
                        />
                      </div>
                      <span className="text-[11px] text-[#91A7BB] whitespace-nowrap">USD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Justification note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A2A2A]">
              Nota Justificativa para el SuperAdmin (Opcional):
            </label>
            <input
              type="text"
              value={proposalNote}
              onChange={(e) => setProposalNote(e.target.value)}
              placeholder="Ej. Baremos actualizados con base en horas de formación clínica especializada y supervisión de casos."
              className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#2A2A2A] hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isOverLimit}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                isOverLimit
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#4D76B4] text-white hover:bg-[#3d629a]'
              }`}
            >
              Enviar Tarifas para Aprobación del Fundador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
