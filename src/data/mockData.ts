import {
  User,
  BehavioralTechnique,
  TherapyRate,
  VlogArticle,
  ForumThread,
  ModerationLog,
  AppointmentBooking,
  PatientContactLead,
  SiteBrandConfig
} from '../types';

export const INITIAL_BRAND_CONFIG: SiteBrandConfig = {
  siteTitle: 'Psicogénesis',
  headerSubtitle: 'Por Andrés Rojas - F.P.V. 17.522',
  logoType: 'official_svg',
  andresMissionStatement:
    'He decidido crear esta página para que la investigación, la comunidad psicocientífica unan fuerzas a los que gritan ayuda.',
  andresPhotoUrl: '/assets/aistudio/584007706_32422646247350895_2090936131343737151_n-2_88d0f364.jpg',
  maxSessionRateLimitUsd: 100,
  andresSessionRateUsd: 45,
  andresProblemRates: [
    { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 50 },
    { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 45 },
    { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 45 },
    { disorder: 'Depresión Mayor y Distimia', priceUsd: 45 },
    { disorder: 'Conflictos de Pareja e Interpersonales', priceUsd: 50 },
    { disorder: 'Dolor Crónico y Somático', priceUsd: 45 }
  ],
  navMenuItems: [
    { id: 'inicio', label: 'Inicio', isVisible: true },
    { id: 'tarifas', label: 'Tarifas', isVisible: true },
    { id: 'tecnicas', label: 'Técnicas', isVisible: true },
    { id: 'psicologos_aliados', label: 'Psicólogos aliados', isVisible: true },
    { id: 'vlog', label: 'El Vlog', isVisible: true },
    { id: 'debate-sociedad', label: 'Debate Sociedad', isVisible: true },
    { id: 'unete', label: 'Únete', isVisible: true }
  ],
  postingPermissions: {
    vlogPsychOnly: ['SuperAdmin', 'Moderador', 'Psicologo'],
    vlogCommunity: ['SuperAdmin', 'Moderador', 'Psicologo', 'Paciente'],
    debateSociedad: ['SuperAdmin', 'Moderador', 'Psicologo']
  },
  statsVisibility: {
    showMean: true,
    showMedian: true,
    showMode: true
  },
  footerConfig: {
    manifestoText:
      'Servicio de Psicología Clínica fundamentado de manera estricta y exclusiva en el Análisis de la Conducta, el Conductismo Radical, el Interconductismo y las Terapias Contextuales de Tercera Generación (ACT, DBT, FAP, Activación Conductual).',
    rigorCommitmentText:
      'Rechazamos categóricamente modelos no avalados científicamente, pseudociencias y explicaciones mentalistas sin respaldo experimental. Toda intervención se basa en datos, líneas base y formulaciones funcionales reproducibles.',
    contactEmail: 'RojasBandres@gmail.com',
    contactPhone: '+58 (412) 555-0199',
    locationText: 'Caracas, Venezuela / Consulta Online Global',
    customNotice: 'Atención psicológica profesional y divulgación científica rigurosa.'
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-andres-rojas',
    name: 'Andrés Rojas',
    email: 'RojasBandres@gmail.com',
    phone: '+58 412-5550199',
    role: 'SuperAdmin',
    fpvNumber: '17522',
    isVerified: true,
    isBanned: false,
    avatarUrl: '/assets/aistudio/584007706_32422646247350895_2090936131343737151_n-2_88d0f364.jpg',
    city: 'Caracas, Venezuela / Consulta Global Online',
    consultationModality: 'Online y Presencial',
    bio: 'He decidido crear esta página para que la investigación, la comunidad psicocientífica unan fuerzas a los que gritan ayuda.',
    clinicalExperience: 'Psicólogo y administrador de recursos humanos con experiencia en análisis funcional de la conducta en entornos clínicos y organizacionales.',
    availabilityStatus: 'disponible',
    scheduleHours: 'Lunes a Viernes: 8:00 AM - 5:00 PM | Sábados: 9:00 AM - 1:00 PM',
    disordersAddressed: [
      'Trastornos de Ansiedad y Fobias',
      'Depresión Mayor y Episodios Afectivos',
      'Trastorno Obsesivo-Compulsivo (TOC)',
      'Desregulación Emocional y Trastorno Límite',
      'Crisis de Pánico y Evitación Experiencial'
    ],
    behavioralTechniques: [
      'Análisis Funcional de la Conducta (ABC)',
      'Activación Conductual para la Depresión (BA)',
      'Terapia de Aceptación y Compromiso (ACT)',
      'Psicoterapia Analítico Funcional (FAP)',
      'Exposición con Prevención de Respuesta (EPR)'
    ],
    sessionRateUsd: 45,
    problemRates: [
      { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 50 },
      { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 45 },
      { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 45 },
      { disorder: 'Depresión Mayor y Distimia', priceUsd: 45 },
      { disorder: 'Conflictos de Pareja e Interpersonales', priceUsd: 50 }
    ],
    rateApprovalStatus: 'approved',
    createdAt: '2024-01-15'
  },
  {
    id: 'user-mariana-gomez',
    name: 'Lic. Mariana Gómez',
    email: 'mariana.gomez@conductual.org',
    phone: '+58 414-7773210',
    role: 'Moderador',
    fpvNumber: '16890',
    isVerified: true,
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80',
    city: 'Caracas / Online',
    consultationModality: 'Online (Videollamada)',
    bio: 'Práctica clínica orientada a la desensibilización sistemática y el entrenamiento en habilidades de regulación emocional dialéctica.',
    clinicalExperience: '8 años de práctica clínica contextual en consultorio y docencia en Principios de Aprendizaje y Condicionamiento Operante.',
    availabilityStatus: 'disponible',
    scheduleHours: 'Lunes a Jueves: 9:00 AM - 4:00 PM',
    disordersAddressed: [
      'Fobias Específicas',
      'Ansiedad Generalizada',
      'Desregulación Emocional',
      'Bloqueos Académicos y Procrastinación'
    ],
    behavioralTechniques: [
      'Desensibilización Sistemática',
      'Terapia Dialéctica Conductual (DBT)',
      'Moldeamiento Operante',
      'Entrenamiento en Relajación Progresiva'
    ],
    sessionRateUsd: 40,
    problemRates: [
      { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 40 },
      { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 45 },
      { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 40 }
    ],
    rateApprovalStatus: 'approved',
    createdAt: '2024-03-10'
  },
  {
    id: 'user-carlos-parra',
    name: 'Lic. Carlos Parra',
    email: 'carlos.parra.psi@gmail.com',
    phone: '+58 424-3321980',
    role: 'Psicologo',
    fpvNumber: '18401',
    isVerified: true,
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
    city: 'Valencia / Online',
    consultationModality: 'Online y Presencial',
    bio: 'Intervención en contingencias interpersonales y análisis del lenguaje clínico mediante FAP y RFT.',
    clinicalExperience: 'Especialista en Psicoterapia Analítico Funcional (FAP) e intervención conductual en adultos y parejas.',
    availabilityStatus: 'no_disponible',
    scheduleHours: 'Martes a Sábados: 10:00 AM - 6:00 PM',
    disordersAddressed: [
      'Dificultades Interpersonales y Aislamiento',
      'Evitación Experiencial Crónica',
      'Problemas de Pareja y Coerción Relacional',
      'Duelo Complicado'
    ],
    behavioralTechniques: [
      'Psicoterapia Analítico Funcional (FAP)',
      'Terapia de Aceptación y Compromiso (ACT)',
      'Análisis de Contingencias Interconductuales',
      'Contratos de Reforzamiento de Pareja'
    ],
    sessionRateUsd: 40,
    problemRates: [
      { disorder: 'Conflictos de Pareja e Interpersonales', priceUsd: 45 },
      { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 40 },
      { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 45 },
      { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 50 }
    ],
    rateApprovalStatus: 'pending',
    pendingProposedRateUsd: 48,
    pendingProblemRates: [
      { disorder: 'Conflictos de Pareja e Interpersonales', priceUsd: 50 },
      { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 45 },
      { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 48 },
      { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 55 }
    ],
    rateNote: 'Ajuste anual de baremos profesionales según baremo FPV Valencia',
    rateUpdatedAt: '2026-10-22T08:15:00Z',
    createdAt: '2024-06-20'
  },
  {
    id: 'user-sofia-mendoza',
    name: 'Lic. Sofía Mendoza',
    email: 'sofia.mendoza.psi@gmail.com',
    phone: '+58 416-5544332',
    role: 'Psicologo',
    fpvNumber: '19044',
    isVerified: true,
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80',
    city: 'Mérida / Online',
    consultationModality: 'Online',
    bio: 'Atención focalizada en dolor crónico somático y trastornos del estado de ánimo con protocolos de activación conductual.',
    clinicalExperience: '6 años de experiencia en centros hospitalarios y consulta privada.',
    disordersAddressed: [
      'Dolor Crónico y Cefaleas Tensionales',
      'Distimia y Depresión Resistente',
      'Trastornos de Adaptación'
    ],
    behavioralTechniques: [
      'Activación Conductual (BA)',
      'ACT en Dolor Crónico',
      'Entrenamiento en Biofeedback Conductual'
    ],
    sessionRateUsd: 35,
    problemRates: [
      { disorder: 'Depresión Mayor y Distimia', priceUsd: 35 },
      { disorder: 'Dolor Crónico y Somático', priceUsd: 40 },
      { disorder: 'Ansiedad Generalizada y Fobias', priceUsd: 35 }
    ],
    rateApprovalStatus: 'approved',
    createdAt: '2024-11-05'
  },
  {
    id: 'user-elena-castillo',
    name: 'Lic. Elena Castillo',
    email: 'elena.castillo.ucv@gmail.com',
    phone: '+58 416-8890123',
    role: 'Psicologo',
    fpvNumber: '19104',
    isVerified: false, // Pendiente de verificación por Andrés Rojas
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
    titleDocumentUrl: '/assets/mock_black_background_diploma.png',
    titleDocumentName: 'TITULO_FONDO_NEGRO_ELENA_CASTILLO_UCV_FPV19104.pdf',
    clinicalExperience: 'Graduada de la UCV. Formación en Activación Conductual y manejo de dolor crónico.',
    disordersAddressed: ['Depresión', 'Dolor Crónico', 'Trastornos Adaptativos'],
    behavioralTechniques: ['Activación Conductual', 'Análisis de Contingencias', 'Contrato Conductual'],
    createdAt: '2026-10-18'
  },
  {
    id: 'user-valentina-ramos',
    name: 'Valentina Ramos',
    email: 'valentina.ramos@email.com',
    phone: '+58 412-9901452',
    role: 'Paciente',
    isVerified: false,
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-08-11'
  },
  {
    id: 'user-roberto-mendez',
    name: 'Roberto Méndez',
    email: 'roberto.mendez@email.com',
    phone: '+58 414-2211993',
    role: 'Paciente',
    isVerified: false,
    isBanned: true,
    banReason: 'Publicación reiterada de pseudociencias no empíricas tras dos advertencias previas.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-09-02'
  },
  {
    id: 'user-guest',
    name: 'Visitante (No Registrado)',
    email: 'visitante@invitado.com',
    phone: '',
    role: 'Invitado',
    isVerified: false,
    isBanned: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-10-22'
  }
];

