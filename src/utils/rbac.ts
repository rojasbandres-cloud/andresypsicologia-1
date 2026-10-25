import { User, UserRole, PostStatus } from '../types';

/**
 * Checks if a user has moderation authority (SuperAdmin or Moderador)
 */
export function canModerate(role: UserRole): boolean {
  return role === 'SuperAdmin' || role === 'Moderador';
}

/**
 * Only SuperAdmin (Andrés Rojas) can verify and approve psychologist applications
 */
export function canVerifyPsychologists(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

/**
 * Only SuperAdmin can reassign roles or revoke moderator status
 */
export function canAssignRoles(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

/**
 * Checks if a user can access the /admin dashboard
 */
export function canAccessAdminPanel(role: UserRole): boolean {
  return role === 'SuperAdmin' || role === 'Moderador';
}

/**
 * Only SuperAdmin can add/remove CMS content and inspect private patient contact messages
 */
export function canAccessSuperAdminPrivileges(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

/**
 * SuperAdmin monitors and approves every post in Vlog & Debate y Sociedad before publication
 */
export function canApprovePosts(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

/**
 * VLOG posting:
 * Division 1: 'psicologo_psicologo' - Solo los psicólogos pueden postear y publicar allí.
 * Division 2: 'psicologo_paciente' - Tanto psicólogos como pacientes pueden publicar.
 * All submissions by non-SuperAdmin are monitored/held in review by admi.
 */
export function canSubmitVlogDivision(
  user: User | null | undefined,
  division: 'psicologo_psicologo' | 'psicologo_paciente'
): { allowed: boolean; reason?: string } {
  if (!user || user.role === 'Invitado' || user.id === 'user-guest') {
    return { allowed: false, reason: 'Debes iniciar sesión para publicar en El Vlog.' };
  }
  if (user.isBanned) {
    return { allowed: false, reason: 'Tu cuenta ha sido restringida por moderación.' };
  }
  if (division === 'psicologo_psicologo') {
    const isPsychologist =
      user.role === 'SuperAdmin' ||
      user.role === 'Moderador' ||
      (user.role === 'Psicologo' && (user.isVerified ?? true));
    if (!isPsychologist) {
      return {
        allowed: false,
        reason: 'El Vlog Psicólogo-Psicólogo está reservado exclusivamente para psicólogos clínicos colegiados.'
      };
    }
  }
  return { allowed: true };
}

export function canSubmitVlog(user: User): boolean {
  if (!user || user.role === 'Invitado' || user.id === 'user-guest') return false;
  return !user.isBanned;
}

/**
 * DEBATE Y SOCIEDAD:
 * "debate y sociedad solo los psicólogos-psicólogo pueden postear, pero a su vez, los pacientes o cualquiera puede leer los debates"
 */
export function canReadDebateSociedad(): boolean {
  return true; // Cualquier persona (pacientes, invitados, psicólogos) puede leer
}

export function canPostInDebateSociedad(user: User | null | undefined): { allowed: boolean; reason?: string } {
  if (!user || user.role === 'Invitado' || user.id === 'user-guest') {
    return { allowed: false, reason: 'Debes iniciar sesión con una cuenta de psicólogo para participar en Debate y Sociedad.' };
  }
  if (user.isBanned) {
    return { allowed: false, reason: 'Tu cuenta se encuentra suspendida.' };
  }
  const isPsychologist =
    user.role === 'SuperAdmin' ||
    user.role === 'Moderador' ||
    (user.role === 'Psicologo' && (user.isVerified ?? true));
  if (!isPsychologist) {
    return {
      allowed: false,
      reason: 'En Debate y Sociedad solo pueden publicar y crear temas los psicólogos colegiados miembros. Los pacientes pueden leer todos los debates.'
    };
  }
  return { allowed: true };
}

export function canAccessDebateSociedad(user: User): boolean {
  // Retained for backward-compat: reading is open to everyone
  return !user.isBanned;
}

/**
 * Checks if current user can edit availability and schedule of a psychologist profile
 */
export function canEditPsychologistProfile(currentUser: User | null | undefined, psychologistId: string): boolean {
  if (!currentUser || currentUser.isBanned) return false;
  if (currentUser.role === 'SuperAdmin') return true;
  return currentUser.id === psychologistId && (currentUser.role === 'Psicologo' || currentUser.role === 'Moderador');
}

/**
 * Validates FPV (Federación de Psicólogos de Venezuela) registration format
 */
export function validateFPV(input: string): boolean {
  if (!input) return false;
  const cleaned = input.trim().replace(/^fpv[\s-:]*/i, '');
  const num = parseInt(cleaned, 10);
  return !isNaN(num) && num > 1000 && num < 999999;
}

/**
 * Formats FPV to canonical string representation "FPV XXXXX"
 */
export function formatFPV(input: string): string {
  if (!input) return '';
  const cleaned = input.trim().replace(/^fpv[\s-:]*/i, '');
  return `FPV ${cleaned}`;
}

/**
 * Validates consultation reason length (Max 500 characters)
 */
export function validateConsultationReason(text: string): { isValid: boolean; remainingChars: number; error?: string } {
  const max = 500;
  const len = text.trim().length;
  if (len === 0) {
    return { isValid: false, remainingChars: max, error: 'El motivo de consulta no puede estar vacío.' };
  }
  if (len > max) {
    return { isValid: false, remainingChars: max - len, error: `El motivo supera el límite de ${max} caracteres permitidos (${len}/${max}).` };
  }
  return { isValid: true, remainingChars: max - len };
}

/**
 * Strict Epistemological Rule Validator:
 * Ensures platform content respects the exclusive focus on Behavior Analysis,
 * Radical Behaviorism, Interbehaviorism, and Third Wave therapies,
 * while flagging non-evidence based or banned conceptual schools.
 */
export function validateEpistemologicalRigor(text: string): {
  isCompliant: boolean;
  prohibitedTermsFound: string[];
  warningMessage?: string;
} {
  const prohibitedPatterns = [
    { pattern: /\b(psicoan[aá]lisis|psicoanal[ií]tico|freud|inconsciente\s+colectivo|complejo\s+de\s+edipo|lacan)\b/i, label: 'Psicoanálisis' },
    { pattern: /\b(constelaciones\s+familiares|biodescodificaci[oó]n|reiki|energ[ií]as\s+cu[aá]nticas|neuroling[uü][ií]stica|pnl)\b/i, label: 'Pseudociencia sin evidencia' },
    { pattern: /\b(gestalt|humanismo\s+hol[ií]stico|terapia\s+regresiva)\b/i, label: 'Modelos no avalados en la línea conductista' }
  ];

  const found: string[] = [];
  for (const item of prohibitedPatterns) {
    if (item.pattern.test(text)) {
      found.push(item.label);
    }
  }

  if (found.length > 0) {
    return {
      isCompliant: false,
      prohibitedTermsFound: found,
      warningMessage: `El contenido infringe la directriz epistemológica estricta: Se detectaron conceptos ajenos a la Psicología Basada en Evidencia y Análisis de la Conducta (${found.join(', ')}).`
    };
  }

  return {
    isCompliant: true,
    prohibitedTermsFound: []
  };
}

/**
 * Checks if a user is registered and authorized to INTERACT (e.g., submit contact form,
 * create articles, comment, schedule consultations, submit rates).
 * Guests / unregistered users can only READ / VIEW.
 */
export function canInteract(user?: User | null): boolean {
  if (!user) return false;
  if (user.role === 'Invitado' || user.id === 'user-guest') return false;
  if (user.isBanned) return false;
  return true;
}

/**
 * Checks if a user can propose and submit rates for clinical sessions
 */
export function canProposeRates(user?: User | null): boolean {
  if (!user || user.isBanned) return false;
  if (user.role === 'Psicologo' && user.isVerified) return true;
  if (user.role === 'Moderador' && user.isVerified) return true;
  return false;
}

/**
 * Validates that a session rate does not exceed the clinical ceiling (defaults to $100)
 */
export function validateRateWithinLimit(
  priceUsd: number,
  maxLimitUsd: number = 100
): { isValid: boolean; error?: string } {
  if (isNaN(priceUsd) || priceUsd <= 0) {
    return { isValid: false, error: 'La tarifa debe ser un monto positivo mayor a $0 USD.' };
  }
  if (priceUsd > maxLimitUsd) {
    return {
      isValid: false,
      error: `La tarifa propuesta ($${priceUsd} USD) supera el límite máximo permitido por sesión ($${maxLimitUsd} USD) fijado por la Dirección Clínica.`
    };
  }
  return { isValid: true };
}

/**
 * Arithmetic Mean (Promedio) calculation
 */
export function calculateMean(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Median (Mediana) calculation
 */
export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * Mode (Moda) calculation (Most frequent value)
 */
export function calculateMode(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  let modeVal = values[0];

  for (const val of values) {
    const count = (freqMap.get(val) || 0) + 1;
    freqMap.set(val, count);
    if (count > maxFreq) {
      maxFreq = count;
      modeVal = val;
    }
  }

  return modeVal;
}

export const CLINICAL_DISORDERS_LIST = [
  {
    id: 'autismo',
    name: 'Trastorno del Espectro Autista (TEA)',
    clinicalFocus: 'Análisis Conductual Aplicado (ABA), moldeamiento de repertorios verbales, desensibilización sensorial y entrenamiento a padres.'
  },
  {
    id: 'toc',
    name: 'Trastorno Obsesivo-Compulsivo (TOC)',
    clinicalFocus: 'Exposición con Prevención de Respuesta (EPR), defusión cognitiva contextual e interrupción de bucles operantes de escape.'
  },
  {
    id: 'ansiedad',
    name: 'Ansiedad Generalizada y Fobias',
    clinicalFocus: 'Desensibilización sistemática in vivo/virtual, reestructuración funcional de contingencias y aceptación experiencial (ACT).'
  },
  {
    id: 'depresion',
    name: 'Depresión Mayor y Distimia',
    clinicalFocus: 'Activación Conductual (BA), restablecimiento de fuentes naturales de reforzamiento positivo contingente y reducción de rumiación.'
  },
  {
    id: 'dolor_cronico',
    name: 'Dolor Crónico y Somático',
    clinicalFocus: 'ACT aplicada al sufrimiento físico crónico, regulación autónoma con biofeedback conductual y ampliación de flexibilidad psicológica.'
  },
  {
    id: 'pareja',
    name: 'Conflictos de Pareja e Interpersonales',
    clinicalFocus: 'Psicoterapia Analítico Funcional (FAP), contratos de reforzamiento contingente mutuo y análisis interconductual del intercambio verbal.'
  }
];

import { RateStatistic } from '../types';

/**
 * Computes statistical summaries (Mean, Median, Mode) across community psychologist rates
 */
export function computeRateStatistics(psychologists: User[]): RateStatistic[] {
  // Filter psychologists who have approved rates
  const verified = psychologists.filter(
    (p) =>
      (p.role === 'SuperAdmin' || (p.role === 'Psicologo' && p.isVerified) || (p.role === 'Moderador' && p.fpvNumber)) &&
      (p.rateApprovalStatus === 'approved' || p.role === 'SuperAdmin')
  );

  const stats: RateStatistic[] = [];

  // 1. General Session Rate Statistic
  const generalRates: number[] = verified
    .map((p) => p.sessionRateUsd)
    .filter((r): r is number => typeof r === 'number' && r > 0);

  if (generalRates.length > 0) {
    stats.push({
      disorderId: 'general',
      disorderName: 'Tarifa General por Sesión Clínica',
      clinicalFocus: 'Atención individual estándar (50-60 min) con evaluación funcional inicial, prescripción intersesión y registro de conducta.',
      mean: calculateMean(generalRates),
      median: calculateMedian(generalRates),
      mode: calculateMode(generalRates),
      count: generalRates.length,
      min: Math.min(...generalRates),
      max: Math.max(...generalRates),
      sampleRates: generalRates
    });
  }

  // 2. Statistics per Clinical Disorder
  for (const disorder of CLINICAL_DISORDERS_LIST) {
    const matchedRates: number[] = [];

    for (const p of verified) {
      if (p.problemRates && p.problemRates.length > 0) {
        const found = p.problemRates.find(
          (pr) =>
            pr.disorder.toLowerCase().includes(disorder.name.toLowerCase()) ||
            disorder.name.toLowerCase().includes(pr.disorder.toLowerCase()) ||
            (disorder.id === 'autismo' && pr.disorder.toLowerCase().includes('autista')) ||
            (disorder.id === 'toc' && pr.disorder.toLowerCase().includes('obsesivo')) ||
            (disorder.id === 'ansiedad' && pr.disorder.toLowerCase().includes('ansiedad')) ||
            (disorder.id === 'depresion' && pr.disorder.toLowerCase().includes('depresi')) ||
            (disorder.id === 'dolor_cronico' && pr.disorder.toLowerCase().includes('dolor')) ||
            (disorder.id === 'pareja' && pr.disorder.toLowerCase().includes('pareja'))
        );
        if (found && found.priceUsd > 0) {
          matchedRates.push(found.priceUsd);
          continue;
        }
      }
      // Fallback to base session rate if psychologist addresses this disorder in their profile
      if (
        p.sessionRateUsd &&
        p.disordersAddressed?.some((d) =>
          d.toLowerCase().includes(disorder.id) ||
          d.toLowerCase().includes(disorder.name.toLowerCase().split(' ')[0])
        )
      ) {
        matchedRates.push(p.sessionRateUsd);
      }
    }

    if (matchedRates.length > 0) {
      stats.push({
        disorderId: disorder.id,
        disorderName: disorder.name,
        clinicalFocus: disorder.clinicalFocus,
        mean: calculateMean(matchedRates),
        median: calculateMedian(matchedRates),
        mode: calculateMode(matchedRates),
        count: matchedRates.length,
        min: Math.min(...matchedRates),
        max: Math.max(...matchedRates),
        sampleRates: matchedRates
      });
    }
  }

  return stats;
}
