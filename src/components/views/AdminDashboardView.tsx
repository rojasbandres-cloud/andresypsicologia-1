import React, { useState } from 'react';
import {
  User,
  UserRole,
  ModerationLog,
  AppointmentBooking,
  PatientContactLead,
  VlogArticle,
  ForumThread,
  BehavioralTechnique,
  TherapyRate,
  SiteBrandConfig,
  NavMenuItem,
  PostingPermissions,
  StatsVisibility,
  FooterConfig
} from '../../types';
import { canVerifyPsychologists, canAssignRoles, CLINICAL_DISORDERS_LIST } from '../../utils/rbac';
import {
  ShieldCheck,
  Users,
  FileCheck,
  AlertTriangle,
  Award,
  Check,
  X,
  Search,
  Eye,
  Ban,
  Clock,
  Calendar,
  Lock,
  ChevronRight,
  Filter,
  UserCheck,
  Sparkles,
  Sliders,
  ExternalLink,
  Mail,
  Inbox,
  FileText,
  SlidersHorizontal,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Compass,
  Hourglass,
  Image as ImageIcon,
  DollarSign,
  Scale,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser: User;
  users: User[];
  moderationLogs: ModerationLog[];
  bookings: AppointmentBooking[];
  patientLeads: PatientContactLead[];
  vlogArticles: VlogArticle[];
  debateThreads: ForumThread[];
  techniques: BehavioralTechnique[];
  rates: TherapyRate[];
  brandConfig: SiteBrandConfig;
  onUpdateBrandConfig: (newConfig: Partial<SiteBrandConfig>) => void;
  onApprovePsychologist: (userId: string) => void;
  onRejectPsychologist: (userId: string, reason: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onBanUser: (targetUserId: string, targetUserName: string, reason: string) => void;
  onUnbanUser: (targetUserId: string, targetUserName: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: AppointmentBooking['status']) => void;
  onUpdateLeadStatus: (leadId: string, status: PatientContactLead['status'], notes?: string) => void;
  onApprovePost: (type: 'vlog' | 'debate', id: string) => void;
  onRejectPost: (type: 'vlog' | 'debate', id: string, reason: string) => void;
  onToggleItemVisibility: (type: 'technique' | 'rate', id: string) => void;
  onDeleteItem: (type: 'technique' | 'rate' | 'psychologist', id: string) => void;
  onAddTechnique: (tech: BehavioralTechnique) => void;
  onAddRate: (rate: TherapyRate) => void;
  onApprovePsychologistRates?: (psychologistId: string) => void;
  onRejectPsychologistRates?: (psychologistId: string, reason: string) => void;
  onUpdateAndresRates?: (baseRateUsd: number, problemRates: import('../../types').ProblemRate[]) => void;
  onUpdateMaxSessionRateLimit?: (newLimit: number) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  users,
  moderationLogs,
  bookings,
  patientLeads,
  vlogArticles,
  debateThreads,
  techniques,
  rates,
  brandConfig,
  onUpdateBrandConfig,
  onApprovePsychologist,
  onRejectPsychologist,
  onUpdateUserRole,
  onBanUser,
  onUnbanUser,
  onUpdateBookingStatus,
  onUpdateLeadStatus,
  onApprovePost,
  onRejectPost,
  onToggleItemVisibility,
  onDeleteItem,
  onAddTechnique,
  onAddRate,
  onApprovePsychologistRates,
  onRejectPsychologistRates,
  onUpdateAndresRates,
  onUpdateMaxSessionRateLimit
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'mensajes_pacientes'
    | 'tarifas_aprobacion'
    | 'supervision_posts'
    | 'verificaciones'
    | 'cms'
    | 'usuarios'
    | 'logs'
  >('mensajes_pacientes');

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Todos');

  // Inspection Modal for Black Background Title Document
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Ban Modal
  const [banTargetUser, setBanTargetUser] = useState<User | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('');

  // Selected Lead modal
  const [selectedLead, setSelectedLead] = useState<PatientContactLead | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState('');

  // New Technique form modal
  const [showNewTechForm, setShowNewTechForm] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [newTechCategory, setNewTechCategory] = useState<BehavioralTechnique['category']>('Análisis Funcional');
  const [newTechDesc, setNewTechDesc] = useState('');
  const [newTechEvidence, setNewTechEvidence] = useState('');

  // Brand Logo URL input state
  const [customLogoInput, setCustomLogoInput] = useState(brandConfig.customLogoUrl || '');
  const [siteTitleInput, setSiteTitleInput] = useState(brandConfig.siteTitle);
  const [headerSubtitleInput, setHeaderSubtitleInput] = useState(brandConfig.headerSubtitle || 'Por Andrés Rojas - F.P.V. 17.522');
  const [missionInput, setMissionInput] = useState(brandConfig.andresMissionStatement);

  // Header navigation buttons CMS
  const [navItems, setNavItems] = useState<NavMenuItem[]>(brandConfig.navMenuItems || []);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavId, setNewNavId] = useState('');

  // Posting permissions CMS
  const [postingPerms, setPostingPerms] = useState<PostingPermissions>(
    brandConfig.postingPermissions || {
      vlogPsychOnly: ['SuperAdmin', 'Psicologo'],
      vlogCommunity: ['SuperAdmin', 'Psicologo', 'Paciente', 'Moderador'],
      debateSociedad: ['SuperAdmin', 'Moderador', 'Psicologo']
    }
  );

  // Rates statistics visibility CMS
  const [statsVis, setStatsVis] = useState<StatsVisibility>(
    brandConfig.statsVisibility || {
      showMean: true,
      showMedian: true,
      showMode: true
    }
  );

  // Footer config CMS
  const [footerState, setFooterState] = useState<FooterConfig>(
    brandConfig.footerConfig || {
      manifestoText: 'Plataforma clínica fundada estrictamente en el Análisis Experimental del Comportamiento (AEC), Conductismo Radical e Interconductismo.',
      rigorCommitmentText: 'Escrutinio deontológico estricto según la Federación de Psicólogos de Venezuela.',
      contactEmail: 'contacto@psicogenesis.org',
      contactPhone: '+58 412 000 0000',
      locationText: 'Caracas, Venezuela • Atención Online Global',
      customNotice: 'Todos los derechos reservados. Basado en evidencia clínica.'
    }
  );

  const [cmsSaveNotice, setCmsSaveNotice] = useState<string | null>(null);

  const isSuperAdmin = canVerifyPsychologists(currentUser.role);
  const canModifyRoles = canAssignRoles(currentUser.role);

  // Filter pending items
  const pendingApplicants = users.filter((u) => u.role === 'Psicologo' && !u.isVerified);
  const pendingVlogPosts = vlogArticles.filter((a) => a.status === 'pending_review');
  const pendingDebatePosts = debateThreads.filter((d) => d.status === 'pending_review');
  const unreadLeadsCount = patientLeads.filter((l) => l.status === 'No Leído').length;
  const pendingRatesPsychologists = users.filter((u) => u.rateApprovalStatus === 'pending');

  // Andrés Rojas personal rates configuration state
  const [andresBaseRate, setAndresBaseRate] = useState<number>(brandConfig.andresSessionRateUsd || 45);
  const [andresDisorderRates, setAndresDisorderRates] = useState<{ [disorder: string]: number }>(() => {
    const map: { [disorder: string]: number } = {};
    for (const pr of brandConfig.andresProblemRates || []) {
      map[pr.disorder] = pr.priceUsd;
    }
    return map;
  });
  const [maxRateLimitInput, setMaxRateLimitInput] = useState<number>(brandConfig.maxSessionRateLimitUsd || 100);

  const handleSaveAndresRates = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAndresRates) {
      const list = Object.entries(andresDisorderRates).map(([disorder, priceUsd]) => ({
        disorder,
        priceUsd
      }));
      onUpdateAndresRates(andresBaseRate, list);
    }
  };

  const handleSaveMaxLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMaxSessionRateLimit) {
      onUpdateMaxSessionRateLimit(maxRateLimitInput);
    }
  };

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTargetUser || !banReasonInput.trim()) return;
    onBanUser(banTargetUser.id, banTargetUser.name, banReasonInput);
    setBanTargetUser(null);
    setBanReasonInput('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingUser || !rejectionReason.trim()) return;
    onRejectPsychologist(inspectingUser.id, rejectionReason);
    setShowRejectModal(false);
    setInspectingUser(null);
    setRejectionReason('');
  };

  const handleSaveBrandConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrandConfig({
      siteTitle: siteTitleInput,
      headerSubtitle: headerSubtitleInput,
      customLogoUrl: customLogoInput,
      logoType: customLogoInput ? 'custom_url' : 'official_svg',
      andresMissionStatement: missionInput
    });
    setCmsSaveNotice('Identidad y subtítulo del encabezado actualizados exitosamente.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleToggleNavItem = (id: string) => {
    const updated = navItems.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    setNavItems(updated);
    onUpdateBrandConfig({ navMenuItems: updated });
    setCmsSaveNotice('Visibilidad del menú de navegación actualizada.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleDeleteNavItem = (id: string) => {
    const updated = navItems.filter((item) => item.id !== id);
    setNavItems(updated);
    onUpdateBrandConfig({ navMenuItems: updated });
    setCmsSaveNotice('Botón del menú eliminado.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim() || !newNavId.trim()) return;
    const cleanId = newNavId.trim().toLowerCase().replace(/\s+/g, '_');
    const newItem: NavMenuItem = {
      id: cleanId,
      label: newNavLabel.trim(),
      isVisible: true,
      isCustom: true
    };
    const updated = [...navItems, newItem];
    setNavItems(updated);
    onUpdateBrandConfig({ navMenuItems: updated });
    setNewNavLabel('');
    setNewNavId('');
    setCmsSaveNotice('Nuevo botón agregado al menú del encabezado.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleTogglePostingRole = (section: keyof PostingPermissions, role: UserRole) => {
    const currentRoles = postingPerms[section] || [];
    const hasRole = currentRoles.includes(role);
    const updatedRoles = hasRole
      ? currentRoles.filter((r: UserRole) => r !== role)
      : [...currentRoles, role];
    const updated: PostingPermissions = {
      ...postingPerms,
      [section]: updatedRoles
    };
    setPostingPerms(updated);
    onUpdateBrandConfig({ postingPermissions: updated });
    setCmsSaveNotice('Permisos de publicación actualizados.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleToggleStat = (key: keyof StatsVisibility) => {
    const updated: StatsVisibility = {
      ...statsVis,
      [key]: !statsVis[key]
    };
    setStatsVis(updated);
    onUpdateBrandConfig({ statsVisibility: updated });
    setCmsSaveNotice('Visibilidad de métricas estadísticas actualizada.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleSaveFooterConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrandConfig({ footerConfig: footerState });
    setCmsSaveNotice('Configuración del pie de página guardada exitosamente.');
    setTimeout(() => setCmsSaveNotice(null), 3000);
  };

  const handleSaveNewTechnique = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim() || !newTechDesc.trim()) return;
    onAddTechnique({
      id: `tech-${Date.now()}`,
      name: newTechName,
      category: newTechCategory,
      description: newTechDesc,
      empiricalEvidence: newTechEvidence || 'Evidencia clínica y experimental.',
      clinicalApplications: ['Clínica General', 'Modificación de Conducta'],
      stepByStepProcedure: ['1. Evaluación funcional', '2. Intervención', '3. Desvanecimiento'],
      keyAuthors: ['B.F. Skinner', 'S.C. Hayes'],
      isVisible: true
    });
    setShowNewTechForm(false);
    setNewTechName('');
    setNewTechDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#91A7BB]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel de Control Central • {brandConfig.siteTitle}
          </div>
          <h1 className="text-3xl font-black text-[#2A2A2A]">
            Dashboard Administrativo ({currentUser.role})
          </h1>
          <p className="text-sm text-[#2A2A2A]/75 mt-1">
            Bandeja exclusiva de mensajes de pacientes, supervisión previa de publicaciones, control de contenidos (CMS) y verificación de psicólogos.
          </p>
        </div>

        {/* Current Admin badge */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#91A7BB]/30 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4D76B4] text-white flex items-center justify-center font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#2A2A2A]">{currentUser.name}</div>
            <div className="text-[#4D76B4] font-semibold">
              {currentUser.role} {currentUser.fpvNumber ? `• FPV ${currentUser.fpvNumber}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Messages from Patients (Exclusive to SuperAdmin) */}
        <div
          onClick={() => setActiveTab('mensajes_pacientes')}
          className={`p-5 rounded-2xl border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeTab === 'mensajes_pacientes'
              ? 'bg-[#4D76B4]/10 border-[#4D76B4]'
              : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase">
            <span>Mensajes Pacientes</span>
            <Inbox className="w-4 h-4 text-[#4D76B4]" />
          </div>
          <div className="text-3xl font-black text-[#4D76B4] flex items-center gap-2">
            <span>{patientLeads.length}</span>
            {unreadLeadsCount > 0 && (
              <span className="text-xs bg-[#FFE571] text-[#2A2A2A] px-2 py-0.5 rounded-full font-bold">
                {unreadLeadsCount} nuevos
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#91A7BB]">Formularios "Contáctame"</p>
        </div>

        {/* Pending Rates Approval */}
        <div
          onClick={() => setActiveTab('tarifas_aprobacion')}
          className={`p-5 rounded-2xl border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeTab === 'tarifas_aprobacion'
              ? 'bg-[#4D76B4]/10 border-[#4D76B4]'
              : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase">
            <span>Tarifas por Aprobar</span>
            <DollarSign className="w-4 h-4 text-[#FFE571]" />
          </div>
          <div className="text-3xl font-black text-[#4D76B4]">
            {pendingRatesPsychologists.length}
          </div>
          <p className="text-[11px] text-[#91A7BB]">Baremos de Psicólogos</p>
        </div>

        {/* Posts in Pre-moderation */}
        <div
          onClick={() => setActiveTab('supervision_posts')}
          className={`p-5 rounded-2xl border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeTab === 'supervision_posts'
              ? 'bg-[#4D76B4]/10 border-[#4D76B4]'
              : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase">
            <span>Posts por Monitorear</span>
            <Hourglass className="w-4 h-4 text-[#FFE571]" />
          </div>
          <div className="text-3xl font-black text-[#4D76B4]">
            {pendingVlogPosts.length + pendingDebatePosts.length}
          </div>
          <p className="text-[11px] text-[#91A7BB]">Vlog & Debate en revisión</p>
        </div>

        {/* Pending Psychologists */}
        <div
          onClick={() => setActiveTab('verificaciones')}
          className={`p-5 rounded-2xl border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeTab === 'verificaciones'
              ? 'bg-[#4D76B4]/10 border-[#4D76B4]'
              : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase">
            <span>Psicólogos Pendientes</span>
            <Award className="w-4 h-4 text-[#FFE571]" />
          </div>
          <div className="text-3xl font-black text-[#2A2A2A]">
            {pendingApplicants.length}
          </div>
          <p className="text-[11px] text-[#91A7BB]">Títulos Fondo Negro</p>
        </div>

        {/* CMS / Content Elements */}
        <div
          onClick={() => setActiveTab('cms')}
          className={`p-5 rounded-2xl border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeTab === 'cms'
              ? 'bg-[#4D76B4]/10 border-[#4D76B4]'
              : 'bg-white border-[#91A7BB]/30 hover:border-[#4D76B4]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#91A7BB] uppercase">
            <span>Gestor de Contenido</span>
            <SlidersHorizontal className="w-4 h-4 text-[#4D76B4]" />
          </div>
          <div className="text-3xl font-black text-[#2A2A2A]">
            {techniques.length + rates.length}
          </div>
          <p className="text-[11px] text-[#91A7BB]">Técnicas, Tarifas y Logo</p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-[#91A7BB]/20 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('mensajes_pacientes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'mensajes_pacientes'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <Inbox className="w-4 h-4 text-[#FFE571]" />
          <span>Bandeja Pacientes (Contáctame)</span>
          {unreadLeadsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black">
              {unreadLeadsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tarifas_aprobacion')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'tarifas_aprobacion'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#FFE571]" />
          <span>Tarifas Psicólogos</span>
          {pendingRatesPsychologists.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black">
              {pendingRatesPsychologists.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('supervision_posts')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'supervision_posts'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <Hourglass className="w-4 h-4 text-[#FFE571]" />
          <span>Monitoreo de Posts</span>
          {pendingVlogPosts.length + pendingDebatePosts.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black">
              {pendingVlogPosts.length + pendingDebatePosts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verificaciones')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'verificaciones'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Verificación FPV</span>
          {pendingApplicants.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black">
              {pendingApplicants.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cms')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cms'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Gestor CMS y Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'usuarios'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios & Roles</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Auditoría</span>
        </button>
      </div>

      {/* TAB 1: BANDEJA DE MENSAJES DE PACIENTES (EXCLUSIVO SUPERADMIN) */}
      {activeTab === 'mensajes_pacientes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#2A2A2A]">
                Bandeja Confidencial de Pacientes (Formularios "Contáctame")
              </h2>
              <p className="text-xs text-[#91A7BB]">
                Mensajes recibidos exclusivamente por el SuperAdmin para valoración, asignación y coordinación de casos.
              </p>
            </div>
            <span className="text-xs font-bold text-[#4D76B4] bg-[#4D76B4]/10 px-3 py-1 rounded-full">
              Solo Visible para SuperAdmin
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {patientLeads.map((lead) => (
              <div
                key={lead.id}
                className={`p-6 rounded-3xl border transition-all ${
                  lead.status === 'No Leído'
                    ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                    : 'bg-white border-[#91A7BB]/30 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4D76B4] text-white flex items-center justify-center font-bold text-sm">
                        {lead.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#2A2A2A]">
                            {lead.fullName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.status === 'No Leído'
                              ? 'bg-amber-200 text-amber-900'
                              : lead.status === 'Contactado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#4D76B4] font-medium">
                          Edad: <strong>{lead.age} años</strong> • Cédula: <strong>{lead.idCard}</strong> • Teléfono: <strong>{lead.phone}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#91A7BB]/20 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#91A7BB] block">
                        Motivo de Consulta (Declarado por el paciente):
                      </span>
                      <p className="text-xs text-[#2A2A2A] leading-relaxed">
                        "{lead.consultationReason}"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#91A7BB]">
                      <span>
                        Profesional Destino: <strong className="text-[#2A2A2A]">{lead.targetPsychologistName}</strong> {lead.targetPsychologistFpv ? `(FPV ${lead.targetPsychologistFpv})` : ''}
                      </span>
                      <span>•</span>
                      <span>Fecha: {new Date(lead.createdAt).toLocaleString()}</span>
                      {lead.notes && (
                        <span className="text-[#4D76B4] italic font-medium">
                          Nota: {lead.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for SuperAdmin */}
                  <div className="flex flex-wrap md:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'En Revisión')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100"
                    >
                      En Revisión
                    </button>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'Contactado')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs"
                    >
                      Marcar Contactado
                    </button>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'Archivado')}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                    >
                      Archivar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {patientLeads.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8">
                <Inbox className="w-8 h-8 text-[#91A7BB] mx-auto mb-2" />
                <h4 className="font-bold text-[#2A2A2A]">No hay mensajes de pacientes aún</h4>
                <p className="text-xs text-[#91A7BB]">
                  Cuando los consultantes hagan clic en "Contáctame" en Comunidad, aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: APROBACIÓN DE TARIFAS DE PSICÓLOGOS */}
      {activeTab === 'tarifas_aprobacion' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#2A2A2A]">
                Aprobación de Baremos y Honorarios Profesionales
              </h2>
              <p className="text-xs text-[#91A7BB]">
                Supervisión obligatoria por el Fundador (Andrés Rojas) antes de que las tarifas se publiquen en la Comunidad.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFE571]/30 border border-[#FFE571] text-xs font-bold text-[#2A2A2A]">
              <ShieldCheck className="w-4 h-4 text-[#4D76B4]" />
              <span>Tope Máximo Actual: ${brandConfig.maxSessionRateLimitUsd || 100} USD</span>
            </div>
          </div>

          {pendingRatesPsychologists.length > 0 ? (
            <div className="space-y-4">
              {pendingRatesPsychologists.map((psych) => {
                const proposedBase = psych.pendingProposedRateUsd || psych.sessionRateUsd || 40;
                const isOverCap = proposedBase > (brandConfig.maxSessionRateLimitUsd || 100);

                return (
                  <div
                    key={psych.id}
                    className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-md space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#91A7BB]/20 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border border-[#4D76B4]/30 flex-shrink-0">
                          {psych.avatarUrl ? (
                            <img src={psych.avatarUrl} alt={psych.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[#4D76B4]">
                              {psych.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-[#2A2A2A]">{psych.name}</h3>
                            <span className="text-[10px] font-black uppercase text-[#4D76B4] bg-[#4D76B4]/10 px-2 py-0.5 rounded-md">
                              FPV {psych.fpvNumber}
                            </span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Postulación Pendiente
                            </span>
                          </div>
                          <p className="text-xs text-[#91A7BB] mt-0.5">
                            {psych.city || 'Venezuela / Online'} • Modificado:{' '}
                            {psych.rateUpdatedAt
                              ? new Date(psych.rateUpdatedAt).toLocaleDateString()
                              : 'Reciente'}
                          </p>
                        </div>
                      </div>

                      {/* Tarifa comparativa */}
                      <div className="bg-[#4D76B4]/5 p-3 rounded-2xl border border-[#4D76B4]/20 text-right">
                        <span className="text-[10px] font-bold uppercase text-[#91A7BB] block">
                          Tarifa Propuesta por Sesión:
                        </span>
                        <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
                          <span className="text-2xl font-black text-[#4D76B4]">${proposedBase}</span>
                          <span className="text-xs text-[#91A7BB]">USD / sesión</span>
                        </div>
                        {psych.sessionRateUsd && (
                          <span className="text-[10px] text-[#91A7BB] block">
                            (Tarifa anterior activa: ${psych.sessionRateUsd} USD)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Alerta de tope máximo */}
                    {isOverCap && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>
                          <strong>Atención:</strong> La tarifa propuesta de ${proposedBase} USD supera el tope ético de ${brandConfig.maxSessionRateLimitUsd || 100} USD fijado en la plataforma.
                        </span>
                      </div>
                    )}

                    {/* Breakdown de tarifas por trastorno */}
                    {psych.pendingProblemRates && psych.pendingProblemRates.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#4D76B4] block">
                          Desglose Propuesto por Trastorno / Complejidad Conductual:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {psych.pendingProblemRates.map((pr, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
                              <span className="text-[#2A2A2A] font-medium truncate mr-2">
                                {pr.disorder.split('(')[0]}
                              </span>
                              <span className="font-bold text-[#4D76B4]">${pr.priceUsd} USD</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nota del psicólogo */}
                    {psych.rateNote && (
                      <div className="p-3 rounded-xl bg-[#FFE571]/15 border border-[#FFE571]/50 text-xs text-[#2A2A2A]">
                        <strong>Nota justificativa del profesional:</strong> "{psych.rateNote}"
                      </div>
                    )}

                    {/* Botones de Aprobación */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (onRejectPsychologistRates) {
                            onRejectPsychologistRates(
                              psych.id,
                              'Tarifa no aprobada por exceder directrices éticas o requerir ajuste según baremos colegiales.'
                            );
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        Rechazar Propuesta
                      </button>
                      <button
                        onClick={() => {
                          if (onApprovePsychologistRates) {
                            onApprovePsychologistRates(psych.id);
                          }
                        }}
                        className="px-6 py-2 rounded-xl text-xs font-bold bg-[#4D76B4] text-white hover:bg-[#3d629a] transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4 text-[#FFE571]" />
                        <span>Aprobar Tarifas y Publicar en Comunidad</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8 space-y-2">
              <Check className="w-8 h-8 text-[#4D76B4] mx-auto mb-2" />
              <h4 className="font-bold text-[#2A2A2A]">Bandeja de tarifas al día</h4>
              <p className="text-xs text-[#91A7BB]">
                No hay propuestas de honorarios pendientes de revisión por los psicólogos en este momento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPERVISIÓN Y MONITOREO DE POSTS (VLOG & DEBATE) */}
      {activeTab === 'supervision_posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#2A2A2A]">
                Supervisión Previa de Publicaciones (Vlog & Debate Sociedad)
              </h2>
              <p className="text-xs text-[#91A7BB]">
                Todo lo que posteen los psicólogos o pacientes debe ser aprobado por ti antes de salir en vivo.
              </p>
            </div>
            <span className="text-xs font-bold text-[#4D76B4] bg-[#4D76B4]/10 px-3 py-1 rounded-full">
              {pendingVlogPosts.length + pendingDebatePosts.length} pendientes
            </span>
          </div>

          {/* Pending Vlog Posts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4D76B4] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Artículos para El Vlog ({pendingVlogPosts.length})</span>
            </h3>

            {pendingVlogPosts.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-[#4D76B4]/10 text-[#4D76B4] px-2 py-0.5 rounded-full">
                      {art.category}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Pendiente de Aprobación
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#2A2A2A]">{art.title}</h4>
                  <p className="text-xs text-[#2A2A2A]/80 line-clamp-2">{art.excerpt}</p>
                  <div className="text-[11px] text-[#91A7BB]">
                    Por: <strong>{art.authorName}</strong> ({art.authorRole}) • {art.publishedAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onApprovePost('vlog', art.id)}
                    className="px-4 py-2 rounded-xl bg-[#4D76B4] text-white font-bold text-xs hover:bg-[#3d629a] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4 text-[#FFE571]" />
                    <span>Aprobar y Publicar</span>
                  </button>
                  <button
                    onClick={() => onRejectPost('vlog', art.id, 'No cumple criterios de rigor empírico.')}
                    className="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}

            {pendingVlogPosts.length === 0 && (
              <p className="text-xs text-[#91A7BB] italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
                No hay artículos pendientes de revisión en El Vlog.
              </p>
            )}
          </div>

          {/* Pending Debate Topics */}
          <div className="space-y-4 pt-4 border-t border-[#91A7BB]/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4D76B4] flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Temas de Debate Sociedad ({pendingDebatePosts.length})</span>
            </h3>

            {pendingDebatePosts.map((deb) => (
              <div
                key={deb.id}
                className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-[#FFE571] text-[#2A2A2A] px-2 py-0.5 rounded-full">
                      {deb.epistemologicalTag}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Debate en Revisión
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#2A2A2A]">{deb.title}</h4>
                  <p className="text-xs text-[#2A2A2A]/80 line-clamp-2">{deb.content}</p>
                  <div className="text-[11px] text-[#91A7BB]">
                    Propuesto por: <strong>{deb.authorName}</strong> (FPV {deb.fpvNumber})
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onApprovePost('debate', deb.id)}
                    className="px-4 py-2 rounded-xl bg-[#4D76B4] text-white font-bold text-xs hover:bg-[#3d629a] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4 text-[#FFE571]" />
                    <span>Aprobar Debate</span>
                  </button>
                  <button
                    onClick={() => onRejectPost('debate', deb.id, 'Tema rechazado por la moderación.')}
                    className="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}

            {pendingDebatePosts.length === 0 && (
              <p className="text-xs text-[#91A7BB] italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
                No hay debates pendientes de revisión previa.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GESTOR DE CONTENIDO (CMS) & PERSONALIZACIÓN TOTAL */}
      {activeTab === 'cms' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#2A2A2A]">
              Gestor de Contenido (CMS), Menús, Permisos y Personalización
            </h2>
            <p className="text-xs text-[#91A7BB]">
              Facultad del Administrador para gestionar el menú del encabezado, permisos de publicación, visibilidad de baremos estadísticos, pie de página y catálogo clínico.
            </p>
          </div>

          {cmsSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{cmsSaveNotice}</span>
              </div>
              <button onClick={() => setCmsSaveNotice(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* A. HEADER MENU MANAGER (AGREGAR / ELIMINAR / OCULTAR BOTONES DEL ENCABEZADO) */}
          <div className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#91A7BB]/20 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#4D76B4]" />
                  <span>Botones del Menú de Encabezado (Header Navigation)</span>
                </h3>
                <p className="text-xs text-[#91A7BB]">
                  Activa, oculta, agrega o elimina botones visibles en la barra superior para todos los visitantes.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] self-start sm:self-auto">
                {navItems.filter((i) => i.isVisible).length} visibles de {navItems.length}
              </span>
            </div>

            {/* List of current menu buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-[#91A7BB]/25 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#2A2A2A] truncate">{item.label}</div>
                    <div className="text-[10px] text-[#91A7BB] font-mono truncate">ID: {item.id}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggleNavItem(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        item.isVisible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title={item.isVisible ? 'Ocultar botón' : 'Mostrar botón'}
                    >
                      {item.isVisible ? 'Visible' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => handleDeleteNavItem(item.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                      title="Eliminar botón del menú"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form to add a new menu button */}
            <form onSubmit={handleAddNavItem} className="p-4 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 space-y-3">
              <div className="text-xs font-bold text-[#4D76B4] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Nuevo Botón al Menú de Encabezado</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2A2A2A] mb-1">
                    Texto del Botón (Label) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Guías Clínicas"
                    value={newNavLabel}
                    onChange={(e) => setNewNavLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#91A7BB]/40 text-xs bg-white focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2A2A2A] mb-1">
                    Identificador de Sección (ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. guias_clinicas"
                    value={newNavId}
                    onChange={(e) => setNewNavId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#91A7BB]/40 text-xs bg-white font-mono focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-xl bg-[#4D76B4] text-white font-bold text-xs hover:bg-[#3d629a] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FFE571]" />
                    <span>Agregar Botón</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* B. PUBLISHING PERMISSIONS BY USER TYPE (PERMISOS DE PUBLICACIÓN) */}
          <div className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-xs space-y-5">
            <div className="border-b border-[#91A7BB]/20 pb-4">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4D76B4]" />
                <span>Permisos de Publicación por Tipo de Usuario</span>
              </h3>
              <p className="text-xs text-[#91A7BB]">
                Configura con precisión qué roles tienen autorización para redactar y publicar en cada área temática.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Division 1: Vlog Psicólogo - Psicólogo */}
              <div className="p-4 rounded-2xl border border-[#91A7BB]/25 bg-slate-50/50 space-y-3">
                <div className="font-bold text-xs text-[#2A2A2A] pb-2 border-b border-[#91A7BB]/20">
                  El Vlog: Psicólogo - Psicólogo
                  <span className="block text-[10px] text-[#91A7BB] font-normal mt-0.5">
                    Divulgación técnica, epistemología y citas científicas
                  </span>
                </div>
                <div className="space-y-2">
                  {(['SuperAdmin', 'Psicologo', 'Moderador', 'Paciente'] as UserRole[]).map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer text-xs text-[#2A2A2A]">
                      <input
                        type="checkbox"
                        checked={postingPerms.vlogPsychOnly?.includes(role)}
                        onChange={() => handleTogglePostingRole('vlogPsychOnly', role)}
                        className="w-4 h-4 rounded text-[#4D76B4] focus:ring-[#4D76B4]"
                      />
                      <span className="font-medium">{role === 'SuperAdmin' ? 'admi' : role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Division 2: Vlog Psicólogo - Paciente */}
              <div className="p-4 rounded-2xl border border-[#91A7BB]/25 bg-slate-50/50 space-y-3">
                <div className="font-bold text-xs text-[#2A2A2A] pb-2 border-b border-[#91A7BB]/20">
                  El Vlog: Psicólogo - Paciente
                  <span className="block text-[10px] text-[#91A7BB] font-normal mt-0.5">
                    Experiencias de pacientes y orientaciones de psicólogos
                  </span>
                </div>
                <div className="space-y-2">
                  {(['SuperAdmin', 'Psicologo', 'Moderador', 'Paciente'] as UserRole[]).map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer text-xs text-[#2A2A2A]">
                      <input
                        type="checkbox"
                        checked={postingPerms.vlogCommunity?.includes(role)}
                        onChange={() => handleTogglePostingRole('vlogCommunity', role)}
                        className="w-4 h-4 rounded text-[#4D76B4] focus:ring-[#4D76B4]"
                      />
                      <span className="font-medium">{role === 'SuperAdmin' ? 'admi' : role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Division 3: Debate y Sociedad */}
              <div className="p-4 rounded-2xl border border-[#91A7BB]/25 bg-slate-50/50 space-y-3">
                <div className="font-bold text-xs text-[#2A2A2A] pb-2 border-b border-[#91A7BB]/20">
                  Debate y Sociedad (Cultura)
                  <span className="block text-[10px] text-[#91A7BB] font-normal mt-0.5">
                    Filosofía conductista y metacontingencias (Lectura abierta)
                  </span>
                </div>
                <div className="space-y-2">
                  {(['SuperAdmin', 'Psicologo', 'Moderador', 'Paciente'] as UserRole[]).map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer text-xs text-[#2A2A2A]">
                      <input
                        type="checkbox"
                        checked={postingPerms.debateSociedad?.includes(role)}
                        onChange={() => handleTogglePostingRole('debateSociedad', role)}
                        className="w-4 h-4 rounded text-[#4D76B4] focus:ring-[#4D76B4]"
                      />
                      <span className="font-medium">{role === 'SuperAdmin' ? 'admi' : role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* C. RATE STATISTICS TOGGLES (PROMEDIO, MEDIANA, MODA) */}
          <div className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-xs space-y-5">
            <div className="border-b border-[#91A7BB]/20 pb-4">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4D76B4]" />
                <span>Visibilidad de Métricas Estadísticas de Tarifas (Baremos)</span>
              </h3>
              <p className="text-xs text-[#91A7BB]">
                Activa o desactiva qué indicadores matemáticos de tendencia central se mostrarán a los usuarios en la sección "Tarifas":
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-[#91A7BB]/20 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#2A2A2A]">Promedio (Media)</div>
                  <div className="text-[10px] text-[#91A7BB]">Suma ponderada / Total</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStat('showMean')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statsVis.showMean
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {statsVis.showMean ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-[#91A7BB]/20 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#2A2A2A]">Mediana</div>
                  <div className="text-[10px] text-[#91A7BB]">Punto central (50%)</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStat('showMedian')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statsVis.showMedian
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {statsVis.showMedian ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-[#91A7BB]/20 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#2A2A2A]">Moda</div>
                  <div className="text-[10px] text-[#91A7BB]">Honorario más frecuente</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStat('showMode')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statsVis.showMode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {statsVis.showMode ? 'Activado' : 'Desactivado'}
                </button>
              </div>
            </div>
          </div>

          {/* D. FOOTER CMS (MODIFICACIÓN DEL PIE DE PÁGINA) */}
          <div className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-xs space-y-5">
            <div className="border-b border-[#91A7BB]/20 pb-4">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4D76B4]" />
                <span>Gestor de Contenido del Pie de Página (Footer)</span>
              </h3>
              <p className="text-xs text-[#91A7BB]">
                Personaliza los textos, manifiesto, contactos y avisos del pie de página. (Nota: El FPV Nº 17522 ha sido retirado definitivamente del footer).
              </p>
            </div>

            <form onSubmit={handleSaveFooterConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Manifiesto Epistemológico
                  </label>
                  <textarea
                    rows={3}
                    value={footerState.manifestoText}
                    onChange={(e) => setFooterState({ ...footerState, manifestoText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Compromiso Ético y Rigor
                  </label>
                  <textarea
                    rows={3}
                    value={footerState.rigorCommitmentText}
                    onChange={(e) => setFooterState({ ...footerState, rigorCommitmentText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={footerState.contactEmail}
                    onChange={(e) => setFooterState({ ...footerState, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={footerState.contactPhone}
                    onChange={(e) => setFooterState({ ...footerState, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Ubicación / Despacho
                  </label>
                  <input
                    type="text"
                    value={footerState.locationText}
                    onChange={(e) => setFooterState({ ...footerState, locationText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Aviso de Copyright / Mensaje Personalizado
                </label>
                <input
                  type="text"
                  value={footerState.customNotice || ''}
                  onChange={(e) => setFooterState({ ...footerState, customNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4D76B4] text-white text-xs font-bold hover:bg-[#3d629a] transition-all shadow-xs"
                >
                  Guardar Pie de Página
                </button>
              </div>
            </form>
          </div>

          {/* E. ANDRÉS ROJAS PERSONAL RATES MANAGEMENT */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-[#4D76B4]/5 border-2 border-[#4D76B4]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#4D76B4]" />
                <span>Mis Honorarios Profesionales (Andrés Rojas - FPV 17522)</span>
              </h3>
              <span className="text-xs bg-[#4D76B4] text-white px-2.5 py-0.5 rounded-full font-bold">
                Aplicación Inmediata
              </span>
            </div>
            <p className="text-xs text-[#2A2A2A]/75">
              Como fundador y admi, puedes modificar directamente tus honorarios para la consulta clínica. Se actualizarán inmediatamente en tu perfil de Psicólogos Aliados y en el observatorio estadístico general.
            </p>

            <form onSubmit={handleSaveAndresRates} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#91A7BB]/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Tarifa Base por Sesión Estándar (USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#4D76B4]">$</span>
                    <input
                      type="number"
                      min="10"
                      max={maxRateLimitInput}
                      value={andresBaseRate}
                      onChange={(e) => setAndresBaseRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#91A7BB]/40 text-sm font-bold text-[#2A2A2A] focus:outline-hidden focus:border-[#4D76B4]"
                    />
                    <span className="text-xs text-[#91A7BB] whitespace-nowrap">USD / 50-60 min</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#91A7BB]/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Tope Máximo Global Permitido (${maxRateLimitInput} USD)
                  </label>
                  <p className="text-[11px] text-[#91A7BB]">
                    Tus honorarios se encuentran dentro del baremo ético de la plataforma.
                  </p>
                </div>
              </div>

              {/* Specific disorder rates for Andrés */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A2A2A]">
                  Honorarios por Trastorno Específico (Andrés Rojas):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CLINICAL_DISORDERS_LIST.map((d) => (
                    <div key={d.id} className="bg-white p-2.5 rounded-xl border border-[#91A7BB]/30 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#2A2A2A] truncate">
                        {d.name.split('(')[0]}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs font-bold text-[#4D76B4]">$</span>
                        <input
                          type="number"
                          min="10"
                          max={maxRateLimitInput}
                          value={andresDisorderRates[d.name] || andresBaseRate}
                          onChange={(e) =>
                            setAndresDisorderRates({
                              ...andresDisorderRates,
                              [d.name]: Number(e.target.value)
                            })
                          }
                          className="w-16 px-2 py-1 rounded-lg border border-[#91A7BB]/30 text-xs font-bold text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4D76B4] text-white text-xs font-bold hover:bg-[#3d629a] transition-all shadow-xs"
                >
                  Guardar Mis Tarifas
                </button>
              </div>
            </form>
          </div>

          {/* F. PLATFORM MAXIMUM RATE CAP ($100 DEFAULT) */}
          <div className="p-6 rounded-3xl bg-[#FFE571]/15 border-2 border-[#FFE571] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#4D76B4]" />
                <span>Límite Máximo Permitido por Sesión (Cap Ético Comunitario)</span>
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A]">
                Regulación Central
              </span>
            </div>
            <p className="text-xs text-[#2A2A2A]/80">
              Cualquier psicólogo que intente postular honorarios por encima de esta cantidad será bloqueado por el sistema. Actualmente fijado en <strong>${maxRateLimitInput} USD</strong> por sesión.
            </p>

            <form onSubmit={handleSaveMaxLimit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-[#4D76B4]">$</span>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={maxRateLimitInput}
                  onChange={(e) => setMaxRateLimitInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm font-bold bg-white text-[#2A2A2A] focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>
              <span className="text-xs text-[#91A7BB] font-semibold whitespace-nowrap">
                USD máximo por sesión
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4D76B4] text-white text-xs font-bold hover:bg-[#3d629a] transition-all shadow-xs"
              >
                Actualizar Límite de la Plataforma
              </button>
            </form>
          </div>

          {/* G. MANUAL LOGO & BRANDING CUSTOMIZER */}
          <div className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#4D76B4]" />
                <span>Personalización del Logo, Nombre y Subtítulo de Encabezado</span>
              </h3>
              <span className="text-xs text-[#4D76B4] font-bold">Identidad Activa</span>
            </div>

            <form onSubmit={handleSaveBrandConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Título de la Plataforma
                  </label>
                  <input
                    type="text"
                    value={siteTitleInput}
                    onChange={(e) => setSiteTitleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Subtítulo debajo de Psicogénesis en el Encabezado
                  </label>
                  <input
                    type="text"
                    value={headerSubtitleInput}
                    onChange={(e) => setHeaderSubtitleInput(e.target.value)}
                    placeholder="Por Andrés Rojas - F.P.V. 17.522"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  URL de Logo Personalizado (opcional)
                </label>
                <input
                  type="text"
                  placeholder="https://... o dejar vacío para isotipo oficial vectorial"
                  value={customLogoInput}
                  onChange={(e) => setCustomLogoInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Descripción del Fundador en Psicólogos Aliados (Andrés Rojas)
                </label>
                <textarea
                  rows={2}
                  value={missionInput}
                  onChange={(e) => setMissionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4D76B4] text-white text-xs font-bold hover:bg-[#3d629a] transition-all"
                >
                  Guardar Cambios de Identidad
                </button>
              </div>
            </form>
          </div>

          {/* 2. TECHNIQUES CMS MANAGEMENT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#4D76B4]" />
                <span>Gestión del Catálogo de Técnicas ({techniques.length})</span>
              </h3>
              <button
                onClick={() => setShowNewTechForm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4D76B4] text-white text-xs font-bold hover:bg-[#3d629a]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Nueva Técnica</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {techniques.map((tech) => (
                <div
                  key={tech.id}
                  className="p-4 rounded-2xl bg-white border border-[#91A7BB]/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#2A2A2A]">{tech.name}</div>
                    <div className="text-[11px] text-[#91A7BB]">{tech.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleItemVisibility('technique', tech.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold ${
                        tech.isVisible !== false ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 bg-gray-100'
                      }`}
                      title="Ocultar o mostrar en la web"
                    >
                      {tech.isVisible !== false ? 'Visible' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => onDeleteItem('technique', tech.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="Eliminar técnica"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. RATES CMS MANAGEMENT */}
          <div className="space-y-4 pt-4 border-t border-[#91A7BB]/20">
            <h3 className="font-bold text-base text-[#2A2A2A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4D76B4]" />
              <span>Gestión de Tarifas y Servicios ({rates.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rates.map((rate) => (
                <div
                  key={rate.id}
                  className="p-4 rounded-2xl bg-white border border-[#91A7BB]/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#2A2A2A]">{rate.title} (${rate.priceUsd} USD)</div>
                    <div className="text-[11px] text-[#91A7BB]">{rate.duration}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleItemVisibility('rate', rate.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold ${
                        rate.isVisible !== false ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 bg-gray-100'
                      }`}
                    >
                      {rate.isVisible !== false ? 'Visible' : 'Oculto'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICACIÓN DE PSICÓLOGOS (FONDO NEGRO Y FPV) */}
      {activeTab === 'verificaciones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2A2A2A]">
              Solicitudes Profesionales en Espera de Aprobación
            </h2>
            <span className="text-xs text-[#91A7BB]">
              Solo el SuperAdmin ({currentUser.name}) tiene facultades legales para autorizar psicólogos.
            </span>
          </div>

          {pendingApplicants.length > 0 ? (
            <div className="space-y-4">
              {pendingApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="p-6 rounded-3xl bg-white border border-[#91A7BB]/30 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] flex items-center justify-center font-bold text-lg">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[#2A2A2A]">
                            {applicant.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Pendiente de Validación
                          </span>
                        </div>
                        <div className="text-xs text-[#4D76B4] font-bold">
                          Colegiatura: FPV {applicant.fpvNumber} • {applicant.email} • {applicant.phone}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#2A2A2A]/80 leading-relaxed bg-[#91A7BB]/10 p-3 rounded-2xl">
                      <strong>Experiencia Clínica:</strong> {applicant.clinicalExperience || 'No especificada'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-[#91A7BB] block">
                          Trastornos que Aborda:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant.disordersAddressed?.map((d, i) => (
                            <span key={i} className="bg-gray-100 text-[#2A2A2A] px-2 py-0.5 rounded-md text-[10px]">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold uppercase text-[#91A7BB] block">
                          Técnicas Basadas en Evidencia:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant.behavioralTechniques?.map((t, i) => (
                            <span key={i} className="bg-[#4D76B4]/10 text-[#4D76B4] px-2 py-0.5 rounded-md text-[10px] font-semibold">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto flex-shrink-0">
                    <button
                      onClick={() => setInspectingUser(applicant)}
                      className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-black transition-colors"
                    >
                      <Eye className="w-4 h-4 text-[#FFE571]" />
                      <span>Inspeccionar Título Fondo Negro</span>
                    </button>

                    {isSuperAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprovePsychologist(applicant.id)}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#4D76B4] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#3d629a] transition-all"
                        >
                          <Check className="w-4 h-4 text-[#FFE571]" />
                          <span>Aprobar FPV</span>
                        </button>

                        <button
                          onClick={() => {
                            setInspectingUser(applicant);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-2.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8 space-y-2">
              <Check className="w-8 h-8 text-[#4D76B4] mx-auto" />
              <h4 className="font-bold text-[#2A2A2A]">Bandeja de verificación al día</h4>
              <p className="text-xs text-[#91A7BB]">
                No hay solicitudes pendientes de acreditación profesional en este momento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: USUARIOS & ROLES */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#91A7BB] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o FPV..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#91A7BB]">Filtrar por rol:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#91A7BB]/40 text-xs font-semibold text-[#2A2A2A] bg-white"
              >
                <option value="Todos">Todos</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Moderador">Moderador</option>
                <option value="Psicologo">Psicólogo</option>
                <option value="Paciente">Paciente</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#91A7BB]/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#91A7BB]/10 text-[#4D76B4] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Usuario</th>
                    <th className="px-6 py-3.5">Rol Actual</th>
                    <th className="px-6 py-3.5">Estado / FPV</th>
                    <th className="px-6 py-3.5">Acciones de Gobierno</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#91A7BB]/15">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#2A2A2A]">{u.name}</div>
                        <div className="text-[11px] text-[#91A7BB]">{u.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        {canModifyRoles && u.id !== currentUser.id ? (
                          <select
                            value={u.role}
                            onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                            className="px-2.5 py-1 rounded-lg border border-[#91A7BB]/40 font-bold text-xs text-[#4D76B4] bg-white"
                          >
                            <option value="SuperAdmin">SuperAdmin</option>
                            <option value="Moderador">Moderador</option>
                            <option value="Psicologo">Psicólogo</option>
                            <option value="Paciente">Paciente</option>
                          </select>
                        ) : (
                          <span className="font-bold text-[#4D76B4]">{u.role}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {u.isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[10px]">
                              <Ban className="w-3 h-3" /> Baneado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <Check className="w-3 h-3" /> Activo
                            </span>
                          )}

                          {u.fpvNumber && (
                            <div className="text-[11px] font-semibold text-[#4D76B4]">
                              FPV {u.fpvNumber} {u.isVerified ? '✓ Verificado' : '⏳ En espera'}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {u.id !== currentUser.id && (
                            u.isBanned ? (
                              <button
                                onClick={() => onUnbanUser(u.id, u.name)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                              >
                                Desbanear
                              </button>
                            ) : (
                              <button
                                onClick={() => setBanTargetUser(u)}
                                className="px-3 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-[11px] hover:bg-red-200 transition-colors"
                              >
                                Sancionar
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDITORÍA DE ACCIONES */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2A2A2A]">
              Registro Histórico de Auditoría y Moderación
            </h2>
            <span className="text-xs text-[#91A7BB]">
              Trazabilidad inmutable de intervenciones administrativas
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#91A7BB]/30 shadow-xs overflow-hidden">
            <div className="divide-y divide-[#91A7BB]/20">
              {moderationLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        log.action === 'BAN_USER' || log.action === 'CENSOR_POST'
                          ? 'bg-red-100 text-red-700'
                          : log.action === 'APPROVE_PSYCHOLOGIST' || log.action === 'APPROVE_POST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#4D76B4]/10 text-[#4D76B4]'
                      }`}>
                        {log.action}
                      </span>
                      <strong className="text-[#2A2A2A] font-semibold">{log.target}</strong>
                    </div>
                    <p className="text-xs text-[#2A2A2A]/75">{log.reason}</p>
                  </div>

                  <div className="text-right text-[11px] text-[#91A7BB] flex-shrink-0">
                    <div>Ejecutado por: <strong>{log.moderatorName}</strong> ({log.moderatorRole})</div>
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL: UNIVERSITY TITLE WITH BLACK BACKGROUND (FONDO NEGRO) */}
      {inspectingUser && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <button
              onClick={() => setInspectingUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#91A7BB]/20 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4D76B4] uppercase tracking-wider mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Visor de Verificación Oficial • Fondo Negro</span>
              </div>
              <h2 className="text-2xl font-bold text-[#2A2A2A]">
                Título Universitario en Fondo Negro: {inspectingUser.name}
              </h2>
              <p className="text-xs text-[#91A7BB]">
                Número de Colegiatura Declarado: <strong>FPV {inspectingUser.fpvNumber}</strong> • Documento: {inspectingUser.titleDocumentName || 'FONDO_NEGRO_OFICIAL.pdf'}
              </p>
            </div>

            <div className="bg-black text-white p-6 sm:p-10 rounded-2xl border-4 border-gray-800 shadow-2xl relative overflow-hidden font-serif">
              <div className="absolute right-8 bottom-8 w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center pointer-events-none rotate-12">
                <span className="text-[9px] uppercase tracking-widest text-white/30 text-center font-sans font-bold">
                  REGISTRADO<br />MINISTERIO<br />EDUCACIÓN SUP.
                </span>
              </div>

              <div className="text-center space-y-4 max-w-xl mx-auto border border-gray-700 p-6 sm:p-8 rounded-xl bg-gray-950/70">
                <div className="text-[10px] tracking-widest text-gray-400 uppercase font-sans">
                  REPÚBLICA BOLIVARIANA DE VENEZUELA
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-300 font-sans font-bold">
                  UNIVERSIDAD CENTRAL DE VENEZUELA • FACULTAD DE HUMANIDADES Y EDUCACIÓN
                </div>
                <div className="h-0.5 w-24 bg-gray-600 mx-auto" />

                <p className="text-xs text-gray-300 italic font-sans">
                  Por cuanto habiendo cumplido con todos los requisitos y evaluaciones académicas de ley, se confiere a:
                </p>

                <div className="text-2xl sm:text-3xl font-bold tracking-wider text-white py-2 uppercase border-y border-gray-700">
                  {inspectingUser.name}
                </div>

                <div className="text-sm font-bold tracking-widest text-[#FFE571] uppercase font-sans">
                  EL TÍTULO DE LICENCIADO EN PSICOLOGÍA
                </div>

                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Para que goce de todos los derechos y prerrogativas que las leyes de la República y la Federación de Psicólogos de Venezuela le otorgan.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 text-[10px] text-gray-400 font-sans border-t border-gray-800">
                  <div>
                    <div className="h-8 border-b border-gray-600 mb-1" />
                    <span>EL RECTOR</span>
                  </div>
                  <div>
                    <div className="h-8 border-b border-gray-600 mb-1" />
                    <span>EL SECRETARIO GENERAL</span>
                  </div>
                </div>

                <div className="pt-2 text-[9px] text-[#6BD4FF] font-sans font-semibold">
                  Anotado bajo el Nº 2049, Folio 112, Tomo XLVI • Registro Principal de Títulos
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white py-3 border-t border-[#91A7BB]/20 flex items-center justify-between z-10">
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
              >
                Cerrar Visor
              </button>

              {isSuperAdmin && !inspectingUser.isVerified && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200"
                  >
                    Rechazar Solicitud
                  </button>

                  <button
                    onClick={() => {
                      onApprovePsychologist(inspectingUser.id);
                      setInspectingUser(null);
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white text-xs font-bold shadow-md hover:bg-[#3d629a] flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#FFE571]" />
                    <span>Aprobar y Emitir Insignia FPV</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW TECHNIQUE FORM MODAL */}
      {showNewTechForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#91A7BB]/30 space-y-4">
            <h3 className="text-lg font-bold text-[#2A2A2A]">Agregar Nueva Técnica al Catálogo</h3>
            <form onSubmit={handleSaveNewTechnique} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4D76B4] mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#4D76B4] mb-1">Categoría</label>
                <select
                  value={newTechCategory}
                  onChange={(e) => setNewTechCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                >
                  <option value="Análisis Funcional">Análisis Funcional</option>
                  <option value="Terapias Contextuales (3ra Gen)">Terapias Contextuales (3ra Gen)</option>
                  <option value="Exposición y Desensibilización">Exposición y Desensibilización</option>
                  <option value="Condicionamiento Operante">Condicionamiento Operante</option>
                  <option value="Interconductismo">Interconductismo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#4D76B4] mb-1">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={newTechDesc}
                  onChange={(e) => setNewTechDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTechForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4D76B4] text-white text-xs font-bold"
                >
                  Guardar Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BAN MODAL */}
      {banTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              <span>Sancionar Usuario: {banTargetUser.name}</span>
            </h3>
            <p className="text-xs text-[#2A2A2A]/80">
              El usuario quedará impedido de crear temas y réplicas en la plataforma.
            </p>

            <form onSubmit={handleConfirmBan} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#2A2A2A] mb-1">
                  Causa del Baneo *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla el motivo del baneo..."
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBanTargetUser(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Aplicar Baneo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