export const INITIAL_PATIENT_LEADS: PatientContactLead[] = [
  {
    id: 'lead-1',
    fullName: 'Gabriela Soto',
    age: 28,
    idCard: 'V-26.890.114',
    phone: '+58 412-8819200',
    dsmDisorderCategory: 'Trastorno de Pánico y Crisis de Angustia',
    consultationReason:
      'Presento episodios recurrentes de taquicardia y sensación de asfixia al estar en lugares concurridos o centros comerciales. He estado evitando salir de casa los fines de semana.',
    targetPsychologistId: 'user-andres-rojas',
    targetPsychologistName: 'Andrés Rojas',
    targetPsychologistFpv: '17522',
    status: 'No Leído',
    createdAt: '2026-10-21T14:30:00Z'
  },
  {
    id: 'lead-2',
    fullName: 'Manuel Da Silva',
    age: 34,
    idCard: 'V-21.450.320',
    phone: '+58 414-3329012',
    dsmDisorderCategory: 'Trastorno de Depresión Mayor (Episodio Único o Recurrente)',
    consultationReason:
      'Llevo más de 4 meses con desmotivación extrema, postergando proyectos laborales y quedándome en cama durante horas. Quisiera iniciar el protocolo de Activación Conductual.',
    targetPsychologistId: 'user-andres-rojas',
    targetPsychologistName: 'Andrés Rojas',
    targetPsychologistFpv: '17522',
    status: 'En Revisión',
    createdAt: '2026-10-20T10:15:00Z',
    notes: 'Contactar vía WhatsApp en horario de la tarde.'
  },
  {
    id: 'lead-3',
    fullName: 'Patricia Benítez',
    age: 41,
    idCard: 'V-18.773.001',
    phone: '+58 424-9098123',
    dsmDisorderCategory: 'Conflictos de Pareja y Coerción Relacional',
    consultationReason:
      'Dificultades severas en la comunicación de pareja. Caemos en discusiones repetitivas de ataque y retraimiento mutuo.',
    targetPsychologistId: 'user-carlos-parra',
    targetPsychologistName: 'Lic. Carlos Parra',
    targetPsychologistFpv: '18401',
    status: 'Contactado',
    createdAt: '2026-10-19T16:40:00Z'
  }
];

