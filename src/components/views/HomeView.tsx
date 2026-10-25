import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { InteractiveFunctionalAnalysis } from '../InteractiveFunctionalAnalysis';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Activity,
  HeartHandshake,
  Compass,
  FileText,
  Users
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (section: string) => void;
  onOpenBookingModal: () => void;
  brandConfig?: import('../../types').SiteBrandConfig;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenBookingModal,
  brandConfig
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 lg:pt-16 pb-12 bg-gradient-to-b from-white via-[#4D76B4]/5 to-white">
        {/* Decorative background shapes adhering to circular identity manual style */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#6BD4FF]/10 via-[#FFE571]/15 to-[#4D76B4]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Credential Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#4D76B4]/30 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-[#4D76B4]" />
                <span className="text-xs font-bold text-[#4D76B4] uppercase tracking-wider">
                  Psicología Clínica Basada en Evidencia
                </span>
                <span className="text-[#91A7BB]">•</span>
                <span className="text-xs font-bold text-[#2A2A2A] bg-[#FFE571] px-2.5 py-0.5 rounded-full">
                  Análisis de la Conducta
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2A2A2A] tracking-tight leading-[1.15]">
                Ciencia de la Conducta para una vida con{' '}
                <span className="text-[#4D76B4] relative inline-block">
                  sentido y dirección.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#FFE571]"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                    fill="currentColor"
                  >
                    <path d="M0,10 Q50,20 100,10 Q50,0 0,10 Z" />
                  </svg>
                </span>
              </h1>

              {/* Epistemological Subtitle */}
              <p className="text-base sm:text-lg text-[#2A2A2A]/80 leading-relaxed font-normal">
                Atención clínica especializada guiada estrictamente por el <strong>Análisis de la Conducta</strong>, el <strong>Conductismo Radical</strong>, el <strong>Interconductismo</strong> y las <strong>Terapias de Tercera Generación</strong> (ACT, DBT, FAP y Activación Conductual). Sin conceptos pseudocientíficos ni explicaciones mentalistas circulares: intervenciones con evidencia empírica contrastada.
              </p>

              {/* Hero CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onOpenBookingModal}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FFE571] text-[#2A2A2A] font-black text-sm shadow-md hover:bg-[#ffe04d] hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#2A2A2A]" />
                  <span>Agendar Consulta con Andrés Rojas</span>
                </button>

                <button
                  onClick={() => onNavigate('tecnicas')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#4D76B4]/30 text-[#4D76B4] font-bold text-sm shadow-2xs hover:bg-[#4D76B4]/5 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explorar Técnicas Clínicas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Highlights List */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#2A2A2A]/85">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
                  <span>Análisis Funcional Individual</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
                  <span>Protocolos Científicos Validados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
                  <span>Consulta Online & Presencial</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Card with Andrés Rojas Photo & Bio */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border border-[#91A7BB]/30 p-6 sm:p-8 shadow-xl relative overflow-hidden text-center space-y-5">
                {/* Background decorative ring */}
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-8 border-[#6BD4FF]/15 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-4 border-[#FFE571]/30 pointer-events-none" />

                {/* Andrés Rojas Photo */}
                <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-[#4D76B4]/20">
                  <img
                    src={brandConfig?.andresPhotoUrl || "/assets/aistudio/584007706_32422646247350895_2090936131343737151_n-2_88d0f364.jpg"}
                    alt="Andrés Rojas - admi"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black uppercase tracking-wider shadow-xs">
                    admi
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#91A7BB]/10 border border-[#91A7BB]/20 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#4D76B4]">
                    <span>ANDRÉS ROJAS</span>
                    <span className="text-[11px] font-bold text-[#4D76B4] bg-white px-2 py-0.5 rounded-md border border-[#4D76B4]/20">
                      admi
                    </span>
                  </div>
                  <p className="text-xs text-[#2A2A2A]/85 leading-relaxed font-normal">
                    Psicólogo y administrador de recursos humanos con experiencia en análisis funcional de la conducta en entornos clínicos y organizacionales.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#91A7BB]/20 text-center">
                  <div className="p-2 rounded-xl bg-gray-50">
                    <span className="block text-lg font-black text-[#4D76B4]">100%</span>
                    <span className="text-[10px] text-[#91A7BB] font-semibold">Evidencia</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50">
                    <span className="block text-lg font-black text-[#4D76B4]">+8</span>
                    <span className="text-[10px] text-[#91A7BB] font-semibold">Protocolos</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50">
                    <span className="block text-lg font-black text-[#4D76B4]">3ra</span>
                    <span className="text-[10px] text-[#91A7BB] font-semibold">Generación</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EPISTEMOLOGICAL PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Marco Teórico & Rigor Epistemológico Estricto
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2A2A2A]">
            Los 4 Pilares Inamovibles de Nuestra Práctica
          </h2>
          <p className="text-sm sm:text-base text-[#2A2A2A]/75">
            Una línea epistemológica coherente y depurada de mitos y especulaciones no científicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="ar-card p-6 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#4D76B4]/10 text-[#4D76B4] flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-[#2A2A2A]">
              Conductismo Radical
            </h3>
            <p className="text-xs text-[#91A7BB] font-semibold">
              B.F. Skinner • Análisis de Contingencias
            </p>
            <p className="text-sm text-[#2A2A2A]/80 leading-relaxed">
              La conducta humana no depende de fuerzas ocultas intrapsíquicas, sino de la interacción funcional entre las respuestas del organismo y las consecuencias ambientales de reforzamiento o castigo.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="ar-card p-6 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#6BD4FF]/20 text-[#007da8] flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-[#2A2A2A]">
              Interconductismo
            </h3>
            <p className="text-xs text-[#91A7BB] font-semibold">
              J.R. Kantor • Emilio Ribes
            </p>
            <p className="text-sm text-[#2A2A2A]/80 leading-relaxed">
              Superamos el dualismo cartesiano comprendiendo el campo psicológico total: la historia interconductual acumulada, los factores disposicionales del consultante y la función estímulo-respuesta integrada.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="ar-card p-6 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE571]/40 text-[#7a6400] flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-[#2A2A2A]">
              Terapias Contextuales
            </h3>
            <p className="text-xs text-[#91A7BB] font-semibold">
              ACT • DBT • FAP • Activación
            </p>
            <p className="text-sm text-[#2A2A2A]/80 leading-relaxed">
              Terapias de Tercera Generación basadas en la Teoría del Marco Relacional (RFT). No buscamos eliminar pensamientos o emociones por fuerza, sino alterar su función para maximizar la flexibilidad psicológica.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="ar-card p-6 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#4D94FF]/20 text-[#2563eb] flex items-center justify-center font-bold text-lg">
              04
            </div>
            <h3 className="text-lg font-bold text-[#2A2A2A]">
              Análisis Funcional
            </h3>
            <p className="text-xs text-[#91A7BB] font-semibold">
              Formulación Clínica Individual
            </p>
            <p className="text-sm text-[#2A2A2A]/80 leading-relaxed">
              Cada consultante recibe un mapa operativo personalizado (Antecedentes - Respuestas - Consecuencias). No catalogamos personas con etiquetas estáticas, sino que evaluamos funciones dinámicas de mantenimiento.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MINI-LAB SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveFunctionalAnalysis />
      </section>

      {/* HOW CLINICAL CONSULTATION WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4D76B4]/5 rounded-3xl p-8 lg:p-12 border border-[#4D76B4]/20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              Ruta Terapéutica Científica
            </span>
            <h2 className="text-3xl font-bold text-[#2A2A2A]">
              ¿Cómo es el Proceso en Consulta con Andrés Rojas?
            </h2>
            <p className="text-sm text-[#2A2A2A]/75">
              Un recorrido estructurado y con metas operacionales claras desde la primera sesión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#91A7BB]/30 space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h4 className="font-bold text-[#2A2A2A]">Entrevista y Línea Base</h4>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                Evaluamos la frecuencia, intensidad y disparadores de las conductas problema sin juzgar, recopilando registros de ocurrencia real.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#91A7BB]/30 space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h4 className="font-bold text-[#2A2A2A]">Formulación Funcional</h4>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                Diseñamos juntos el diagrama de contingencias: comprendes exactamente qué estímulos mantienen el malestar y qué función cumple cada conducta.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#91A7BB]/30 space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h4 className="font-bold text-[#2A2A2A]">Entrenamiento Activo</h4>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                Aplicamos procedimientos probados (EPR, Activación Conductual, Defusión en ACT, moldeamiento) con tareas concretas entre sesiones.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#91A7BB]/30 space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h4 className="font-bold text-[#2A2A2A]">Consolidación & Alta</h4>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                Medición objetiva del cambio conductual, prevención de recaídas y desvanecimiento progresivo del acompañamiento hasta la autonomía total.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onOpenBookingModal}
              className="px-8 py-3.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-md hover:bg-[#3d629a] transition-all inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#FFE571]" />
              <span>Solicitar Evaluación Inicial</span>
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE THE ECOSYSTEM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('psicologos_aliados')}
            className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 hover:border-[#4D76B4] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4D76B4]/10 text-[#4D76B4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-[#2A2A2A] flex items-center justify-between">
              <span>Psicólogos aliados</span>
              <ArrowRight className="w-4 h-4 text-[#91A7BB] group-hover:text-[#4D76B4] transition-colors" />
            </h4>
            <p className="text-xs text-[#2A2A2A]/70 leading-relaxed">
              Directorio de psicólogos clínicos colegiados con especialidades en trastornos DSM-5-TR, técnicas conductuales y horarios disponibles.
            </p>
          </div>

          <div
            onClick={() => onNavigate('vlog')}
            className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 hover:border-[#4D76B4] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#6BD4FF]/20 text-[#007da8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-[#2A2A2A] flex items-center justify-between">
              <span>El Vlog Científico</span>
              <ArrowRight className="w-4 h-4 text-[#91A7BB] group-hover:text-[#4D76B4] transition-colors" />
            </h4>
            <p className="text-xs text-[#2A2A2A]/70 leading-relaxed">
              Artículos rigurosos de divulgación psicológica redactados de forma clara, con referencias DOI y respaldo experimental.
            </p>
          </div>

          <div
            onClick={() => onNavigate('debate-sociedad')}
            className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 hover:border-[#4D76B4] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFE571]/40 text-[#7a6400] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-[#2A2A2A] flex items-center justify-between">
              <span>Debate Sociedad</span>
              <ArrowRight className="w-4 h-4 text-[#91A7BB] group-hover:text-[#4D76B4] transition-colors" />
            </h4>
            <p className="text-xs text-[#2A2A2A]/70 leading-relaxed">
              Foro especializado en filosofía conductista, metacontingencias culturales e ingeniería del comportamiento social.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
