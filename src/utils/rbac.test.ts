import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canModerate,
  canVerifyPsychologists,
  canAssignRoles,
  canAccessAdminPanel,
  canAccessSuperAdminPrivileges,
  canApprovePosts,
  canSubmitVlog,
  canAccessDebateSociedad,
  validateFPV,
  formatFPV,
  validateConsultationReason,
  validateEpistemologicalRigor
} from './rbac';
import { User } from '../types';

test('RBAC: canModerate only grants SuperAdmin and Moderador', () => {
  assert.equal(canModerate('SuperAdmin'), true);
  assert.equal(canModerate('Moderador'), true);
  assert.equal(canModerate('Psicologo'), false);
  assert.equal(canModerate('Paciente'), false);
});

test('RBAC: SuperAdmin privileges (assign roles, approve psychologists, manage CMS)', () => {
  assert.equal(canVerifyPsychologists('SuperAdmin'), true);
  assert.equal(canVerifyPsychologists('Moderador'), false);
  assert.equal(canAssignRoles('SuperAdmin'), true);
  assert.equal(canAccessSuperAdminPrivileges('SuperAdmin'), true);
  assert.equal(canAccessSuperAdminPrivileges('Moderador'), false);
  assert.equal(canApprovePosts('SuperAdmin'), true);
  assert.equal(canApprovePosts('Moderador'), false);
});

test('RBAC: canAccessDebateSociedad allows ONLY verified psychologists, moderators and SuperAdmin', () => {
  const patientUser: User = {
    id: 'p1',
    name: 'Paciente Test',
    email: 'p@test.com',
    phone: '123',
    role: 'Paciente',
    isVerified: false,
    createdAt: '2026-01-01'
  };
  // Patients cannot access Debate Sociedad
  assert.equal(canAccessDebateSociedad(patientUser), false);

  const unverifiedPsych: User = {
    id: 'psy1',
    name: 'Psicólogo no verificado',
    email: 'psy@test.com',
    phone: '123',
    role: 'Psicologo',
    isVerified: false,
    createdAt: '2026-01-01'
  };
  // Unverified psychologists cannot access until approved
  assert.equal(canAccessDebateSociedad(unverifiedPsych), false);

  const verifiedPsych: User = {
    ...unverifiedPsych,
    isVerified: true,
    fpvNumber: '18401'
  };
  // Verified psychologists CAN access
  assert.equal(canAccessDebateSociedad(verifiedPsych), true);

  const superAdmin: User = {
    id: 'sa1',
    name: 'Andrés Rojas',
    email: 'andres@test.com',
    phone: '123',
    role: 'SuperAdmin',
    isVerified: true,
    createdAt: '2026-01-01'
  };
  assert.equal(canAccessDebateSociedad(superAdmin), true);
});

test('RBAC: canSubmitVlog allows all non-banned users, including patients', () => {
  const patientUser: User = {
    id: 'p1',
    name: 'Paciente Test',
    email: 'p@test.com',
    phone: '123',
    role: 'Paciente',
    isBanned: false,
    createdAt: '2026-01-01'
  };
  assert.equal(canSubmitVlog(patientUser), true);

  const bannedUser: User = {
    ...patientUser,
    isBanned: true
  };
  assert.equal(canSubmitVlog(bannedUser), false);
});

test('Consultation Reason: 500 characters constraint', () => {
  const shortText = 'Siento mucha ansiedad al hablar en público.';
  const res1 = validateConsultationReason(shortText);
  assert.equal(res1.isValid, true);
  assert.ok(res1.remainingChars > 0);

  const longText = 'A'.repeat(501);
  const res2 = validateConsultationReason(longText);
  assert.equal(res2.isValid, false);
  assert.ok(res2.error?.includes('500 caracteres'));

  const emptyText = '   ';
  const res3 = validateConsultationReason(emptyText);
  assert.equal(res3.isValid, false);
});