export const BEHAVIORAL_TECHNIQUES: BehavioralTechnique[] = [
  {
    id: 'analisis-funcional',
    name: 'Análisis Funcional de la Conducta (AFC)',
    acronym: 'AFC / ABC',
    category: 'Análisis Funcional',
    description: 'La herramienta epistemológica medular de la psicología conductual. Identifica las relaciones de contingencia entre los estímulos antecedentes (E), las respuestas del organismo (R) y las consecuencias (C).',
    empiricalEvidence: 'Nivel I de evidencia empírica (Cochrane, APA Div 12). Base de toda formulación clínica conductual con décadas de replicación intersujeto.',
    clinicalApplications: [
      'Identificación de funciones de reforzamiento positivo y negativo',
      'Desarticulación de repertorios de evitación experiencial',
      'Diseño individualizado de planes de modificación conductual'
    ],
    stepByStepProcedure: [
      '1. Definición topográfica precisa y operacional de la conducta problema en términos observables.',
      '2. Identificación de eventos antecedentes (estímulos discriminativos, operaciones motivadoras).',
      '3. Medición de parámetros de la respuesta: frecuencia, duración, intensidad y latencia.',
      '4. Análisis minucioso de consecuencias inmediatas y demoradas.',
      '5. Formulación de hipótesis de mantenimiento y contraste experimental.'
    ],
    keyAuthors: ['B.F. Skinner', 'C.B. Ferster', 'R.O. Nelson', 'S.C. Hayes'],
    isVisible: true
  },
  {
    id: 'activacion-conductual',
    name: 'Activación Conductual para la Depresión',
    acronym: 'BA',
    category: 'Terapias Contextuales (3ra Gen)',
    description: 'Tratamiento estructurado y breve que postula que la depresión es resultado de vidas con escaso contacto con fuentes de reforzamiento positivo contingente a la respuesta y predominio de conductas de escape/evitación.',
    empiricalEvidence: 'Metaanálisis demuestran eficacia equivalente y superior a largo plazo frente a antidepresivos (Dimidjian et al., 2006; Cuijpers et al., 2007).',
    clinicalApplications: [
      'Trastorno Depresivo Mayor',
      'Distimia y retraimiento psicomotor',
      'Inercia conductual secundaria a pérdidas o cambios ambientales severos'
    ],
    stepByStepProcedure: [
      '1. Monitorización de línea base: Registro horario de actividades y estados de ánimo.',
      '2. Análisis TRAP (Trigger -> Response -> Avoidance Pattern) y sustitución por TRAC.',
      '3. Programación y graduación de actividades estructuradas alineadas con valores.',
      '4. Descomposición de metas complejas en subtareas operativas con reforzamiento contingente.',
      '5. Prevención de recaídas mediante el mantenimiento de repertorios estables.'
    ],
    keyAuthors: ['Neil S. Jacobson', 'Christopher R. Martell', 'Sona Dimidjian'],
    isVisible: true
  },
  {
    id: 'exposicion-prevencion-respuesta',
    name: 'Exposición con Prevención de Respuesta',
    acronym: 'EPR',
    category: 'Exposición y Desensibilización',
    description: 'Procedimiento de extinción respondiente y aprendizaje inhibitorio en el cual el sujeto se expone de forma gradual a estímulos ansiógenos mientras se previene deliberadamente la conducta de escape o compulsión.',
    empiricalEvidence: 'Tratamiento de primera línea de elección científica para TOC y trastornos de fobia con tasas de remisión clínica superiores al 75% (Abramowitz, 2006).',
    clinicalApplications: [
      'Trastorno Obsesivo-Compulsivo (TOC)',
      'Fobias específicas e intensas',
      'Trastorno de Pánico y Agorafobia'
    ],
    stepByStepProcedure: [
      '1. Psicoeducación rigurosa sobre el modelo de dos factores de Mowrer.',
      '2. Construcción conjunta de la jerarquía de Unidades Subjetivas de Ansiedad (USA 0-100).',
      '3. Exposición en vivo/in sensu con bloqueo total de rituales motores y cognitivos.',
      '4. Prolongación de la exposición hasta la evidencia de violación de expectativas.',
      '5. Generalización a contextos variables para consolidar la inhibición latente.'
    ],
    keyAuthors: ['Edna Foa', 'Jonathan Abramowitz', 'Isaac Marks', 'Michelle Craske'],
    isVisible: true
  },
  {
    id: 'act-defusion-valores',
    name: 'Terapia de Aceptación y Compromiso (ACT)',
    acronym: 'ACT',
    category: 'Terapias Contextuales (3ra Gen)',
    description: 'Intervención fundamentada en la Teoría de Marcos Relacionales (RFT). Su objetivo es incrementar la flexibilidad psicológica mediante defusión cognitiva, aceptación del malestar y acción comprometida con valores.',
    empiricalEvidence: 'Más de 1.000 ensayos clínicos controlados aleatorizados (RCTs) avalados por la ACBS.',
    clinicalApplications: [
      'Dolor crónico y enfermedades somáticas',
      'Ansiedad generalizada y rumiación obsesiva',
      'Adicciones y conductas impulsivas'
    ],
    stepByStepProcedure: [
      '1. Evaluación de la Desesperanza Creativa: examinar la ineficacia del control experiencial.',
      '2. Ejercicios de Defusión Cognitiva para desliteralizar el lenguaje.',
      '3. Práctica de Aceptación Conductual frente a sensaciones aversivas inevitables.',
      '4. Clarificación profunda de valores vitales.',
      '5. Establecimiento de contratos de Acción Comprometida con metas conductuales cuantificables.'
    ],
    keyAuthors: ['Steven C. Hayes', 'Kelly G. Wilson', 'Kirk D. Strosahl'],
    isVisible: true
  },
  {
    id: 'fap-conductual',
    name: 'Psicoterapia Analítico Funcional',
    acronym: 'FAP',
    category: 'Terapias Contextuales (3ra Gen)',
    description: 'Terapia que utiliza la relación interpersonal en sesión como el contexto directo de contingencias operantes naturales. Se identifican Conductas Clínicamente Relevantes Tipo 1, 2 y 3.',
    empiricalEvidence: 'Evidencia en trastornos de personalidad, vínculos de apego evitativo y problemas interpersonales (Kanter et al., 2017).',
    clinicalApplications: [
      'Problemas crónicos de intimidad y comunicación interpersonal',
      'Trastorno de la Personalidad por Evitación o Dependencia',
      'Estilos pasivo-agresivos y aislamiento relacional'
    ],
    stepByStepProcedure: [
      '1. Regla 1: Estar atento a la ocurrencia de CCR en el aquí y el ahora.',
      '2. Regla 2: Evocar CCR en el espacio terapéutico.',
      '3. Regla 3: Reforzar naturalmente las conductas de mejoría (CCR2).',
      '4. Regla 4: Observar los efectos reforzantes o aversivos del terapeuta.',
      '5. Regla 5: Proveer descripciones funcionales para facilitar la generalización.'
    ],
    keyAuthors: ['Robert J. Kohlenberg', 'Mavis Tsai', 'Jonathan W. Kanter'],
    isVisible: true
  },
  {
    id: 'interconductismo-kantor',
    name: 'Análisis de Campo Interconductual',
    acronym: 'Interconductismo',
    category: 'Interconductismo',
    description: 'Marco metateórico y epistemológico formulado por J.R. Kantor y Emilio Ribes. Concibe el fenómeno psicológico como la interconducta organismica-ambiental en un campo integrado.',
    empiricalEvidence: 'Investigación básica y experimental en sustitución referencial y transposición conductual.',
    clinicalApplications: [
      'Comprensión holística y no reduccionista de la historia interconductual',
      'Análisis de factores disposicionales (fisiológicos, contextuales, culturales)',
      'Desmitificación de constructos mentalistas en la práctica diagnóstica'
    ],
    stepByStepProcedure: [
      '1. Mapeo de los elementos del segmento interconductual.',
      '2. Análisis de la Historia Interconductual y evolución de funciones estímulo-respuesta.',
      '3. Identificación de los Factores Disposicionales inmediatos.',
      '4. Determinación del nivel funcional de interacción.',
      '5. Reconfiguración del campo psicológico para promover interacciones efectivas.'
    ],
    keyAuthors: ['J.R. Kantor', 'Emilio Ribes Iñesta'],
    isVisible: true
  }
];

