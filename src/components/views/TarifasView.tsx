import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { computeRateStatistics, CLINICAL_DISORDERS_LIST } from '../../utils/rbac';
import {
  TrendingUp,
  BarChart3,
  Scale,
  Shield,
  HelpCircle,
  ArrowRight,
  Calculator,
  Users,
  CheckCircle2,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

interface TarifasViewProps {
  psychologists: User[];
  maxSessionLimitUsd: number;
  onNavigate: (section: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  isGuest?: boolean;
  onRequireAuth?: (actionContext: string) => void;
  statsVisibility?: import('../../types').StatsVisibility;
}

export const TarifasView: React.FC<TarifasViewProps> = ({
  psychologists,
  maxSessionLimitUsd,
  onNavigate,
  onOpenBookingModal,
  isGuest = false,
  onRequireAuth,
  statsVisibility = { showMean: true, showMedian: true, showMode: true }
}) => {
  const { showMean, showMedian, showMode } = statsVisibility;
  const [selectedDisorder, setSelectedDisorder] = useState<string>('todos');
  const [calculatorSessions, setCalculatorSessions] = useState<number>(10);
  const [calculatorDisorder, setCalculatorDisorder] = useState<string>('general');

  // Compute live statistics from the community of psychologists
  const rateStatistics = useMemo(() => {
    return computeRateStatistics(psychologists);
  }, [psychologists]);

  const generalStat = rateStatistics.find((s) => s.disorderId === 'general') || {
    disorderId: 'general',
    disorderName: 'Tarifa General por Sesión Clínica',
    clinicalFocus: 'Evaluación funcional inicial, análisis de contingencias e intervención conductual directa.',
    mean: 40,
    median: 40,
    mode: 40,
    count: 3,
    min: 35,
    max: 50,
    sampleRates: [35, 40, 45]
  };

  const disorderStats = rateStatistics.filter((s) => s.disorderId !== 'general');

  const filteredStats = selectedDisorder === 'todos'
    ? disorderStats
    : disorderStats.filter((s) => s.disorderId === selectedDisorder);

  // Selected stat for the calculator
  const selectedCalcStat =
    rateStatistics.find((s) => s.disorderId === calculatorDisorder) || generalStat;

  const handleBookingClick = () => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('agendar una consulta clínica o solicitar valoración');
    } else {
      onOpenBookingModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          Transparencia Deontológica & Estadística Comunitaria
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2A2A2A]">
          Baremos y Estadísticas de Tarifas
        </h1>
        <p className="text-base text-[#2A2A2A]/75 leading-relaxed">
          En <strong>Psicogénesis</strong> las tarifas no son arbitrarias. Se calculan de forma transparente a partir de los baremos reales aprobados a los psicólogos clínicos de nuestra comunidad, regulados bajo un límite ético máximo de <strong>${maxSessionLimitUsd} USD</strong> por sesión.
        </p>
      </div>

      {/* GLOBAL BENCHMARK METRICS (Promedio, Mediana, Moda, Límite Máximo) */}
      <section className="bg-gradient-to-br from-[#4D76B4]/5 via-white to-[#6BD4FF]/10 rounded-3xl border-2 border-[#4D76B4]/30 p-6 sm:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#91A7BB]/20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4D76B4] bg-[#4D76B4]/10 px-2.5 py-1 rounded-md">
              Indicadores Consolidados
            </span>
            <h2 className="text-2xl font-black text-[#2A2A2A] mt-1.5">
              Valores Centrales del Directorio Clínico
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#91A7BB]/30 text-xs text-[#2A2A2A] font-semibold">
            <Users className="w-4 h-4 text-[#4D76B4]" />
            <span>Muestra activa: {generalStat.count} psicólogos colegiados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {/* Card 1: Promedio (Media) */}
          {showMean && (
            <div className="bg-white rounded-2xl p-6 border border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/50 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase tracking-wider">
                <span>Promedio General</span>
                <TrendingUp className="w-4 h-4 text-[#4D76B4]" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#4D76B4]">${generalStat.mean}</span>
                <span className="text-xs font-semibold text-[#91A7BB]">USD</span>
              </div>
              <p className="text-[11px] text-[#2A2A2A]/70 mt-2 leading-relaxed">
                Media aritmética del costo por sesión clínica de 50-60 min en la comunidad.
              </p>
            </div>
          )}

          {/* Card 2: Mediana */}
          {showMedian && (
            <div className="bg-white rounded-2xl p-6 border border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/50 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase tracking-wider">
                <span>Mediana General</span>
                <Scale className="w-4 h-4 text-[#4D94FF]" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#4D94FF]">${generalStat.median}</span>
                <span className="text-xs font-semibold text-[#91A7BB]">USD</span>
              </div>
              <p className="text-[11px] text-[#2A2A2A]/70 mt-2 leading-relaxed">
                Punto medio exacto de la distribución de tarifas (el 50% cobra igual o menos).
              </p>
            </div>
          )}

          {/* Card 3: Moda */}
          {showMode && (
            <div className="bg-white rounded-2xl p-6 border border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/50 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase tracking-wider">
                <span>Moda General</span>
                <BarChart3 className="w-4 h-4 text-[#2A2A2A]" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#2A2A2A]">${generalStat.mode}</span>
                <span className="text-xs font-semibold text-[#91A7BB]">USD</span>
              </div>
              <p className="text-[11px] text-[#2A2A2A]/70 mt-2 leading-relaxed">
                Honorario más recurrente y comúnmente adoptado por los especialistas.
              </p>
            </div>
          )}

          {/* Card 4: Límite Máximo Permitido */}
          <div className="bg-[#FFE571]/20 rounded-2xl p-6 border-2 border-[#FFE571] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">
              <span>Tope Máximo Permitido</span>
              <Shield className="w-4 h-4 text-[#4D76B4]" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#2A2A2A]">${maxSessionLimitUsd}</span>
              <span className="text-xs font-semibold text-[#2A2A2A]/70">USD máx</span>
            </div>
            <p className="text-[11px] text-[#2A2A2A]/80 mt-2 leading-relaxed">
              Límite ético insuperable fijado en panel por la Dirección Clínica de Andrés Rojas.
            </p>
          </div>
        </div>
      </section>

      {/* DISORDER-SPECIFIC BENCHMARKS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2A2A2A]">
              Estadísticas por Trastorno y Problema Psicológico
            </h2>
            <p className="text-xs sm:text-sm text-[#91A7BB] mt-1">
              Compara el promedio, mediana y moda según el tipo de intervención clínica requerida.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDisorder('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDisorder === 'todos'
                  ? 'bg-[#4D76B4] text-white shadow-xs'
                  : 'bg-white border border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-[#91A7BB]/10'
              }`}
            >
              Todos los Trastornos
            </button>
            {CLINICAL_DISORDERS_LIST.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDisorder(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDisorder === d.id
                    ? 'bg-[#4D76B4] text-white shadow-xs font-bold'
                    : 'bg-white border border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-[#91A7BB]/10'
                }`}
              >
                {d.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStats.map((stat) => {
            const percentageOfMax = Math.min(100, Math.round((stat.mean / maxSessionLimitUsd) * 100));

            return (
              <div
                key={stat.disorderId}
                className="bg-white rounded-3xl p-6 border border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4D76B4] bg-[#4D76B4]/10 px-2 py-0.5 rounded-md">
                      {stat.count} Especialistas con Baremo Aprobado
                    </span>
                    <h3 className="text-lg font-bold text-[#2A2A2A] mt-2">
                      {stat.disorderName}
                    </h3>
                  </div>

                  <p className="text-xs text-[#2A2A2A]/75 leading-relaxed bg-[#91A7BB]/10 p-3 rounded-2xl">
                    {stat.clinicalFocus}
                  </p>

                  {/* Metric Pills: Promedio, Mediana, Moda */}
                  <div className="flex flex-wrap gap-2 text-center pt-2">
                    {showMean && (
                      <div className="flex-1 min-w-[70px] bg-[#4D76B4]/5 p-2.5 rounded-xl border border-[#4D76B4]/20">
                        <span className="block text-[10px] font-bold uppercase text-[#4D76B4]">
                          Promedio
                        </span>
                        <span className="text-lg font-black text-[#4D76B4]">${stat.mean}</span>
                      </div>
                    )}

                    {showMedian && (
                      <div className="flex-1 min-w-[70px] bg-[#4D94FF]/5 p-2.5 rounded-xl border border-[#4D94FF]/20">
                        <span className="block text-[10px] font-bold uppercase text-[#4D94FF]">
                          Mediana
                        </span>
                        <span className="text-lg font-black text-[#4D94FF]">${stat.median}</span>
                      </div>
                    )}

                    {showMode && (
                      <div className="flex-1 min-w-[70px] bg-[#FFE571]/20 p-2.5 rounded-xl border border-[#FFE571]">
                        <span className="block text-[10px] font-bold uppercase text-[#2A2A2A]">
                          Moda
                        </span>
                        <span className="text-lg font-black text-[#2A2A2A]">${stat.mode}</span>
                      </div>
                    )}
                  </div>

                  {/* Comparison bar relative to $100 ceiling */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-[#91A7BB] font-semibold">
                      <span>Rango observado: ${stat.min} - ${stat.max} USD</span>
                      <span>Tope: ${maxSessionLimitUsd} USD</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4D76B4] to-[#6BD4FF] rounded-full"
                        style={{ width: `${percentageOfMax}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onNavigate('comunidad')}
                    className="w-full py-2.5 rounded-xl border border-[#4D76B4] text-[#4D76B4] font-bold text-xs hover:bg-[#4D76B4] hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Psicólogos para este caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE BUDGET ESTIMATOR */}
      <section className="bg-gradient-to-r from-[#4D76B4] to-[#3a5d94] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#FFE571] text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Estimador Estadístico de Proceso Terapéutico
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Estimador Estadístico de Inversión Terapéutica
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              En Análisis Funcional de la Conducta y terapias contextuales (ACT, Activación Conductual), los procesos suelen requerir entre 8 y 16 sesiones para lograr autonomía. Calcula la inversión estimada basada en los valores centrales comunitarios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Motivo de Consulta:
                </label>
                <select
                  value={calculatorDisorder}
                  onChange={(e) => setCalculatorDisorder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white text-xs font-bold focus:outline-hidden focus:bg-white focus:text-[#2A2A2A]"
                >
                  <option value="general" className="text-[#2A2A2A]">Tarifa General Estándar</option>
                  {CLINICAL_DISORDERS_LIST.map((d) => (
                    <option key={d.id} value={d.id} className="text-[#2A2A2A]">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Número de Sesiones Estimadas: ({calculatorSessions})
                </label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="1"
                  value={calculatorSessions}
                  onChange={(e) => setCalculatorSessions(Number(e.target.value))}
                  className="w-full accent-[#FFE571] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/70">
                  <span>4 sesiones (evaluación)</span>
                  <span>12 (estándar)</span>
                  <span>20 (complejo)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-[#2A2A2A] rounded-2xl p-6 shadow-xl space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4D76B4] bg-[#4D76B4]/10 px-2 py-0.5 rounded-md">
              Estimación Estadística del Plan
            </span>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline border-b border-[#91A7BB]/20 pb-2">
                <span className="text-xs text-[#91A7BB] font-semibold">Inversión según Promedio:</span>
                <span className="text-2xl font-black text-[#4D76B4]">
                  ${Math.round(selectedCalcStat.mean * calculatorSessions)} USD
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs text-[#2A2A2A]/80">
                <span>Inversión según Mediana:</span>
                <span className="font-bold text-[#4D94FF]">
                  ${Math.round(selectedCalcStat.median * calculatorSessions)} USD
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs text-[#2A2A2A]/80">
                <span>Inversión según Moda:</span>
                <span className="font-bold text-[#2A2A2A]">
                  ${Math.round(selectedCalcStat.mode * calculatorSessions)} USD
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleBookingClick}
                className="w-full py-3 rounded-xl bg-[#FFE571] text-[#2A2A2A] font-black text-xs shadow-md hover:bg-[#ffe04d] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Agendar Primera Sesión de Evaluación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('comunidad')}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#4D76B4] hover:bg-[#4D76B4]/5 transition-colors"
              >
                Ver psicólogos disponibles en Comunidad
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ETHICAL STANDARDS & TRANSPARENCY NOTICE */}
      <div className="bg-[#4D76B4]/5 border border-[#4D76B4]/20 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#4D76B4] text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-[#4D76B4]" />
              Supervisión de Tarifas
            </h4>
            <p className="text-xs text-[#2A2A2A]/80 leading-relaxed">
              Cada psicólogo postula sus honorarios en su perfil de la Comunidad. La Dirección Clínica (Andrés Rojas) aprueba individualmente cada propuesta antes de mostrarse a los consultantes.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#4D76B4] text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-[#4D76B4]" />
              Tope Máximo Modificable
            </h4>
            <p className="text-xs text-[#2A2A2A]/80 leading-relaxed">
              El límite máximo ético actual de ${maxSessionLimitUsd} USD es gestionado centralmente desde el panel de control administrativo para prevenir sobreprecios y garantizar equidad en la atención clínica.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#4D76B4] text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#4D76B4]" />
              Sin Honorarios Ocultos
            </h4>
            <p className="text-xs text-[#2A2A2A]/80 leading-relaxed">
              Cada sesión incluye prescripción de tareas intersesión, registros de conducta y análisis funcional continuo sin recargos administrativos adicionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
