import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  BehavioralTechnique,
  TherapyRate,
  VlogArticle,
  ForumThread,
  ModerationLog,
  AppointmentBooking,
  PatientContactLead,
  SiteBrandConfig,
  ProblemRate
} from './types';
import {
  INITIAL_USERS,
  BEHAVIORAL_TECHNIQUES,
  THERAPY_RATES,
  VLOG_ARTICLES,
  DEBATE_SOCIEDAD_THREADS,
  INITIAL_MODERATION_LOGS,
  INITIAL_BOOKINGS,
  INITIAL_PATIENT_LEADS,
  INITIAL_BRAND_CONFIG
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AuthRequiredModal } from './components/AuthRequiredModal';
import { HomeView } from './components/views/HomeView';
import { TarifasView } from './components/views/TarifasView';
import { TecnicasView } from './components/views/TecnicasView';
import { ComunidadView } from './components/views/ComunidadView';
import { VlogView } from './components/views/VlogView';
import { DebateSociedadView } from './components/views/DebateSociedadView';
import { UneteView } from './components/views/UneteView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { canAccessAdminPanel, canInteract } from './utils/rbac';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & View Routing State
  const [currentSection, setCurrentSection] = useState<string>('inicio');

  // Brand Configuration State (Psicogénesis, Custom Logo, Founder copy)
  const [brandConfig, setBrandConfig] = useState<SiteBrandConfig>(INITIAL_BRAND_CONFIG);

  // RBAC & Users State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(INITIAL_USERS[0].id); // Defaults to Andrés Rojas (SuperAdmin)

  // Data State
  const [techniques, setTechniques] = useState<BehavioralTechnique[]>(BEHAVIORAL_TECHNIQUES);
  const [rates, setRates] = useState<TherapyRate[]>(THERAPY_RATES);
  const [articles, setArticles] = useState<VlogArticle[]>(VLOG_ARTICLES);
  const [debateThreads, setDebateThreads] = useState<ForumThread[]>(DEBATE_SOCIEDAD_THREADS);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(INITIAL_MODERATION_LOGS);
  const [bookings, setBookings] = useState<AppointmentBooking[]>(INITIAL_BOOKINGS);
  const [patientLeads, setPatientLeads] = useState<PatientContactLead[]>(INITIAL_PATIENT_LEADS);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const showToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Pending psychologist verifications count
  const pendingVerificationsCount = users.filter(
    (u) => u.role === 'Psicologo' && !u.isVerified
  ).length;

  // Unread patient messages count for SuperAdmin
  const unreadLeadsCount = patientLeads.filter((l) => l.status === 'No Leído').length;
  const pendingRatesCount = users.filter((u) => u.rateApprovalStatus === 'pending').length;

  // Total pending review items (leads + posts + verifications + rates)
  const pendingTotalAdminItems =
    pendingVerificationsCount +
    unreadLeadsCount +
    pendingRatesCount +
    articles.filter((a) => a.status === 'pending_review').length +
    debateThreads.filter((d) => d.status === 'pending_review').length;

  // Auth Required Modal State (for unregistered guests attempting to interact)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionContext, setAuthActionContext] = useState('realizar esta acción');

  const handleRequireAuth = (actionContext: string) => {
    setAuthActionContext(actionContext);
    setIsAuthModalOpen(true);
  };

  // Switch User handler (for testing different perspectives)
  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target) {
      showToast(`Sesión cambiada a: ${target.name} (${target.role})`, 'success');
      if (currentSection === 'admin' && !canAccessAdminPanel(target.role)) {
        setCurrentSection('inicio');
      }
    }
  };

  const handleOpenBookingModal = (serviceId?: string) => {
    if (!canInteract(currentUser)) {
      handleRequireAuth('agendar una consulta clínica');
      return;
    }
    setBookingServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  // SEND PATIENT LEAD (Formulario "Contáctame" en Comunidad)
  // This message is sent EXCLUSIVELY to SuperAdmin (Andrés Rojas)
  const handleSendContactLead = (
    leadData: Omit<PatientContactLead, 'id' | 'status' | 'createdAt'>
  ) => {
    const newLead: PatientContactLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'No Leído',
      createdAt: new Date().toISOString()
    };
    setPatientLeads([newLead, ...patientLeads]);
    showToast(
      `Mensaje enviado confidencialmente al SuperAdmin (Andrés Rojas) para contactar a ${leadData.targetPsychologistName}.`,
      'success'
    );
  };

  // Update Patient Lead Status in Admin
  const handleUpdateLeadStatus = (
    leadId: string,
    status: PatientContactLead['status'],
    notes?: string
  ) => {
    setPatientLeads(
      patientLeads.map((l) =>
        l.id === leadId ? { ...l, status, notes: notes || l.notes } : l
      )
    );
    showToast(`Estado del paciente actualizado a: ${status}`, 'success');
  };

  // PRE-MODERATION: Approve Post in Vlog or Debate
  const handleApprovePost = (type: 'vlog' | 'debate', id: string) => {
    if (type === 'vlog') {
      setArticles(
        articles.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
      );
    } else {
      setDebateThreads(
        debateThreads.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
      );
    }

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'APPROVE_POST',
      target: `${type === 'vlog' ? 'Artículo de Vlog' : 'Tema de Debate'}: ID ${id}`,
      reason: 'Aprobación formal por el SuperAdmin para publicación abierta.'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast('Publicación aprobada y publicada en vivo', 'success');
  };

  // PRE-MODERATION: Reject / Censor Post
  const handleRejectPost = (type: 'vlog' | 'debate', id: string, reason: string) => {
    if (type === 'vlog') {
      setArticles(
        articles.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
      );
    } else {
      setDebateThreads(
        debateThreads.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d))
      );
    }

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'REJECT_POST',
      target: `${type === 'vlog' ? 'Artículo de Vlog' : 'Tema de Debate'}: ID ${id}`,
      reason
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast('Publicación rechazada por la moderación', 'warning');
  };

  // CMS: Toggle Item Visibility
  const handleToggleItemVisibility = (type: 'technique' | 'rate', id: string) => {
    if (type === 'technique') {
      setTechniques(
        techniques.map((t) =>
          t.id === id ? { ...t, isVisible: t.isVisible === false ? true : false } : t
        )
      );
    } else {
      setRates(
        rates.map((r) =>
          r.id === id ? { ...r, isVisible: r.isVisible === false ? true : false } : r
        )
      );
    }
    showToast('Visibilidad actualizada en la web');
  };

  // CMS: Delete Item
  const handleDeleteItem = (type: 'technique' | 'rate' | 'psychologist', id: string) => {
    if (type === 'technique') {
      setTechniques(techniques.filter((t) => t.id !== id));
    } else if (type === 'rate') {
      setRates(rates.filter((r) => r.id !== id));
    } else if (type === 'psychologist') {
      setUsers(users.filter((u) => u.id !== id));
    }

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'UPDATE_CMS',
      target: `Elemento CMS eliminado: ${type} ID ${id}`,
      reason: 'Eliminación manual por el SuperAdmin'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast('Elemento eliminado del catálogo');
  };

  // CMS: Add Technique
  const handleAddTechnique = (newTech: BehavioralTechnique) => {
    setTechniques([...techniques, newTech]);
    showToast(`Técnica "${newTech.name}" agregada al catálogo`, 'success');
  };

  // CMS: Add Rate
  const handleAddRate = (newRate: TherapyRate) => {
    setRates([...rates, newRate]);
    showToast(`Tarifa "${newRate.title}" agregada al catálogo`, 'success');
  };

  // CMS: Update Brand Logo & Title
  const handleUpdateBrandConfig = (newConfig: Partial<SiteBrandConfig>) => {
    setBrandConfig({ ...brandConfig, ...newConfig });
    showToast('Configuración de identidad y logo actualizada', 'success');
  };

  // SuperAdmin Approve Psychologist Rates
  const handleApprovePsychologistRates = (psychologistId: string) => {
    const psych = users.find((u) => u.id === psychologistId);
    if (!psych) return;

    const approvedBase = psych.pendingProposedRateUsd || psych.sessionRateUsd || 40;
    const approvedProblems = psych.pendingProblemRates || psych.problemRates || [];

    setUsers(
      users.map((u) =>
        u.id === psychologistId
          ? {
              ...u,
              sessionRateUsd: approvedBase,
              problemRates: approvedProblems,
              rateApprovalStatus: 'approved',
              pendingProposedRateUsd: undefined,
              pendingProblemRates: undefined,
              rateNote: undefined
            }
          : u
      )
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'APPROVE_RATE',
      target: `Tarifas aprobadas: ${psych.name} ($${approvedBase} USD/sesión)`,
      reason: 'Aprobación formal de baremos por el Fundador (Andrés Rojas).'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Tarifas de ${psych.name} aprobadas y publicadas en la Comunidad.`, 'success');
  };

  // SuperAdmin Reject Psychologist Rates
  const handleRejectPsychologistRates = (psychologistId: string, reason: string) => {
    const psych = users.find((u) => u.id === psychologistId);
    if (!psych) return;

    setUsers(
      users.map((u) =>
        u.id === psychologistId
          ? {
              ...u,
              rateApprovalStatus: 'rejected',
              rateNote: reason
            }
          : u
      )
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'REJECT_RATE',
      target: `Tarifas rechazadas: ${psych.name}`,
      reason
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Tarifas de ${psych.name} rechazadas.`, 'warning');
  };

  // Psychologist Propose Rates
  const handleProposeRates = (
    psychologistId: string,
    baseRateUsd: number,
    problemRates: ProblemRate[],
    proposalNote: string
  ) => {
    setUsers(
      users.map((u) =>
        u.id === psychologistId
          ? {
              ...u,
              pendingProposedRateUsd: baseRateUsd,
              pendingProblemRates: problemRates,
              rateApprovalStatus: 'pending',
              rateNote: proposalNote,
              rateUpdatedAt: new Date().toISOString()
            }
          : u
      )
    );
    showToast(
      'Tus tarifas han sido enviadas a la Dirección Clínica (Andrés Rojas) para su revisión.',
      'success'
    );
  };

  // Update Andrés Rojas Own Rates
  const handleUpdateAndresRates = (baseRateUsd: number, problemRates: ProblemRate[]) => {
    setBrandConfig((prev) => ({
      ...prev,
      andresSessionRateUsd: baseRateUsd,
      andresProblemRates: problemRates
    }));

    setUsers(
      users.map((u) =>
        u.id === 'user-andres-rojas'
          ? {
              ...u,
              sessionRateUsd: baseRateUsd,
              problemRates: problemRates,
              rateApprovalStatus: 'approved'
            }
          : u
      )
    );
    showToast('Tus honorarios profesionales se actualizaron de inmediato.', 'success');
  };

  // Update Platform Maximum Session Rate Ceiling
  const handleUpdateMaxSessionRateLimit = (newLimit: number) => {
    setBrandConfig((prev) => ({
      ...prev,
      maxSessionRateLimitUsd: newLimit
    }));
    showToast(`Tope arancelario máximo de la plataforma fijado en $${newLimit} USD.`, 'success');
  };

  // Debate Thread creation
  const handleAddDebateThread = (
    newThreadData: Omit<ForumThread, 'id' | 'views' | 'likes' | 'createdAt' | 'replies'>
  ) => {
    const newThread: ForumThread = {
      ...newThreadData,
      id: `deb-${Date.now()}`,
      views: 1,
      likes: 1,
      createdAt: new Date().toISOString(),
      replies: []
    };
    setDebateThreads([newThread, ...debateThreads]);
    if (newThread.status === 'pending_review') {
      showToast('Debate enviado a revisión por el SuperAdmin', 'success');
    } else {
      showToast('Debate publicado en Debate Sociedad', 'success');
    }
  };

  // Debate Reply
  const handleAddDebateReply = (threadId: string, replyContent: string) => {
    const updated = debateThreads.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [
            ...t.replies,
            {
              id: `rep-${Date.now()}`,
              authorId: currentUser.id,
              authorName: currentUser.name,
              authorRole: currentUser.role,
              isVerifiedAuthor: currentUser.isVerified,
              fpvNumber: currentUser.fpvNumber,
              content: replyContent,
              createdAt: new Date().toISOString(),
              likes: 0
            }
          ]
        };
      }
      return t;
    });
    setDebateThreads(updated);
    showToast('Intervención registrada en el debate', 'success');
  };

  // Censor Thread
  const handleToggleCensorThread = (threadId: string) => {
    const target = debateThreads.find((t) => t.id === threadId);
    if (!target) return;
    const newCensored = !target.isCensored;

    setDebateThreads(
      debateThreads.map((t) => (t.id === threadId ? { ...t, isCensored: newCensored } : t))
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: newCensored ? 'CENSOR_POST' : 'UNCENSOR_POST',
      target: `Hilo: "${target.title}"`,
      reason: newCensored ? 'Censura por incumplimiento de directriz' : 'Restauración por moderación'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(newCensored ? 'Hilo censurado' : 'Hilo restaurado');
  };

  const handleTogglePinThread = (threadId: string) => {
    setDebateThreads(
      debateThreads.map((t) => (t.id === threadId ? { ...t, isPinned: !t.isPinned } : t))
    );
    showToast('Estado de fijado actualizado');
  };

  const handleToggleCloseThread = (threadId: string) => {
    setDebateThreads(
      debateThreads.map((t) => (t.id === threadId ? { ...t, isClosed: !t.isClosed } : t))
    );
    showToast('Estado de apertura de hilo actualizado');
  };

  // Ban User
  const handleBanUser = (targetUserId: string, targetUserName: string, reason: string) => {
    setUsers(
      users.map((u) => (u.id === targetUserId ? { ...u, isBanned: true, banReason: reason } : u))
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'BAN_USER',
      target: `${targetUserName} (${targetUserId})`,
      reason
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Usuario ${targetUserName} sancionado y baneado`, 'warning');
  };

  // Unban User
  const handleUnbanUser = (targetUserId: string, targetUserName: string) => {
    setUsers(
      users.map((u) => (u.id === targetUserId ? { ...u, isBanned: false, banReason: undefined } : u))
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'UNBAN_USER',
      target: `${targetUserName} (${targetUserId})`,
      reason: 'Levantamiento formal de sanción tras revisión'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Sanción levantada para ${targetUserName}`, 'success');
  };

  // SuperAdmin Approve Psychologist
  const handleApprovePsychologist = (userId: string) => {
    const applicant = users.find((u) => u.id === userId);
    if (!applicant) return;

    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
    );

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'APPROVE_PSYCHOLOGIST',
      target: `${applicant.name} (FPV ${applicant.fpvNumber})`,
      reason: 'Aprobación de credencial FPV y título en fondo negro validado por Andrés Rojas.'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Psicólogo ${applicant.name} aprobado y habilitado con insignia FPV`, 'success');
  };

  // SuperAdmin Reject Psychologist
  const handleRejectPsychologist = (userId: string, reason: string) => {
    const applicant = users.find((u) => u.id === userId);
    if (!applicant) return;

    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'REJECT_PSYCHOLOGIST',
      target: `${applicant.name} (FPV ${applicant.fpvNumber})`,
      reason
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    setUsers(users.filter((u) => u.id !== userId));
    showToast(`Solicitud de ${applicant.name} rechazada`, 'warning');
  };

  // SuperAdmin Assign Roles
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const target = users.find((u) => u.id === userId);
    const logEntry: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderatorName: currentUser.name,
      moderatorRole: currentUser.role,
      action: 'UPDATE_ROLE',
      target: `${target?.name}: Nuevo rol ${newRole}`,
      reason: 'Reasignación manual de permisos por el SuperAdmin'
    };
    setModerationLogs([logEntry, ...moderationLogs]);
    showToast(`Rol actualizado a: ${newRole}`, 'success');
  };

  // Add Article in Vlog
  const handleAddArticle = (articleData: Omit<VlogArticle, 'id' | 'publishedAt'>) => {
    const newArt: VlogArticle = {
      ...articleData,
      id: `art-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setArticles([newArt, ...articles]);
    if (newArt.status === 'pending_review') {
      showToast('Artículo enviado a revisión por el SuperAdmin', 'success');
    } else {
      showToast('Artículo publicado exitosamente en El Vlog', 'success');
    }
  };

  // Register Patient Pathway
  const handleRegisterPatient = (patientData: {
    name: string;
    email: string;
    phone: string;
    consultationReason: string;
  }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone,
      role: 'Paciente',
      isVerified: false,
      isBanned: false,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);

    // Also send lead to SuperAdmin
    const newLead: PatientContactLead = {
      id: `lead-${Date.now()}`,
      fullName: patientData.name,
      age: 30,
      idCard: 'Por registrar',
      phone: patientData.phone,
      consultationReason: patientData.consultationReason,
      targetPsychologistId: 'user-andres-rojas',
      targetPsychologistName: 'Andrés Rojas',
      targetPsychologistFpv: '17522',
      status: 'No Leído',
      createdAt: new Date().toISOString()
    };
    setPatientLeads([newLead, ...patientLeads]);
    showToast(`¡Bienvenido/a, ${patientData.name}! Tu registro ha sido procesado`, 'success');
  };

  // Register Psychologist Pathway
  const handleRegisterPsychologist = (psychData: {
    name: string;
    email: string;
    phone: string;
    fpvNumber: string;
    titleDocumentName: string;
    titleDocumentUrl: string;
    clinicalExperience: string;
    disordersAddressed: string[];
    behavioralTechniques: string[];
  }) => {
    const newPsych: User = {
      id: `user-${Date.now()}`,
      name: psychData.name,
      email: psychData.email,
      phone: psychData.phone,
      role: 'Psicologo',
      fpvNumber: psychData.fpvNumber,
      isVerified: false, // Requires SuperAdmin manual approval
      isBanned: false,
      titleDocumentName: psychData.titleDocumentName,
      titleDocumentUrl: psychData.titleDocumentUrl,
      clinicalExperience: psychData.clinicalExperience,
      disordersAddressed: psychData.disordersAddressed,
      behavioralTechniques: psychData.behavioralTechniques,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newPsych]);
    showToast(`Solicitud de ${psychData.name} enviada al SuperAdmin con título en fondo negro`, 'success');
  };

  // Save Booking
  const handleSaveBooking = (bookingData: Omit<AppointmentBooking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: AppointmentBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };
    setBookings([newBooking, ...bookings]);
    showToast('Solicitud de cita recibida. Nos contactaremos en breve.', 'success');
  };

  // Update Booking Status
  const handleUpdateBookingStatus = (bookingId: string, status: AppointmentBooking['status']) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    showToast(`Cita marcada como: ${status}`, 'success');
  };

  // Update Psychologist Availability & Schedule (disponible / no disponible)
  const handleUpdatePsychologistAvailability = (
    psychologistId: string,
    status: 'disponible' | 'no_disponible',
    scheduleHours?: string
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === psychologistId
          ? {
              ...u,
              availabilityStatus: status,
              isAvailable: status === 'disponible',
              scheduleHours: scheduleHours !== undefined ? scheduleHours : u.scheduleHours
            }
          : u
      )
    );
    showToast(
      `Disponibilidad actualizada a: ${status === 'disponible' ? 'Disponible' : 'No disponible'}`,
      'success'
    );
  };

  // Add Comment in Vlog Article (Reddit-style threading)
  const handleAddArticleComment = (
    articleId: string,
    content: string,
    parentId?: string,
    isAnonymous?: boolean
  ) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const currentComments = art.comments || [];
          const newComment = {
            id: `comm-${Date.now()}`,
            parentId,
            authorId: currentUser.id,
            authorName: isAnonymous ? 'Anónimo' : currentUser.name,
            authorRole: currentUser.role,
            isVerifiedAuthor: currentUser.isVerified,
            fpvNumber: !isAnonymous ? currentUser.fpvNumber : undefined,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isAnonymous,
            realAuthorName: currentUser.name
          };
          return {
            ...art,
            comments: [...currentComments, newComment]
          };
        }
        return art;
      })
    );
    showToast('Comentario agregado a la discusión', 'success');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  // Filter visible techniques & rates for non-admin views
  const visibleTechniques = techniques.filter((t) => t.isVisible !== false);
  const visibleRates = rates.filter((r) => r.isVisible !== false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2A2A2A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
              toastMessage.type === 'success'
                ? 'bg-[#4D76B4] text-white border-[#4D76B4]'
                : 'bg-amber-500 text-white border-amber-600'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#FFE571] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenBookingModal={handleOpenBookingModal}
        pendingVerificationsCount={pendingTotalAdminItems}
        brandConfig={brandConfig}
        onOpenAuthModal={(ctx) => handleRequireAuth(ctx)}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-1">
        {currentSection === 'inicio' && (
          <HomeView
            onNavigate={setCurrentSection}
            onOpenBookingModal={() => handleOpenBookingModal()}
            brandConfig={brandConfig}
          />
        )}

        {/* TARIFAS: Bound to statsVisibility configured by Admin */}
        {currentSection === 'tarifas' && (
          <TarifasView
            psychologists={users}
            maxSessionLimitUsd={brandConfig.maxSessionRateLimitUsd || 100}
            onNavigate={setCurrentSection}
            onOpenBookingModal={handleOpenBookingModal}
            isGuest={!canInteract(currentUser)}
            onRequireAuth={handleRequireAuth}
            statsVisibility={brandConfig.statsVisibility}
          />
        )}

        {currentSection === 'tecnicas' && (
          <TecnicasView
            techniques={visibleTechniques}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {/* PSICÓLOGOS ALIADOS (COMUNIDAD): Visible for all user types */}
        {(currentSection === 'psicologos_aliados' || currentSection === 'comunidad') && (
          <ComunidadView
            psychologists={users}
            brandConfig={brandConfig}
            currentUser={currentUser}
            onSendContactLead={handleSendContactLead}
            onSubmitRatesProposal={handleProposeRates}
            onRequireAuth={handleRequireAuth}
            onNavigateToTarifas={() => setCurrentSection('tarifas')}
            onUpdatePsychologistAvailability={handleUpdatePsychologistAvailability}
          />
        )}

        {/* EL VLOG: Divisions (Psych-Psych & Psych-Patient) with image support and threaded discussions */}
        {currentSection === 'vlog' && (
          <VlogView
            articles={articles}
            currentUser={currentUser}
            onAddArticle={handleAddArticle}
            onRequireAuth={handleRequireAuth}
            brandConfig={brandConfig}
            onAddArticleComment={handleAddArticleComment}
          />
        )}

        {/* DEBATE SOCIEDAD: Cultural & philosophical discussions open for all to read */}
        {currentSection === 'debate-sociedad' && (
          <DebateSociedadView
            threads={debateThreads}
            currentUser={currentUser}
            onNavigate={setCurrentSection}
            onAddThread={handleAddDebateThread}
            onAddReply={handleAddDebateReply}
            onToggleCensorThread={handleToggleCensorThread}
            onTogglePinThread={handleTogglePinThread}
            onToggleCloseThread={handleToggleCloseThread}
            onBanUser={handleBanUser}
            brandConfig={brandConfig}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentSection === 'unete' && (
          <UneteView
            onRegisterPatient={handleRegisterPatient}
            onRegisterPsychologist={handleRegisterPsychologist}
          />
        )}

        {/* ADMIN DASHBOARD: SuperAdmin and Moderator Panel */}
        {currentSection === 'admin' && canAccessAdminPanel(currentUser.role) && (
          <AdminDashboardView
            currentUser={currentUser}
            users={users}
            moderationLogs={moderationLogs}
            bookings={bookings}
            patientLeads={patientLeads}
            vlogArticles={articles}
            debateThreads={debateThreads}
            techniques={techniques}
            rates={rates}
            brandConfig={brandConfig}
            onUpdateBrandConfig={handleUpdateBrandConfig}
            onApprovePsychologist={handleApprovePsychologist}
            onRejectPsychologist={handleRejectPsychologist}
            onUpdateUserRole={handleUpdateUserRole}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onToggleItemVisibility={handleToggleItemVisibility}
            onDeleteItem={handleDeleteItem}
            onAddTechnique={handleAddTechnique}
            onAddRate={handleAddRate}
            onApprovePsychologistRates={handleApprovePsychologistRates}
            onRejectPsychologistRates={handleRejectPsychologistRates}
            onUpdateAndresRates={handleUpdateAndresRates}
            onUpdateMaxSessionRateLimit={handleUpdateMaxSessionRateLimit}
          />
        )}
      </main>

      {/* Booking Appointment Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rates={visibleRates}
        selectedServiceId={bookingServiceId}
        onSaveBooking={handleSaveBooking}
      />

      {/* Auth Required Modal (Interaction Gate for Unregistered Guests) */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginAs={handleSwitchUser}
        actionContext={authActionContext}
        onRegisterPatient={handleRegisterPatient}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentSection} brandConfig={brandConfig} />
    </div>
  );
}