export const THERAPY_RATES: TherapyRate[] = [
  {
    id: 'sesion-individual',
    title: 'Sesión Clínica Individual',
    subtitle: 'Intervención Psicológica Basada en Evidencia',
    priceUsd: 45,
    duration: '50 - 60 minutos',
    targetAudience: 'Adultos y jóvenes que enfrentan ansiedad, depresión, rumiación o dificultades de afrontamiento.',
    badge: 'Más Solicitada',
    isFeatured: true,
    inclusions: [
      'Análisis Funcional pormenorizado de la problemática actual',
      'Aplicación de técnicas de 3ra generación (ACT, BA, FAP)',
      'Formulación de hipótesis conductuales de mantenimiento',
      'Diseño de experimentos y tareas intersesión guiadas',
      'Monitoreo semanal de avances e indicadores objetivos'
    ],
    isVisible: true
  },
  {
    id: 'evaluacion-analisis-funcional',
    title: 'Evaluación y Formulación Funcional',
    subtitle: 'Paquete Diagnóstico Conductual Riguroso',
    priceUsd: 110,
    duration: '3 sesiones completas + Informe',
    targetAudience: 'Personas que requieren un mapa claro y científico de su problemática conductual o segunda opinión clínica.',
    badge: 'Diagnóstico Científico',
    inclusions: [
      'Entrevista clínica conductual estructurada',
      'Línea base e instrumentos psicométricos validados',
      'Diagrama de Contingencias y Análisis Funcional formal (E-R-C)',
      'Informe clínico detallado con recomendaciones empíricas',
      'Sesión de devolución diagnóstica y propuesta terapéutica'
    ],
    isVisible: true
  },
  {
    id: 'terapia-pareja-contextual',
    title: 'Terapia de Pareja Contextual / FAP',
    subtitle: 'Intervención en Contingencias Relacionales',
    priceUsd: 65,
    duration: '75 minutos',
    targetAudience: 'Parejas atrapadas en ciclos coercitivos, evitación comunicacional o discrepancia de valores.',
    inclusions: [
      'Evaluación del repertorio de contingencias interpersonales',
      'Desactivación de trampas de reforzamiento coercitivo mutuo',
      'Entrenamiento en comunicación asertiva y conducta vulnerable (FAP)',
      'Clarificación conjunta de valores de relación y convivencia',
      'Estrategias de resolución de problemas conductuales en el hogar'
    ],
    isVisible: true
  },
  {
    id: 'programa-intensivo-activacion',
    title: 'Programa de Activación Conductual',
    subtitle: 'Intervención Específica para Estados Depresivos',
    priceUsd: 160,
    duration: '4 sesiones mensuales + Seguimiento diario',
    targetAudience: 'Casos de depresión moderada o severa que requieren estructuración y contacto ambiental activo.',
    badge: 'Alta Eficacia',
    inclusions: [
      'Monitoreo intensivo de actividades y registro de estados de ánimo',
      'Planificación graduada de conductas incompatibles con el aislamiento',
      'Seguimiento diario por mensajería clínica entre sesiones',
      'Desarticulación de patrones de rumiación mediante enfoque funcional',
      'Garantía de aplicación exclusiva de protocolos empíricos validados'
    ],
    isVisible: true
  }
];

