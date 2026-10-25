import React, { useState } from 'react';
import { User } from '../../types';
import {
  UserPlus,
  GraduationCap,
  Heart,
  Upload,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { validateFPV, formatFPV } from '../../utils/rbac';

interface UneteViewProps {
  onRegisterPatient: (patientData: {
    name: string;
    email: string;
    phone: string;
    consultationReason: string;
  }) => void;
  onRegisterPsychologist: (psychData: {
    name: string;
    email: string;
    phone: string;
    fpvNumber: string;
    titleDocumentName: string;
    titleDocumentUrl: string;
    clinicalExperience: string;
    disordersAddressed: string[];
    behavioralTechniques: string[];
  }) => void;
}

export const UneteView: React.FC<UneteViewProps> = ({
  onRegisterPatient,
  onRegisterPsychologist
}) => {
  const [activeTab, setActiveTab] = useState<'paciente' | 'psicologo'>('paciente');

  // Patient Form State
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientReason, setPatientReason] = useState('');
  const [patientSuccess, setPatientSuccess] = useState(false);

  // Psychologist Form State
  const [psychName, setPsychName] = useState('');
  const [psychEmail, setPsychEmail] = useState('');
  const [psychPhone, setPsychPhone] = useState('');
  const [psychFpv, setPsychFpv] = useState('');
  const [psychExperience, setPsychExperience] = useState('');
  const [psychDisorders, setPsychDisorders] = useState('');
  const [psychTechniques, setPsychTechniques] = useState('');
  const [titleFileName, setTitleFileName] = useState<string>('');
  const [titleFileUrl, setTitleFileUrl] = useState<string>('');
  const [psychFpvError, setPsychFpvError] = useState<string | null>(null);
  const [psychSuccess, setPsychSuccess] = useState(false);

  // Handle Mock Title File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTitleFileName(file.name);
      // Create local object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setTitleFileUrl(previewUrl);
    }
  };

  const handleSimulateDefaultTitle = () => {
    setTitleFileName('TITULO_FONDO_NEGRO_OFICIAL_COLEGIADO.pdf');
    setTitleFileUrl('/assets/mock_black_background_diploma.png');
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !patientReason.trim()) return;

    onRegisterPatient({
      name: patientName,
      email: patientEmail,
      phone: patientPhone,
      consultationReason: patientReason
    });

    setPatientSuccess(true);
  };

  const handlePsychologistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!psychName.trim() || !psychEmail.trim() || !psychFpv.trim() || !psychExperience.trim()) return;

    // Validate FPV
    if (!validateFPV(psychFpv)) {
      setPsychFpvError('Por favor introduce un número de colegiatura FPV válido (ej. 18450 o FPV 18450).');
      return;
    }
    setPsychFpvError(null);

    // Validate Title file
    if (!titleFileName) {
      alert('Es obligatorio adjuntar la fotocopia digital en FONDO NEGRO de tu título universitario para verificación profesional.');
      return;
    }

    const disordersList = psychDisorders
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const techniquesList = psychTechniques
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onRegisterPsychologist({
      name: psychName,
      email: psychEmail,
      phone: psychPhone,
      fpvNumber: psychFpv.replace(/^fpv[\s-]*/i, ''),
      titleDocumentName: titleFileName,
      titleDocumentUrl: titleFileUrl || '/assets/mock_black_background_diploma.png',
      clinicalExperience: psychExperience,
      disordersAddressed: disordersList.length > 0 ? disordersList : ['Trastornos de Ansiedad', 'Depresión'],
      behavioralTechniques: techniquesList.length > 0 ? techniquesList : ['Análisis Funcional', 'Activación Conductual']
    });

    setPsychSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider">
          <UserPlus className="w-3.5 h-3.5" />
          Registro y Admisión
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2A2A2A]">
          Únete a la Plataforma Clínica
        </h1>
        <p className="text-sm sm:text-base text-[#2A2A2A]/75 max-w-xl mx-auto">
          Selecciona tu perfil de ingreso. Diseñado con rigurosidad tanto para consultantes como para psicólogos clínicos formados en análisis de la conducta.
        </p>
      </div>

      {/* Bifurcated Tab Selector */}
      <div className="flex p-1.5 rounded-2xl bg-[#91A7BB]/15 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('paciente')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'paciente'
              ? 'bg-white text-[#4D76B4] shadow-xs'
              : 'text-[#2A2A2A] hover:text-[#4D76B4]'
          }`}
        >
          <Heart className="w-4 h-4 text-[#4D94FF]" />
          <span>A) Como Cliente / Paciente</span>
        </button>

        <button
          onClick={() => setActiveTab('psicologo')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'psicologo'
              ? 'bg-[#4D76B4] text-white shadow-xs'
              : 'text-[#2A2A2A] hover:text-[#4D76B4]'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#FFE571]" />
          <span>B) Como Psicólogo (FPV)</span>
        </button>
      </div>

      {/* PATHWAY A: CLIENT / PATIENT REGISTRATION */}
      {activeTab === 'paciente' && (
        <div className="bg-white rounded-3xl border border-[#91A7BB]/30 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {patientSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFE571] text-[#2A2A2A] mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#4D76B4]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2A2A2A]">
                ¡Registro Completado con Éxito!
              </h3>
              <p className="text-sm text-[#2A2A2A]/80 max-w-md mx-auto leading-relaxed">
                Bienvenido/a a la plataforma, <strong>{patientName}</strong>. Tu cuenta de usuario ha sido creada. Ahora puedes participar en los foros de <strong>Comunidad</strong> y gestionar tus solicitudes de consulta clínica.
              </p>
              <button
                onClick={() => setPatientSuccess(false)}
                className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-xs"
              >
                Registrar otro usuario o editar datos
              </button>
            </div>
          ) : (
            <form onSubmit={handlePatientSubmit} className="space-y-6">
              <div className="border-b border-[#91A7BB]/20 pb-4">
                <h3 className="text-xl font-bold text-[#2A2A2A]">
                  Registro para Consultantes y Pacientes
                </h3>
                <p className="text-xs text-[#91A7BB] mt-1">
                  Accede a acompañamiento psicológico estructurado, recursos conductuales y foros comunitarios.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariana Velásquez"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mariana@ejemplo.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Número de Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+58 412 1234567"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Motivo de Consulta Inicial *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Coméntanos qué dificultades o situaciones conductuales estás experimentando actualmente (ansiedad, bajo ánimo, problemas de convivencia, procrastinación)..."
                  value={patientReason}
                  onChange={(e) => setPatientReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 text-xs text-[#2A2A2A]/80 leading-relaxed">
                Tus datos son tratados bajo estricto secreto profesional clínico y protegidos conforme a la deontología de la psicología.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-md hover:bg-[#3d629a] transition-all"
              >
                Completar Registro como Paciente
              </button>
            </form>
          )}
        </div>
      )}

      {/* PATHWAY B: PROFESSIONAL PSYCHOLOGIST REGISTRATION */}
      {activeTab === 'psicologo' && (
        <div className="bg-white rounded-3xl border-2 border-[#4D76B4]/40 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {psychSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFE571] text-[#2A2A2A] mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#4D76B4]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2A2A2A]">
                ¡Solicitud Profesional Enviada!
              </h3>
              <p className="text-sm text-[#2A2A2A]/80 max-w-lg mx-auto leading-relaxed">
                Estimado/a <strong>{psychName}</strong> (FPV {psychFpv}). Tu expediente con el documento del Título en Fondo Negro ha sido recibido y cargado en la bandeja de verificación del SuperAdmin (Lic. Andrés Rojas).
              </p>
              <div className="p-4 rounded-2xl bg-[#FFE571]/20 border border-[#FFE571] text-xs text-[#2A2A2A] max-w-md mx-auto text-left space-y-1 font-medium">
                <div>• Estado actual: <strong>Pendiente de Aprobación Manual</strong></div>
                <div>• Documento adjunto: {titleFileName}</div>
                <div>• Tras la validación, recibirás la insignia oficial de Psicólogo Colegiado y permisos editoriales en El Vlog y Debate Sociedad.</div>
              </div>
              <button
                onClick={() => setPsychSuccess(false)}
                className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handlePsychologistSubmit} className="space-y-6">
              <div className="border-b border-[#91A7BB]/20 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[11px] font-black uppercase mb-1">
                  Requisito FPV & Fondo Negro
                </div>
                <h3 className="text-xl font-bold text-[#2A2A2A]">
                  Registro y Acreditación de Psicólogo Colegiado
                </h3>
                <p className="text-xs text-[#91A7BB] mt-1">
                  Exclusivo para profesionales con título universitario y colegiatura FPV activa afines al marco conductual y contextual.
                </p>
              </div>

              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Nombre Completo y Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lic. Carlos Parra"
                    value={psychName}
                    onChange={(e) => setPsychName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Número de Colegiatura FPV (Venezuela) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 18401 o FPV 18401"
                    value={psychFpv}
                    onChange={(e) => {
                      setPsychFpv(e.target.value);
                      setPsychFpvError(null);
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden ${
                      psychFpvError ? 'border-red-500 bg-red-50' : 'border-[#91A7BB]/40 focus:border-[#4D76B4]'
                    }`}
                  />
                  {psychFpvError && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">
                      {psychFpvError}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Correo Electrónico Institucional/Profesional *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="psicologo@correo.com"
                    value={psychEmail}
                    onChange={(e) => setPsychEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                    Teléfono / WhatsApp de Contacto Profesional *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+58 414 7654321"
                    value={psychPhone}
                    onChange={(e) => setPsychPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              {/* MANDATORY BLACK BACKGROUND DIPLOMA UPLOADER */}
              <div className="p-5 rounded-2xl bg-gray-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFE571]">
                    <Upload className="w-4 h-4" />
                    <span>Requisito Obligatorio: Fotocopia Digital a Fondo Negro del Título *</span>
                  </div>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-md font-bold">
                    Inspección Manual
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Para garantizar la máxima idoneidad deontológica, debes adjuntar la copia en digital a fondo negro del título universitario donde se observe de forma nítida la mención de <strong>Licenciado/a en Psicología</strong> y los sellos de registro legal.
                </p>

                <div className="border-2 border-dashed border-gray-700 hover:border-[#6BD4FF] rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-[#6BD4FF] mx-auto" />
                    <div className="text-xs font-semibold text-white">
                      {titleFileName ? (
                        <span className="text-[#FFE571] font-bold">
                          ✓ Documento Seleccionado: {titleFileName}
                        </span>
                      ) : (
                        <span>Arrastra aquí tu archivo o haz clic para seleccionarlo (PDF o Imagen)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Formatos soportados: PDF, JPG, PNG (Hasta 15 MB)
                    </div>
                  </div>
                </div>

                {!titleFileName && (
                  <button
                    type="button"
                    onClick={handleSimulateDefaultTitle}
                    className="text-[11px] text-[#6BD4FF] hover:underline block pt-1"
                  >
                    (Demo: Cargar título de muestra a fondo negro predeterminado)
                  </button>
                )}
              </div>

              {/* Clinical Experience */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Resumen de Experiencia Laboral en Consulta Clínica *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla años de experiencia, instituciones de procedencia, formación de postgrado y práctica en consultorio..."
                  value={psychExperience}
                  onChange={(e) => setPsychExperience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* Disorders Addressed */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Problemas y Trastornos que Aborda en Consulta * (separados por coma)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Trastornos de Ansiedad, Depresión Mayor, TOC, Regulación Emocional"
                  value={psychDisorders}
                  onChange={(e) => setPsychDisorders(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* Behavioral Techniques Applied */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Técnicas Conductistas / Contextuales Basadas en Evidencia que Suele Aplicar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Análisis Funcional (ABC), Activación Conductual, ACT (Defusión y Valores), EPR, FAP"
                  value={psychTechniques}
                  onChange={(e) => setPsychTechniques(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
                <span className="text-[11px] text-[#91A7BB] mt-1 block">
                  Nota: Solo se admiten procedimientos sustentados en Análisis de la Conducta y evidencia científica contrastada.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#4D76B4] text-white font-black text-sm shadow-md hover:bg-[#3d629a] transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-[#FFE571]" />
                  <span>Enviar Solicitud Profesional a Revisión SuperAdmin</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
