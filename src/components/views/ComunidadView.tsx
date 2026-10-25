import React, { useState } from 'react';
import { User, PatientContactLead, SiteBrandConfig, ProblemRate } from '../../types';
import { ContactPsychologistModal } from '../ContactPsychologistModal';
import { PsychologistRatesModal } from '../PsychologistRatesModal';
import { canInteract, canProposeRates } from '../../utils/rbac';
import {
  Users,
  Award,
  CheckCircle2,
  PhoneCall,
  Search,
  Filter,
  Sparkles,
  HeartHandshake,
  MapPin,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageCircle,
  DollarSign,
  Clock,
  Sliders,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

interface ComunidadViewProps {
  psychologists: User[];
  brandConfig: SiteBrandConfig;
  currentUser: User;
  onSendContactLead: (lead: Omit<PatientContactLead, 'id' | 'status' | 'createdAt'>) => void;
  onSubmitRatesProposal: (
    psychologistId: string,
    baseRateUsd: number,
    problemRates: ProblemRate[],
    proposalNote: string
  ) => void;
  onRequireAuth?: (actionContext: string) => void;
  onNavigateToTarifas?: () => void;
  onUpdatePsychologistAvailability?: (
    psychologistId: string,
    status: 'disponible' | 'no_disponible',
    scheduleHours?: string
  ) => void;
}

export const ComunidadView: React.FC<ComunidadViewProps> = ({
  psychologists,
  brandConfig,
  currentUser,
  onSendContactLead,
  onSubmitRatesProposal,
  onRequireAuth,
  onNavigateToTarifas,
  onUpdatePsychologistAvailability
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisorderFilter, setSelectedDisorderFilter] = useState('Todos');
  const [selectedPsychologistForModal, setSelectedPsychologistForModal] = useState<User | null>(null);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

  // Guest Contact Bubble State
  const [contactAuthBubblePsych, setContactAuthBubblePsych] = useState<User | null>(null);

  // Schedule Edit Modal State
  const [editingSchedulePsych, setEditingSchedulePsych] = useState<User | null>(null);
  const [scheduleInput, setScheduleInput] = useState('');

  // Andrés Rojas is explicitly the creator and founder
  const andresRojas = psychologists.find((p) => p.id === 'user-andres-rojas') || psychologists[0];

  // List of all verified psychologists including Andrés Rojas in the directory
  const verifiedPsychologists = psychologists.filter(
    (p) =>
      p.role === 'SuperAdmin' ||
      (p.role === 'Psicologo' && p.isVerified) ||
      (p.role === 'Moderador' && p.fpvNumber)
  );

  const disorderOptions = [
    'Todos',
    'Ansiedad',
    'Depresión',
    'TOC',
    'Autismo (TEA)',
    'Desregulación Emocional',
    'Dolor Crónico',
    'Problemas de Pareja'
  ];

  const filteredPsychologists = verifiedPsychologists.filter((psy) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      psy.name.toLowerCase().includes(q) ||
      (psy.fpvNumber && psy.fpvNumber.includes(q)) ||
      (psy.disordersAddressed && psy.disordersAddressed.some((d) => d.toLowerCase().includes(q))) ||
      (psy.behavioralTechniques && psy.behavioralTechniques.some((t) => t.toLowerCase().includes(q)));

    const matchesFilter =
      selectedDisorderFilter === 'Todos' ||
      (psy.disordersAddressed &&
        psy.disordersAddressed.some((d) =>
          d.toLowerCase().includes(selectedDisorderFilter.toLowerCase().split(' ')[0])
        ));

    return matchesSearch && matchesFilter;
  });

  const handleContactClick = (psych: User) => {
    // If user is guest (Invitado), show the requested bubble asking to log in or register!
    if (currentUser.role === 'Invitado') {
      setContactAuthBubblePsych(psych);
      return;
    }
    setSelectedPsychologistForModal(psych);
  };

  const handleToggleAvailability = (psych: User, newStatus: 'disponible' | 'no_disponible') => {
    if (onUpdatePsychologistAvailability) {
      onUpdatePsychologistAvailability(psych.id, newStatus, psych.scheduleHours);
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedulePsych || !onUpdatePsychologistAvailability) return;
    onUpdatePsychologistAvailability(
      editingSchedulePsych.id,
      editingSchedulePsych.availabilityStatus || 'disponible',
      scheduleInput.trim()
    );
    setEditingSchedulePsych(null);
  };

  const handleOpenRatesConfig = () => {
    if (!canInteract(currentUser) && onRequireAuth) {
      onRequireAuth('configurar o postular honorarios profesionales');
      return;
    }
    setIsRatesModalOpen(true);
  };

  const canEditRates = canProposeRates(currentUser);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          Directorio de Psicólogos Colegiados
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2A2A2A]">
          Psicólogos aliados
        </h1>
        <p className="text-base text-[#2A2A2A]/75 leading-relaxed">
          Conoce a los profesionales de la salud mental afiliados a <strong>Psicogénesis</strong>, sus áreas de especialización, trastornos abordados según el DSM-5-TR, disponibilidad horaria en tiempo real y técnicas de intervención basadas en análisis de la conducta.
        </p>

        {/* Action bar for psychologists to configure their rates */}
        {canEditRates && (
          <div className="pt-2">
            <button
              onClick={handleOpenRatesConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-md hover:bg-[#3d629a] transition-all"
            >
              <DollarSign className="w-4 h-4 text-[#FFE571]" />
              <span>Configurar / Postular Mis Tarifas Clínicas</span>
              {currentUser.rateApprovalStatus === 'pending' && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black">
                  En Revisión
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 1. FEATURED SECTION: ANDRÉS ROJAS (FIRST & FOUNDER) */}
      <section className="bg-gradient-to-br from-white via-[#4D76B4]/5 to-[#FFE571]/10 rounded-3xl border-2 border-[#4D76B4]/40 p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#6BD4FF]/10 blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Real photo of Andrés Rojas */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-[#4D76B4]/20 group">
              <img
                src={brandConfig.andresPhotoUrl}
                alt="Andrés Rojas - admi"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                <span className="text-xs uppercase tracking-wider text-[#FFE571] font-bold block">
                  admi
                </span>
                <span className="text-sm font-bold">Andrés Rojas</span>
              </div>
            </div>

            {/* Availability circles for Andrés Rojas */}
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#91A7BB]/30 shadow-2xs text-xs">
                <span
                  className={`w-3 h-3 rounded-full ${
                    andresRojas.availabilityStatus !== 'no_disponible'
                      ? 'bg-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-rose-500 ring-2 ring-rose-200'
                  }`}
                />
                <span className="font-bold text-[#2A2A2A]">
                  {andresRojas.availabilityStatus !== 'no_disponible' ? 'Disponible' : 'No disponible'}
                </span>
              </div>

              {(currentUser.id === andresRojas.id || currentUser.role === 'SuperAdmin') && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={() => handleToggleAvailability(andresRojas, 'disponible')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      andresRojas.availabilityStatus !== 'no_disponible'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Disponible
                  </button>
                  <button
                    onClick={() => handleToggleAvailability(andresRojas, 'no_disponible')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      andresRojas.availabilityStatus === 'no_disponible'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-rose-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    No disponible
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Founder's Mission and Exact User Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#4D76B4] bg-[#4D76B4]/10 px-3 py-1 rounded-full">
                Perfil de Atención
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2A2A2A] flex items-center gap-2">
                <span>Andrés Rojas</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#4D76B4] text-white text-xs font-bold tracking-wider">
                  admi
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4D76B4] font-medium leading-relaxed">
                Psicólogo y administrador de recursos humanos con experiencia en análisis funcional de la conducta en entornos clínicos y organizacionales.
              </p>
            </div>

            {/* User-specified quote / mission statement */}
            <div className="p-5 rounded-2xl bg-white border border-[#4D76B4]/30 shadow-md space-y-2 relative">
              <span className="text-4xl text-[#FFE571] font-serif absolute -top-3 left-4 select-none leading-none">
                “
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#2A2A2A] italic leading-relaxed pt-2">
                {brandConfig.andresMissionStatement}
              </p>
              <div className="text-right text-xs font-bold text-[#4D76B4]">
                — Andrés Rojas (admi)
              </div>
            </div>

            {/* Schedule display & modification */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#91A7BB]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
                <div>
                  <strong className="text-[#2A2A2A] block">Horarios de Consulta:</strong>
                  <span className="text-[#2A2A2A]/80">
                    {andresRojas.scheduleHours || 'Lunes a Viernes: 8:00 AM - 5:00 PM | Sábados: 9:00 AM - 1:00 PM'}
                  </span>
                </div>
              </div>
              {(currentUser.id === andresRojas.id || currentUser.role === 'SuperAdmin') && (
                <button
                  onClick={() => {
                    setEditingSchedulePsych(andresRojas);
                    setScheduleInput(andresRojas.scheduleHours || '');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#4D76B4]/10 text-[#4D76B4] font-bold hover:bg-[#4D76B4]/20 transition-colors whitespace-nowrap"
                >
                  Modificar mis horarios
                </button>
              )}
            </div>

            {/* Profile details: Disorders & Techniques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-[#91A7BB]/30 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4D76B4]" />
                  <span>Trastornos y Problemas a Tratar</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {andresRojas.disordersAddressed?.map((d, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#4D76B4]/10 text-[#4D76B4] font-medium px-2.5 py-1 rounded-lg"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-[#91A7BB]/30 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A2A2A] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#FFE571]" />
                  <span>Técnicas que Utilizo (Basadas en Evidencia)</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {andresRojas.behavioralTechniques?.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#FFE571]/30 text-[#2A2A2A] font-semibold px-2.5 py-1 rounded-lg border border-[#FFE571]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Andrés Rojas Rates Display */}
            <div className="bg-white/90 p-4 rounded-2xl border border-[#4D76B4]/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D76B4] block">
                    Honorarios de Consulta (Andrés Rojas)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-[#4D76B4]">
                      ${brandConfig.andresSessionRateUsd || andresRojas.sessionRateUsd || 45}
                    </span>
                    <span className="text-xs text-[#91A7BB] font-semibold">USD / sesión (50-60 min)</span>
                  </div>
                </div>
                {onNavigateToTarifas && (
                  <button
                    onClick={onNavigateToTarifas}
                    className="text-xs font-bold text-[#4D76B4] hover:underline flex items-center gap-1"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Ver estadísticas comunitarias</span>
                  </button>
                )}
              </div>

              {/* Problem Rates Breakdown */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#91A7BB]/15 text-[11px]">
                {(brandConfig.andresProblemRates || andresRojas.problemRates || []).map((pr, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[#91A7BB]/10 text-[#2A2A2A] font-medium"
                  >
                    {pr.disorder.split('(')[0]}: <strong className="text-[#4D76B4]">${pr.priceUsd}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct CTA button Contáctame */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => handleContactClick(andresRojas)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FFE571] text-[#2A2A2A] font-black text-sm shadow-md hover:bg-[#ffe04d] hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#2A2A2A]" />
                <span>Contáctame (Consulta con Andrés Rojas)</span>
              </button>
              <span className="text-xs text-[#91A7BB] text-center sm:text-left">
                Tu solicitud será recibida directamente en el panel administrativo del SuperAdmin.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIRECTORY OF PSYCHOLOGISTS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2A2A2A]">
              Psicólogos y Especialistas Colegiados en la Comunidad
            </h2>
            <p className="text-xs sm:text-sm text-[#91A7BB] mt-1">
              Todos los profesionales listados cuentan con colegiatura verificada FPV y honorarios supervisados por la Dirección Clínica.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#91A7BB] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por psicólogo, técnica o problema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4] bg-white text-[#2A2A2A]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[#91A7BB] mr-1 flex-shrink-0" />
          {disorderOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedDisorderFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDisorderFilter === opt
                  ? 'bg-[#4D76B4] text-white shadow-2xs font-bold'
                  : 'bg-white border border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-[#91A7BB]/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPsychologists.map((psych) => {
            const isFounder = psych.id === 'user-andres-rojas';
            const displayRate = psych.sessionRateUsd || 40;
            const hasPendingRate = psych.rateApprovalStatus === 'pending';

            return (
              <div
                key={psych.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                  isFounder
                    ? 'bg-white border-2 border-[#4D76B4] shadow-lg ring-4 ring-[#4D76B4]/10'
                    : 'bg-white border border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/50 hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Top: Photo & Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[#4D76B4]/30 shadow-xs">
                      {psych.avatarUrl ? (
                        <img
                          src={psych.avatarUrl}
                          alt={psych.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#4D76B4]">
                          {psych.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#4D76B4] bg-[#4D76B4]/10 px-2 py-0.5 rounded-md">
                          FPV {psych.fpvNumber}
                        </span>
                        {isFounder && (
                          <span className="text-[10px] font-black uppercase text-[#2A2A2A] bg-[#FFE571] px-2 py-0.5 rounded-full">
                            Fundador
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#2A2A2A] mt-1">
                        {psych.name}
                      </h3>
                      <p className="text-[11px] text-[#91A7BB] font-medium">
                        {psych.city || 'Venezuela / Online'}
                      </p>
                    </div>
                  </div>

                  {/* Bio or Experience */}
                  <p className="text-xs text-[#2A2A2A]/80 line-clamp-3 leading-relaxed bg-[#91A7BB]/10 p-2.5 rounded-xl">
                    {psych.bio || psych.clinicalExperience}
                  </p>

                  {/* Tarifa Profesional por Sesión */}
                  <div className="bg-[#4D76B4]/5 p-3 rounded-2xl border border-[#4D76B4]/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D76B4]">
                        Tarifa de Sesión:
                      </span>
                      {hasPendingRate && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                          Tarifa en revisión
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#4D76B4]">${displayRate}</span>
                      <span className="text-xs text-[#91A7BB] font-semibold">USD / 50-60 min</span>
                    </div>

                    {/* Breakdown by disorder if specified */}
                    {psych.problemRates && psych.problemRates.length > 0 && (
                      <div className="pt-1.5 border-t border-[#4D76B4]/10 flex flex-wrap gap-1">
                        {psych.problemRates.slice(0, 3).map((pr, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-white px-1.5 py-0.5 rounded-md border border-[#91A7BB]/30 text-[#2A2A2A]"
                          >
                            {pr.disorder.split('(')[0]}: <strong>${pr.priceUsd}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Availability Circles & Schedule (disponible / no disponible) */}
                  <div className="bg-gray-50 p-3 rounded-2xl border border-[#91A7BB]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#91A7BB]">
                        Disponibilidad:
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white border border-[#91A7BB]/30">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            psych.availabilityStatus !== 'no_disponible'
                              ? 'bg-emerald-500 ring-2 ring-emerald-200'
                              : 'bg-rose-500 ring-2 ring-rose-200'
                          }`}
                        />
                        <span className={psych.availabilityStatus !== 'no_disponible' ? 'text-emerald-700' : 'text-rose-700'}>
                          {psych.availabilityStatus !== 'no_disponible' ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </div>

                    {/* Self-management by psychologist or admi */}
                    {(currentUser.id === psych.id || currentUser.role === 'SuperAdmin') && (
                      <div className="pt-1.5 border-t border-[#91A7BB]/20 flex items-center justify-between gap-1.5">
                        <span className="text-[9px] font-bold text-[#4D76B4]">Mi estado:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleAvailability(psych, 'disponible')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                              psych.availabilityStatus !== 'no_disponible'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                            Disponible
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(psych, 'no_disponible')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                              psych.availabilityStatus === 'no_disponible'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-rose-50'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                            No disponible
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Schedule display & modification */}
                    <div className="pt-1.5 border-t border-[#91A7BB]/20 flex items-center justify-between gap-2 text-[11px] text-[#2A2A2A]/80">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#4D76B4] flex-shrink-0" />
                        <span className="line-clamp-1">{psych.scheduleHours || 'Previa cita acordada'}</span>
                      </div>
                      {(currentUser.id === psych.id || currentUser.role === 'SuperAdmin') && (
                        <button
                          onClick={() => {
                            setEditingSchedulePsych(psych);
                            setScheduleInput(psych.scheduleHours || '');
                          }}
                          className="text-[10px] text-[#4D76B4] font-bold hover:underline whitespace-nowrap"
                        >
                          Modificar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trastornos y Problemas a Tratar */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D76B4] block">
                      Trastornos y Problemas a Tratar:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {psych.disordersAddressed?.map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#91A7BB]/15 text-[#2A2A2A] font-medium px-2 py-0.5 rounded-md"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Técnicas que Utilizo */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A2A2A] block">
                      Técnicas que Utilizo:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {psych.behavioralTechniques?.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#FFE571]/30 text-[#2A2A2A] font-semibold px-2 py-0.5 rounded-md border border-[#FFE571]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button: Contáctame */}
                <div className="pt-6">
                  <button
                    onClick={() => handleContactClick(psych)}
                    className="w-full py-3 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-xs hover:bg-[#3d629a] transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#FFE571]" />
                    <span>Contáctame</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPsychologists.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8 space-y-2">
            <Users className="w-8 h-8 text-[#91A7BB] mx-auto" />
            <h4 className="font-bold text-[#2A2A2A]">No se encontraron psicólogos con ese criterio</h4>
            <p className="text-xs text-[#91A7BB]">
              Intenta buscar por otra técnica (ej. "ACT", "Activación") o selecciona "Todos".
            </p>
          </div>
        )}
      </section>

      {/* GUEST CONTACT BUBBLE MODAL */}
      {contactAuthBubblePsych && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-[#4D76B4] text-center space-y-4 relative animate-in zoom-in-95">
            <button
              onClick={() => setContactAuthBubblePsych(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#91A7BB] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#FFE571] mx-auto flex items-center justify-center text-[#2A2A2A] shadow-md">
              <MessageCircle className="w-7 h-7 text-[#4D76B4]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4D76B4] bg-[#4D76B4]/10 px-2.5 py-1 rounded-md">
                Contacto Profesional Seguro
              </span>
              <h3 className="text-xl font-black text-[#2A2A2A]">
                Inicia sesión o regístrate para contactar
              </h3>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                Para solicitar atención clínica o enviar tu motivo de consulta a <strong>{contactAuthBubblePsych.name}</strong>, debes iniciar sesión con tu cuenta de paciente o registrarte gratis.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  const psych = contactAuthBubblePsych;
                  setContactAuthBubblePsych(null);
                  if (onRequireAuth) {
                    onRequireAuth(`contactar al psicólogo ${psych.name}`);
                  }
                }}
                className="w-full py-3 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-md hover:bg-[#3d629a] transition-all"
              >
                Iniciar Sesión / Registrarme como Paciente
              </button>
              <button
                onClick={() => setContactAuthBubblePsych(null)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-[#91A7BB] hover:bg-gray-100 transition-colors"
              >
                Continuar explorando el directorio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SCHEDULE MODAL */}
      {editingSchedulePsych && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#91A7BB]/30 space-y-4 relative">
            <button
              onClick={() => setEditingSchedulePsych(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#91A7BB] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4D76B4]" />
              <h3 className="text-lg font-bold text-[#2A2A2A]">
                Modificar Mis Horarios de Consulta
              </h3>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4D76B4] uppercase tracking-wider mb-1">
                  Días y Horarios Disponibles:
                </label>
                <input
                  type="text"
                  required
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  placeholder="Ej. Lunes a Jueves: 9:00 AM - 4:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                />
                <p className="text-[11px] text-[#91A7BB] mt-1">
                  Esta información se actualizará de inmediato en tu perfil público de psicólogos aliados.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedulePsych(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4D76B4] text-white font-bold text-xs hover:bg-[#3d629a] shadow-xs"
                >
                  Guardar Horarios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT PSYCHOLOGIST MODAL (500-char max, sent directly to SuperAdmin) */}
      <ContactPsychologistModal
        isOpen={Boolean(selectedPsychologistForModal)}
        onClose={() => setSelectedPsychologistForModal(null)}
        targetPsychologist={selectedPsychologistForModal}
        onSendLead={onSendContactLead}
      />

      {/* PSYCHOLOGIST RATES CONFIGURATION MODAL */}
      {canEditRates && (
        <PsychologistRatesModal
          isOpen={isRatesModalOpen}
          onClose={() => setIsRatesModalOpen(false)}
          psychologist={currentUser}
          maxSessionLimitUsd={brandConfig.maxSessionRateLimitUsd || 100}
          onSubmitRates={(ratesData) => {
            onSubmitRatesProposal(
              currentUser.id,
              ratesData.baseRateUsd,
              ratesData.problemRates,
              ratesData.proposalNote
            );
          }}
        />
      )}
    </div>
  );
};