export const VLOG_ARTICLES: VlogArticle[] = [
  {
    id: 'art-1',
    title: 'Por qué pensar positivo no funciona: El análisis funcional de la evitación experiencial',
    slug: 'pensar-positivo-evitacion-experiencial',
    excerpt: 'La cultura popular insiste en "eliminar los malos pensamientos". Desde la Terapia de Aceptación y Compromiso demostramos por qué la lucha deliberada contra los eventos privados genera mayor sufrimiento y rigidez.',
    content: `En la consulta psicológica con frecuencia recibimos a personas exhaustas tras meses intentando forzar un "pensamiento positivo". Desde el prisma del Conductismo Radical y la Teoría del Marco Relacional (RFT), los pensamientos no son entidades abstractas que causan la conducta desde un plano mentalista, sino respuestas verbales encubiertas sujetas a las mismas leyes de aprendizaje que cualquier movimiento motor.

Cuando una persona experimenta ansiedad y su regla verbal es "no debo sentirme así, debo pensar positivo", el acto mismo de intentar suprimir el pensamiento funciona como un estímulo discriminativo que intensifica la atención sobre la emoción indeseada. Este fenómeno es conocido como Evitación Experiencial: el intento de controlar o modificar la forma o frecuencia de eventos privados (pensamientos, emociones, sensaciones fisiológicas) a expensas de conductas valiosas.

Los experimentos de Daniel Wegner (el clásico "no pienses en un oso blanco") y la extensa literatura de Steven C. Hayes demuestran que el control voluntario sobre pensamientos automáticos es ineficaz a medio y largo plazo. La solución terapéutica conductual no radica en reemplazar pensamientos mediante debate lógico abstracto, sino en cambiar la *función* del estímulo a través de la Defusión Cognitiva: observar el pensamiento como un evento verbal en tránsito sin fundirse con su contenido literal.`,
    authorId: 'user-andres-rojas',
    authorName: 'Andrés Rojas',
    authorFpv: 'FPV 17522',
    authorRole: 'SuperAdmin',
    vlogType: 'psicologo_psicologo',
    category: 'Terapias Contextuales (ACT/DBT)',
    readTimeMinutes: 6,
    status: 'approved',
    tags: ['ACT', 'Defusión Cognitiva', 'Evitación Experiencial', 'RFT', 'Conductismo Radical'],
    references: [
      'Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2011). Acceptance and Commitment Therapy (2nd ed.). Guilford Press.',
      'Wegner, D. M. (1994). Ironic processes of mental control. Psychological Review, 101(1), 34-52.'
    ],
    publishedAt: '2026-09-14'
  },
  {
    id: 'art-2',
    title: 'Activación Conductual vs. "Falta de Motivación": Cómo actúa realmente el reforzamiento',
    slug: 'activacion-conductual-motivacion-reforzamiento',
    excerpt: 'El sentido común asume que para actuar primero hay que sentirse motivado. El análisis de la conducta invierte este axioma: la acción guiada genera el reforzamiento que luego llamamos motivación.',
    content: `El constructo cotidiano de "fuerza de voluntad" o "falta de motivación" es una explicación circular que no aporta valor explicativo al clínico. Decir que alguien no sale de la cama porque "no tiene motivación" y concluir que no tiene motivación porque "no sale de la cama" es un error epistémico elemental.

En el modelo de Activación Conductual desarrollado por Jacobson y Martell, la depresión se conceptualiza como una trampa ambiental:
1. Una pérdida o cambio reduce drásticamente las fuentes habituales de refuerzo positivo.
2. La persona emite conductas de alivio inmediato a corto plazo (quedarse en cama, postergar tareas), reforzadas negativamente por escape.
3. El aislamiento prolongado extingue cualquier oportunidad restante de contacto con consecuencias gratificantes.

La intervención consiste en programar conductas discretas de "afuera hacia adentro": realizar la acción planificada según el valor establecido, aun en presencia de desánimo.`,
    authorId: 'user-andres-rojas',
    authorName: 'Andrés Rojas',
    authorFpv: 'FPV 17522',
    authorRole: 'SuperAdmin',
    vlogType: 'psicologo_psicologo',
    category: 'Análisis de la Conducta',
    readTimeMinutes: 7,
    status: 'approved',
    tags: ['Activación Conductual', 'Depresión', 'Reforzamiento Positivo', 'Operante'],
    references: [
      'Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2010). Behavioral Activation for Depression. Guilford Press.',
      'Dimidjian, S. et al. (2006). Randomized trial of behavioral activation. JCCP, 74(4), 658-670.'
    ],
    publishedAt: '2026-08-02'
  },
  {
    id: 'art-3',
    title: 'Mi experiencia superando la procrastinación con registro de contingencias',
    slug: 'experiencia-superando-procrastinacion',
    excerpt: 'Testimonio y reflexión de un consultante sobre cómo el control de estímulos y la autovigilancia operante transformaron su rendimiento universitario.',
    content: `Como estudiante siempre creí que mi problema era tener "poca fuerza mental". Tras aprender sobre estímulos discriminativos y reforzadores demorados en consulta clínica, descubrí que mi entorno estaba diseñado para el fracaso. Al modificar los antecedentes y aplicar la regla de Premack, mi conducta cambió en dos semanas sin recurrir a discursos de autoayuda vacíos.`,
    authorId: 'user-valentina-ramos',
    authorName: 'Valentina Ramos',
    authorRole: 'Paciente',
    vlogType: 'psicologo_paciente',
    category: 'Psicología Basada en Evidencia',
    readTimeMinutes: 4,
    status: 'pending_review', // Demonstrating pre-moderation queue!
    tags: ['Paciente', 'Hábitos', 'Control de Estímulos', 'Autocuidado'],
    references: ['Skinner, B.F. (1953). Ciencia y Conducta Humana.'],
    publishedAt: '2026-10-21'
  },
  {
    id: 'art-4',
    title: 'Vivir con Ansiedad Social: Lo que aprendí al exponerme gradualmente',
    slug: 'vivir-con-ansiedad-social-exposicion',
    excerpt: 'Publicación anónima de un consultante sobre el proceso de tolerar el malestar sin recurrir a conductas de seguridad.',
    content: `Durante años usé audífonos en la calle no para escuchar música, sino para evitar que la gente me hablara. En terapia contextual aprendí que eso era una "conducta de seguridad" que mantenía mi miedo. Quitarme un audífono fue mi primer paso. Escribo esto de forma anónima para animar a otros que sienten que la ansiedad los paraliza.`,
    authorId: 'user-valentina-ramos',
    authorName: 'Anónimo',
    authorRole: 'Paciente',
    vlogType: 'psicologo_paciente',
    isAnonymous: true,
    realAuthorName: 'Valentina Ramos',
    realAuthorEmail: 'valentina.ramos@email.com',
    realAuthorId: 'user-valentina-ramos',
    category: 'Psicología Basada en Evidencia',
    readTimeMinutes: 5,
    status: 'approved',
    tags: ['Ansiedad Social', 'Exposición', 'Experiencia Anónima', 'ACT'],
    references: ['Craske, M. G. et al. (2014). Maximizing exposure therapy.'],
    publishedAt: '2026-10-22'
  }
];

