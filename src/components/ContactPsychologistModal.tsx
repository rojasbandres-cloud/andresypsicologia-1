import React, { useState } from 'react';
import { User, PatientContactLead } from '../types';
import { validateConsultationReason } from '../utils/rbac';
import { DSM5_TR_CATEGORIES } from '../data/dsm5tr';
import { X, Send, CheckCircle2, ShieldCheck, UserCheck, Phone, AlertCircle, BookOpen } from 'lucide-react';

interface ContactPsychologistModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPsychologist: User | null;
  onSendLead: (leadData: Omit<PatientContactLead, 'id' | 'status' | 'createdAt'>) => void;
}

export const ContactPsychologistModal: React.FC<ContactPsychologistModalProps> = ({
  isOpen,
  onClose,
  targetPsychologist,
  onSendLead
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [idCard, setIdCard] = useState('');
  const [phone, setPhone] = useState('');
  const [dsmDisorderCategory, setDsmDisorderCategory] = useState<string>('Trastorno de Ansiedad Generalizada (TAG)');
  const [customDisorderReason, setCustomDisorderReason] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !targetPsychologist) return null;

  const reasonValidation = validateConsultationReason(consultationReason);
  const currentChars = consultationReason.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !age || !idCard.trim() || !phone.trim() || !consultationReason.trim()) {
      setValidationError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (currentChars > 500) {
      setValidationError('El motivo de consulta no puede superar los 500 caracteres.');
      return;
    }

    onSendLead({
      fullName: fullName.trim(),
      age: Number(age),
      idCard: idCard.trim(),
      phone: phone.trim(),
      dsmDisorderCategory,
      customDisorderReason: dsmDisorderCategory.includes('Otro motivo') ? customDisorderReason.trim() : undefined,
      consultationReason: consultationReason.trim(),
      targetPsychologistId: targetPsychologist.id,
      targetPsychologistName: targetPsychologist.name,
      targetPsychologistFpv: targetPsychologist.fpvNumber
    });

    setSubmitted(true);
    setValidationError(null);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFullName('');
    setAge('');
    setIdCard('');
    setPhone('');
    setDsmDisorderCategory('Trastorno de Ansiedad Generalizada (TAG)');
    setCustomDisorderReason('');
    setConsultationReason('');
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100 transition-colors"
          aria-label="Cerrar modal de contacto"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFE571] text-[#2A2A2A] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8 text-[#4D76B4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2A2A2A]">
              ¡Mensaje Enviado con Éxito!
            </h3>
            <p className="text-sm text-[#2A2A2A]/80 max-w-md mx-auto leading-relaxed">
              Gracias, <strong>{fullName}</strong>. Tu solicitud de atención para el profesional <strong>{targetPsychologist.name}</strong> ha sido enviada confidencialmente a la bandeja de administración del <strong>Lic. Andrés Rojas (admi)</strong>.
            </p>
            <div className="p-4 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 text-xs text-[#4D76B4] font-medium text-left max-w-md mx-auto space-y-1">
              <div>• Paciente: {fullName} (C.I. {idCard}, {age} años)</div>
              <div>• Teléfono: {phone}</div>
              <div>• Clasificación DSM-5-TR: {dsmDisorderCategory}</div>
              {customDisorderReason && <div>• Detalle adicional: {customDisorderReason}</div>}
              <div>• Profesional seleccionado: {targetPsychologist.name} {targetPsychologist.fpvNumber ? `(FPV ${targetPsychologist.fpvNumber})` : ''}</div>
              <div>• Revisión directa por el admi para coordinación clínica.</div>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-md hover:bg-[#3d629a] transition-all"
            >
              Cerrar y Regresar a Psicólogos aliados
            </button>
          </div>
        ) : (
          <div>
            {/* Header with target psychologist badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#91A7BB]/20">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#4D76B4] flex-shrink-0 border-2 border-[#FFE571]">
                {targetPsychologist.avatarUrl ? (
                  <img
                    src={targetPsychologist.avatarUrl}
                    alt={targetPsychologist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                    {targetPsychologist.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D76B4]">
                  Solicitud de Atención Clínica
                </span>
                <h3 className="text-lg font-bold text-[#2A2A2A]">
                  Contactar a {targetPsychologist.name}
                </h3>
                {targetPsychologist.fpvNumber && (
                  <span className="text-xs text-[#91A7BB] font-semibold">
                    Colegiatura FPV {targetPsychologist.fpvNumber}
                  </span>
                )}
              </div>
            </div>

            {validationError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Nombre Completo del Paciente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Gabriela Sofía Morales Soto"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* Age and Cédula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Edad (Años) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    placeholder="Ej. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Cédula de Identidad (C.I.) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. V-24.123.456"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Número de Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+58 412 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* DSM-5-TR Disorder Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#4D76B4]" />
                  <span>Identificación del Problema (DSM-5-TR) *</span>
                </label>
                <select
                  value={dsmDisorderCategory}
                  onChange={(e) => setDsmDisorderCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs font-medium focus:outline-hidden focus:border-[#4D76B4] bg-white text-[#2A2A2A]"
                >
                  {DSM5_TR_CATEGORIES.map((cat) => (
                    <optgroup key={cat.id} label={`── ${cat.categoryName} ──`}>
                      {cat.disorders.map((disorder) => (
                        <option key={disorder} value={disorder}>
                          {disorder}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <optgroup label="── Otra Clasificación ──">
                    <option value="Otro motivo / Situación vital no especificada">
                      Otro motivo / Situación vital no especificada
                    </option>
                  </optgroup>
                </select>
                <p className="text-[11px] text-[#91A7BB] mt-1">
                  Permite orientar la evaluación inicial y seleccionar las contingencias o técnicas pertinentes.
                </p>
              </div>

              {/* If "Otro motivo" selected, show custom text input */}
              {dsmDisorderCategory.includes('Otro motivo') && (
                <div className="p-3 rounded-2xl bg-[#FFE571]/20 border border-[#FFE571] space-y-1 animate-in fade-in">
                  <label className="block text-xs font-bold text-[#2A2A2A]">
                    Especifica brevemente tu problema o motivo: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Problemas de adaptación laboral, duelo complejo, etc."
                    value={customDisorderReason}
                    onChange={(e) => setCustomDisorderReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#91A7BB]/40 text-xs bg-white text-[#2A2A2A] focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              )}

              {/* Motivo de consulta (Max 500 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
                    Descripción de la Consulta *
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      currentChars > 500
                        ? 'text-red-600 font-bold'
                        : currentChars > 450
                        ? 'text-amber-600'
                        : 'text-[#91A7BB]'
                    }`}
                  >
                    {currentChars} / 500 caracteres
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={520}
                  placeholder="Describe de forma concisa la situación o conducta que deseas abordar (máximo 500 caracteres)..."
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden ${
                    currentChars > 500
                      ? 'border-red-500 bg-red-50/50'
                      : 'border-[#91A7BB]/40 focus:border-[#4D76B4]'
                  }`}
                />
                {currentChars > 500 && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    Has superado el límite permitido de 500 caracteres.
                  </p>
                )}
              </div>

              {/* Confidentiality Notice */}
              <div className="p-3.5 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 text-[11px] text-[#2A2A2A]/85 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D76B4] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Confidencialidad Garantizada:</strong> Este mensaje será recibido de forma exclusiva por el <strong>admi (Lic. Andrés Rojas)</strong> en la sección interna para verificar la asignación idónea del caso según especialidad.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={currentChars > 500}
                  className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-sm hover:bg-[#3d629a] transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FFE571]" />
                  <span>Enviar al admi</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