test('FPV Validation & Epistemological Rigor', () => {
  assert.equal(validateFPV('17522'), true);
  assert.equal(validateFPV('abc'), false);
  assert.equal(formatFPV('17522'), 'FPV 17522');

  const clean = validateEpistemologicalRigor('Análisis Funcional y ACT');
  assert.equal(clean.isCompliant, true);

  const bad = validateEpistemologicalRigor('Sesión de psicoanálisis e hipnosis regresiva');
  assert.equal(bad.isCompliant, false);
});

import {
  calculateMean,
  calculateMedian,
  calculateMode,
  validateRateWithinLimit,
  canInteract,
  canProposeRates,
  computeRateStatistics
} from './rbac';

test('Tarifas Statistics: Mean, Median, and Mode calculation', () => {
  // Odd length array
  const sample1 = [35, 40, 40, 45, 50];
  assert.equal(calculateMean(sample1), 42);
  assert.equal(calculateMedian(sample1), 40);
  assert.equal(calculateMode(sample1), 40);

  // Even length array
  const sample2 = [30, 40, 40, 50];
  assert.equal(calculateMean(sample2), 40);
  assert.equal(calculateMedian(sample2), 40);
  assert.equal(calculateMode(sample2), 40);

  // Array with high mode
  const sample3 = [45, 45, 45, 50, 60];
  assert.equal(calculateMode(sample3), 45);
});

test('Session Rate Cap: enforces $100 ceiling and rejects exceeding values', () => {
  const cap = 100;
  assert.equal(validateRateWithinLimit(45, cap).isValid, true);
  assert.equal(validateRateWithinLimit(100, cap).isValid, true);
  assert.equal(validateRateWithinLimit(101, cap).isValid, false);
  assert.ok(validateRateWithinLimit(120, cap).error?.includes('100'));
  assert.equal(validateRateWithinLimit(0, cap).isValid, false);
  assert.equal(validateRateWithinLimit(-10, cap).isValid, false);
});

test('Guest & Unregistered Interaction Gate: canInteract', () => {
  const guestUser: User = {
    id: 'user-guest',
    name: 'Visitante',
    email: 'guest@test.com',
    phone: '',
    role: 'Invitado',
    createdAt: '2026-01-01'
  };
  // Guests cannot interact (they can only view)
  assert.equal(canInteract(guestUser), false);
  assert.equal(canInteract(null), false);

  const patientUser: User = {
    id: 'user-pat',
    name: 'Paciente Real',
    email: 'pat@test.com',
    phone: '123',
    role: 'Paciente',
    createdAt: '2026-01-01'
  };
  // Registered patient CAN interact
  assert.equal(canInteract(patientUser), true);

  const bannedPatient: User = {
    ...patientUser,
    isBanned: true
  };
  // Banned patient CANNOT interact
  assert.equal(canInteract(bannedPatient), false);
});

test('computeRateStatistics generates valid averages and breakdowns', () => {
  const mockPsychologists: User[] = [
    {
      id: 'p1',
      name: 'Andrés Rojas',
      email: 'a@test.com',
      phone: '1',
      role: 'SuperAdmin',
      fpvNumber: '17522',
      isVerified: true,
      sessionRateUsd: 45,
      problemRates: [
        { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 50 },
        { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 45 }
      ],
      rateApprovalStatus: 'approved',
      createdAt: '2026-01-01'
    },
    {
      id: 'p2',
      name: 'Carlos Parra',
      email: 'c@test.com',
      phone: '2',
      role: 'Psicologo',
      fpvNumber: '18401',
      isVerified: true,
      sessionRateUsd: 40,
      problemRates: [
        { disorder: 'Trastorno del Espectro Autista (TEA)', priceUsd: 48 },
        { disorder: 'Trastorno Obsesivo-Compulsivo (TOC)', priceUsd: 40 }
      ],
      rateApprovalStatus: 'approved',
      createdAt: '2026-01-01'
    }
  ];

  const stats = computeRateStatistics(mockPsychologists);
  assert.ok(stats.length > 0);
  const general = stats.find((s) => s.disorderId === 'general');
  assert.ok(general);
  assert.equal(general?.mean, 42.5);
  assert.equal(general?.min, 40);
  assert.equal(general?.max, 45);
});