export const DEBATE_SOCIEDAD_THREADS: ForumThread[] = [
  {
    id: 'debate-1',
    title: 'Skinner, "Walden Dos" y el diseño de contingencias culturales en la era de los algoritmos',
    content: 'En "Ciencia y Conducta Humana" (1953) y "Walden Dos" (1948), B.F. Skinner planteó que las culturas que no diseñan deliberadamente sus contingencias de supervivencia están condenadas a la inestabilidad. Hoy día, las grandes plataformas digitales han diseñado metacontingencias de reforzamiento intermitente que moldean la polarización y la conducta electoral. ¿Cómo podemos articular una ingeniería conductual ética y emancipatriz frente al diseño de reforzamiento comercial?',
    authorId: 'user-andres-rojas',
    authorName: 'Andrés Rojas',
    authorRole: 'SuperAdmin',
    isVerifiedAuthor: true,
    fpvNumber: '17522',
    category: 'Filosofía Conductista e Ingeniería Cultural',
    epistemologicalTag: 'Conductismo Radical',
    status: 'approved',
    views: 310,
    likes: 42,
    isPinned: true,
    isClosed: false,
    isCensored: false,
    createdAt: '2026-10-01T12:00:00Z',
    replies: [
      {
        id: 'reply-deb-1',
        authorId: 'user-carlos-parra',
        authorName: 'Lic. Carlos Parra',
        authorRole: 'Psicologo',
        isVerifiedAuthor: true,
        fpvNumber: '18401',
        content: 'El problema central reside en quién controla las contingencias de contracontrol (término skinneriano clave). Cuando el control operante está monopolizado por corporaciones sin mecanismos de contracontrol democrático o comunitario, el reforzador natural del bienestar común es sustituido por métricas de permanencia y engagement publicitario.',
        createdAt: '2026-10-01T15:20:00Z',
        likes: 21
      }
    ]
  },
  {
    id: 'debate-2',
    title: 'Análisis Interconductual de las instituciones y normas jurídicas según J.R. Kantor',
    content: 'Kantor definió la conducta cultural como aquella compartida por miembros de un grupo con base en un patrocinio institucional y reglas sancionadas históricamente. ¿En qué medida las instituciones penales fracasan al basar su sistema en el castigo positivo demorado en lugar de reestructurar los factores disposicionales comunitarios?',
    authorId: 'user-mariana-gomez',
    authorName: 'Lic. Mariana Gómez',
    authorRole: 'Moderador',
    isVerifiedAuthor: true,
    fpvNumber: '16890',
    category: 'Interconductismo y Sistemas Sociales',
    epistemologicalTag: 'Interconductismo',
    status: 'approved',
    views: 185,
    likes: 19,
    isPinned: false,
    isClosed: false,
    isCensored: false,
    createdAt: '2026-10-10T18:00:00Z',
    replies: []
  },
  {
    id: 'debate-3',
    title: 'Propuesta de debate: Metacontingencias en la educación básica venezolana',
    content: 'Presento una propuesta para analizar cómo las prácticas macroconductuales en las aulas de primaria refuerzan la sumisión y la pasividad en lugar del pensamiento crítico operativo.',
    authorId: 'user-carlos-parra',
    authorName: 'Lic. Carlos Parra',
    authorRole: 'Psicologo',
    isVerifiedAuthor: true,
    fpvNumber: '18401',
    category: 'Ingeniería Cultural',
    epistemologicalTag: 'Metacontingencias',
    status: 'pending_review', // Demonstrating pre-moderation queue!
    views: 12,
    likes: 2,
    isPinned: false,
    isClosed: false,
    isCensored: false,
    createdAt: '2026-10-22T08:00:00Z',
    replies: []
  }
];

