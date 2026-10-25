import React, { useState } from 'react';
import { BehavioralTechnique } from '../../types';
import {
  Search,
  Filter,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';

interface TecnicasViewProps {
  techniques: BehavioralTechnique[];
  onOpenBookingModal: () => void;
}

export const TecnicasView: React.FC<TecnicasViewProps> = ({
  techniques,
  onOpenBookingModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeTechniqueModal, setActiveTechniqueModal] = useState<BehavioralTechnique | null>(null);

  const categories = [
    'Todas',
    'Análisis Funcional',
    'Terapias Contextuales (3ra Gen)',
    'Exposición y Desensibilización',
    'Condicionamiento Operante',
    'Interconductismo'
  ];

  const filteredTechniques = techniques.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.acronym && tech.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tech.clinicalApplications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todas' || tech.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Compendio de Psicoterapias con Evidencia Empírica
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2A2A2A]">
          Técnicas y Procedimientos Clínicos
        </h1>
        <p className="text-base text-[#2A2A2A]/75 leading-relaxed">
          Cada intervención aplicada en nuestro servicio cuenta con respaldo experimental y manualización protocolizada en el Análisis Experimental de la Conducta y las Terapias Contextuales.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-[#91A7BB]/30 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#91A7BB] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por técnica, problema o autor (ej. ACT, EPR, evitación)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#91A7BB]/30 text-sm focus:outline-hidden focus:border-[#4D76B4] text-[#2A2A2A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#4D76B4] text-white shadow-2xs'
                  : 'bg-[#91A7BB]/10 text-[#2A2A2A] hover:bg-[#91A7BB]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((tech) => (
          <div
            key={tech.id}
            className="ar-card p-6 flex flex-col justify-between space-y-4 group cursor-pointer"
            onClick={() => setActiveTechniqueModal(tech)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] uppercase tracking-wider">
                  {tech.category}
                </span>
                {tech.acronym && (
                  <span className="text-xs font-black text-[#2A2A2A] bg-[#FFE571] px-2 py-0.5 rounded-md">
                    {tech.acronym}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-[#2A2A2A] group-hover:text-[#4D76B4] transition-colors">
                {tech.name}
              </h3>

              <p className="text-xs text-[#2A2A2A]/75 line-clamp-3 leading-relaxed">
                {tech.description}
              </p>

              <div className="pt-2 border-t border-[#91A7BB]/15 space-y-2">
                <div className="text-[11px] font-semibold text-[#4D76B4]">
                  Aplicaciones Clínicas Principales:
                </div>
                <div className="flex flex-wrap gap-1">
                  {tech.clinicalApplications.slice(0, 2).map((app, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#91A7BB]/10 text-[#2A2A2A] px-2 py-0.5 rounded-md"
                    >
                      {app}
                    </span>
                  ))}
                  {tech.clinicalApplications.length > 2 && (
                    <span className="text-[10px] text-[#91A7BB] px-1 py-0.5">
                      +{tech.clinicalApplications.length - 2} más
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs font-bold text-[#4D76B4] group-hover:translate-x-1 transition-transform">
              <span>Ver protocolo detallado y evidencia</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredTechniques.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/20 p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-[#91A7BB] mx-auto" />
          <h4 className="font-bold text-[#2A2A2A]">No se encontraron técnicas</h4>
          <p className="text-xs text-[#91A7BB]">
            Intenta buscar con otros términos como "valores", "evitación", "reforzamiento" o "FAP".
          </p>
        </div>
      )}

      {/* Modal with Full Clinical Protocol for the selected Technique */}
      {activeTechniqueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <button
              onClick={() => setActiveTechniqueModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal de técnica"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] uppercase">
                  {activeTechniqueModal.category}
                </span>
                {activeTechniqueModal.acronym && (
                  <span className="text-xs font-black bg-[#FFE571] text-[#2A2A2A] px-2.5 py-0.5 rounded-full">
                    {activeTechniqueModal.acronym}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-[#2A2A2A]">
                {activeTechniqueModal.name}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
                Definición y Fundamento Epistemológico
              </h4>
              <p className="text-sm text-[#2A2A2A]/85 leading-relaxed">
                {activeTechniqueModal.description}
              </p>
            </div>

            {/* Empirical Evidence */}
            <div className="p-4 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4D76B4] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#4D76B4]" />
                Nivel de Evidencia Empírica
              </div>
              <p className="text-xs text-[#2A2A2A]/80 leading-relaxed font-medium">
                {activeTechniqueModal.empiricalEvidence}
              </p>
            </div>

            {/* Step by step clinical protocol */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
                Procedimiento Clínico Paso a Paso
              </h4>
              <div className="space-y-2">
                {activeTechniqueModal.stepByStepProcedure.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-[#2A2A2A]/85 leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Authors & Clinical Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#91A7BB]/20">
              <div>
                <h5 className="text-[11px] font-bold uppercase text-[#91A7BB] mb-1">
                  Autores e Investigadores Clave:
                </h5>
                <p className="text-xs text-[#2A2A2A] font-medium">
                  {activeTechniqueModal.keyAuthors.join(', ')}
                </p>
              </div>
              <div>
                <h5 className="text-[11px] font-bold uppercase text-[#91A7BB] mb-1">
                  Aplicación en Consulta:
                </h5>
                <p className="text-xs text-[#2A2A2A] font-medium">
                  {activeTechniqueModal.clinicalApplications.join(', ')}
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setActiveTechniqueModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActiveTechniqueModal(null);
                  onOpenBookingModal();
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#4D76B4] text-white text-xs font-bold shadow-xs hover:bg-[#3d629a] transition-all"
              >
                Agendar Consulta con Esta Técnica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
