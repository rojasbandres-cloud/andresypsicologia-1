import React, { useState } from 'react';
import {
  ShieldAlert,
  User,
  GraduationCap,
  Sparkles,
  X,
  Lock,
  ArrowRight,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (userId: string) => void;
  actionContext?: string;
  onRegisterPatient?: (patientData: { name: string; email: string; phone: string; consultationReason: string }) => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onLoginAs,
  actionContext = 'realizar esta acción',
  onRegisterPatient
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'register'>('quick');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRegisterPatient && name.trim() && email.trim()) {
      onRegisterPatient({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        consultationReason: 'Registro directo desde portal de interacción'
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#91A7BB] hover:text-[#2A2A2A] p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4D76B4]/10 text-[#4D76B4] flex items-center justify-center shadow-xs">
            <Lock className="w-7 h-7 text-[#4D76B4]" />
          </div>
          <h3 className="text-2xl font-black text-[#2A2A2A]">
            Identificación Requerida
          </h3>
          <p className="text-xs sm:text-sm text-[#2A2A2A]/75 leading-relaxed">
            Para <strong>{actionContext}</strong> es necesario contar con una sesión activa. Los visitantes no registrados pueden consultar libremente las tarifas estadísticas, técnicas y artículos, pero la interacción está reservada a usuarios autenticados.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#91A7BB]/20 pb-2 gap-4 justify-center text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'quick'
                ? 'border-[#4D76B4] text-[#4D76B4]'
                : 'border-transparent text-[#91A7BB] hover:text-[#2A2A2A]'
            }`}
          >
            Acceso Rápido (Simulación)
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-[#4D76B4] text-[#4D76B4]'
                : 'border-transparent text-[#91A7BB] hover:text-[#2A2A2A]'
            }`}
          >
            Registro de Paciente
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-3">
            <p className="text-[11px] text-[#91A7BB] font-semibold text-center uppercase tracking-wider">
              Selecciona un perfil verificado para ingresar inmediatamente:
            </p>

            <button
              onClick={() => {
                onLoginAs('user-valentina-ramos');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl border border-[#91A7BB]/30 hover:border-[#4D76B4] hover:bg-[#4D76B4]/5 transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6BD4FF]/20 text-[#006090] flex items-center justify-center font-black text-sm">
                  VR
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2A2A2A] group-hover:text-[#4D76B4]">
                    Valentina Ramos
                  </div>
                  <div className="text-xs text-[#91A7BB]">Rol: Paciente Consultante</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4D76B4] flex items-center gap-1">
                Ingresar <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                onLoginAs('user-carlos-parra');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl border border-[#91A7BB]/30 hover:border-[#4D76B4] hover:bg-[#4D76B4]/5 transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFE571]/30 text-[#2A2A2A] flex items-center justify-center font-black text-sm">
                  CP
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2A2A2A] group-hover:text-[#4D76B4]">
                    Lic. Carlos Parra
                  </div>
                  <div className="text-xs text-[#91A7BB]">Psicólogo Colegiado • FPV 18401</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4D76B4] flex items-center gap-1">
                Ingresar <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                onLoginAs('user-andres-rojas');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl border-2 border-[#4D76B4] bg-[#4D76B4]/5 text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4D76B4] text-white flex items-center justify-center font-black text-sm">
                  AR
                </div>
                <div>
                  <div className="text-sm font-black text-[#2A2A2A]">
                    Lic. Andrés Rojas (SuperAdmin)
                  </div>
                  <div className="text-xs text-[#4D76B4] font-semibold">Fundador • FPV 17522</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4D76B4] flex items-center gap-1">
                Ingresar <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2A2A2A] mb-1">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Carmen Rodríguez"
                className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A2A2A] mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carmen@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A2A2A] mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+58 412 1234567"
                className="w-full px-4 py-2.5 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-md hover:bg-[#3d629a] transition-all"
            >
              Completar Registro de Paciente
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-[#91A7BB]/20 text-center">
          <p className="text-[11px] text-[#91A7BB]">
            Garantía de confidencialidad y rigor ético deontológico bajo normativa FPV.
          </p>
        </div>
      </div>
    </div>
  );
};