export const INITIAL_MODERATION_LOGS: ModerationLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-21T11:20:00Z',
    moderatorName: 'Andrés Rojas',
    moderatorRole: 'SuperAdmin',
    action: 'APPROVE_POST',
    target: 'Artículo Vlog: "Por qué pensar positivo no funciona"',
    reason: 'Validado con rigor epistemológico estricto.'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-20T11:25:00Z',
    moderatorName: 'Lic. Mariana Gómez',
    moderatorRole: 'Moderador',
    action: 'BAN_USER',
    target: 'Roberto Méndez (ID user-roberto-mendez)',
    reason: 'Reincidencia deliberada en spam pseudocientífico tras apercibimiento formal.'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-19T16:40:00Z',
    moderatorName: 'Andrés Rojas',
    moderatorRole: 'SuperAdmin',
    action: 'APPROVE_PSYCHOLOGIST',
    target: 'Lic. Carlos Parra (FPV 18401)',
    reason: 'Verificación de Título a Fondo Negro UCV y credencial activa FPV comprobada exitosamente.'
  }
];

export const INITIAL_BOOKINGS: AppointmentBooking[] = [
  {
    id: 'book-1',
    patientName: 'Valentina Ramos',
    patientEmail: 'valentina.ramos@email.com',
    patientPhone: '+58 412-9901452',
    consultationReason: 'Dificultades de concentración, procrastinación severa y elevada autoexigencia ansiosa.',
    modality: 'Online (Videollamada)',
    preferredSchedule: 'Martes o Jueves por la tarde (3:00 PM a 6:00 PM)',
    serviceId: 'sesion-individual',
    status: 'Confirmada',
    createdAt: '2026-10-16T10:00:00Z'
  }
];
