import React, { useState } from 'react';
import { TherapyRate, AppointmentBooking } from '../types';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, Video, MapPin } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: TherapyRate[];
  selectedServiceId?: string;
  onSaveBooking: (booking: Omit<AppointmentBooking, 'id' | 'status' | 'createdAt'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rates,
  selectedServiceId,
  onSaveBooking
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [modality, setModality] = useState<'Online (Videollamada)' | 'Presencial (Caracas / Consultorio)'>('Online (Videollamada)');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [serviceId, setServiceId] = useState(selectedServiceId || (rates[0]?.id || 'sesion-individual'));
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !consultationReason.trim()) {
      return;
    }

    onSaveBooking({
      patientName,
      patientEmail,
      patientPhone,
      consultationReason,
      modality,
      preferredSchedule: preferredSchedule || 'Horario a convenir',
      serviceId
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setConsultationReason('');
    setPreferredSchedule('');
    onClose();
  };

  const selectedRate = rates.find((r) => r.id === serviceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100 transition-colors"
          aria-label="Cerrar ventana de agendamiento"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFE571] text-[#2A2A2A] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8 text-[#4D76B4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2A2A2A]">
              ¡Solicitud de Consulta Recibida!
            </h3>
            <p className="text-sm text-[#2A2A2A]/80 max-w-md mx-auto leading-relaxed">
              Gracias, <strong>{patientName}</strong>. El Lic. Andrés Rojas (FPV 17522) o su equipo de coordinación se comunicará contigo vía WhatsApp o correo electrónico para confirmar la fecha exacta y enviarte el cuestionario de línea base conductual.
            </p>
            <div className="p-4 rounded-2xl bg-[#4D76B4]/10 text-xs text-[#4D76B4] font-semibold text-left max-w-md mx-auto space-y-1">
              <div>• Modalidad elegida: {modality}</div>
              <div>• Servicio: {selectedRate?.title} (${selectedRate?.priceUsd} USD)</div>
              <div>• Horario de preferencia: {preferredSchedule || 'Por convenir'}</div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-md hover:bg-[#3d629a] transition-all"
            >
              Entendido, volver al sitio
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#4D76B4]/10 text-[#4D76B4]">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#2A2A2A]">
                  Agendar Sesión Clínica
                </h3>
                <p className="text-xs text-[#91A7BB]">
                  Consulta con el Lic. Andrés Rojas • FPV 17522
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Modalidad o Servicio Requerido *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4] bg-white font-medium"
                >
                  {rates.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} — ${r.priceUsd} USD ({r.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modality Radio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1.5">
                  Formato de la Sesión *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      modality === 'Online (Videollamada)'
                        ? 'border-[#4D76B4] bg-[#4D76B4]/10 text-[#4D76B4]'
                        : 'border-[#91A7BB]/30 text-[#2A2A2A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modality"
                      value="Online (Videollamada)"
                      checked={modality === 'Online (Videollamada)'}
                      onChange={() => setModality('Online (Videollamada)')}
                      className="sr-only"
                    />
                    <Video className="w-4 h-4 flex-shrink-0" />
                    <span>Online (Google Meet / Zoom)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      modality === 'Presencial (Caracas / Consultorio)'
                        ? 'border-[#4D76B4] bg-[#4D76B4]/10 text-[#4D76B4]'
                        : 'border-[#91A7BB]/30 text-[#2A2A2A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modality"
                      value="Presencial (Caracas / Consultorio)"
                      checked={modality === 'Presencial (Caracas / Consultorio)'}
                      onChange={() => setModality('Presencial (Caracas / Consultorio)')}
                      className="sr-only"
                    />
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>Presencial (Caracas)</span>
                  </label>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#2A2A2A] mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Hernández"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2A2A2A] mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#2A2A2A] mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+58 412 1234567"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2A2A2A] mb-1">
                    Disponibilidad Horaria
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tardes a partir de las 4pm"
                    value={preferredSchedule}
                    onChange={(e) => setPreferredSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              {/* Consultation reason */}
              <div>
                <label className="block text-xs font-medium text-[#2A2A2A] mb-1">
                  Motivo de Consulta Inicial (breve descripción conductual) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe brevemente la situación o conductas que te gustaría trabajar (ansiedad, bloqueo ante tareas, bajo estado de ánimo, dificultades relacionales)..."
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FFE571]/20 border border-[#FFE571] text-xs text-[#2A2A2A] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D76B4] flex-shrink-0 mt-0.5" />
                <span>
                  Privacidad y Secreto Profesional garantizados bajo el código de ética de la Federación de Psicólogos de Venezuela (FPV).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#2A2A2A] hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-sm hover:bg-[#3d629a] hover:shadow-md transition-all active:scale-98"
                >
                  Confirmar y Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
