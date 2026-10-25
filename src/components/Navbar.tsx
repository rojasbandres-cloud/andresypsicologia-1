import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { User, UserRole } from '../types';
import { canAccessAdminPanel } from '../utils/rbac';
import {
  ShieldCheck,
  Calendar,
  Menu,
  X,
  UserCheck,
  UserPlus,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  LogOut,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  pendingVerificationsCount: number;
  brandConfig?: import('../types').SiteBrandConfig;
  onOpenAuthModal?: (actionContext: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenBookingModal,
  pendingVerificationsCount,
  brandConfig,
  onOpenAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const hasAdminAccess = canAccessAdminPanel(currentUser.role);
  const isGuest = currentUser.role === 'Invitado';

  const defaultNavLinks = [
    { id: 'inicio', label: 'Inicio', isVisible: true },
    { id: 'tarifas', label: 'Tarifas', isVisible: true },
    { id: 'tecnicas', label: 'Técnicas', isVisible: true },
    { id: 'psicologos_aliados', label: 'Psicólogos aliados', isVisible: true },
    { id: 'vlog', label: 'El Vlog', isVisible: true },
    { id: 'debate-sociedad', label: 'Debate Sociedad', isVisible: true },
    { id: 'unete', label: 'Únete', isVisible: true }
  ];

  const navLinks = (brandConfig?.navMenuItems && brandConfig.navMenuItems.length > 0
    ? brandConfig.navMenuItems
    : defaultNavLinks
  ).filter((item) => item.isVisible);

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const formatRoleText = (role: UserRole) => {
    if (role === 'SuperAdmin') return 'admi';
    return role;
  };

  const roleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-[#4D76B4] text-white';
      case 'Moderador':
        return 'bg-[#6BD4FF]/30 text-[#006090] font-bold';
      case 'Psicologo':
        return 'bg-[#FFE571] text-[#2A2A2A] font-bold';
      case 'Invitado':
        return 'bg-gray-200 text-gray-700 font-bold';
      default:
        return 'bg-[#91A7BB]/20 text-[#2A2A2A]';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#91A7BB]/20 shadow-xs">
      {/* Top Bar for Demonstration & Role Switcher (Crucial for RBAC Testing) */}
      <div className="bg-[#4D76B4]/10 border-b border-[#4D76B4]/20 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#2A2A2A] font-medium">
            <span className={`flex h-2 w-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-[#4D94FF] animate-pulse'}`} />
            {isGuest ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4D76B4]">Modo Visitante (Solo Lectura)</span>
                <span className="text-[11px] text-[#91A7BB] hidden md:inline">
                  • Puedes consultar información libremente; se requiere cuenta para interactuar
                </span>
                {onOpenAuthModal && (
                  <button
                    onClick={() => onOpenAuthModal('iniciar sesión')}
                    className="ml-2 px-2.5 py-0.5 rounded-lg bg-[#4D76B4] text-white font-bold text-[11px] hover:bg-[#3d629a] transition-all shadow-2xs"
                  >
                    Iniciar Sesión / Registrarse
                  </button>
                )}
              </div>
            ) : (
              <>
                <span className="hidden sm:inline">Sesión activa / RBAC:</span>
                <span className="font-bold text-[#4D76B4]">{currentUser.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${roleBadgeStyle(currentUser.role)}`}>
                  {formatRoleText(currentUser.role)}
                </span>
                {currentUser.fpvNumber && (
                  <span className="text-[11px] font-semibold text-[#4D76B4] bg-white px-2 py-0.5 rounded-md border border-[#4D76B4]/30">
                    FPV {currentUser.fpvNumber}
                  </span>
                )}
                {currentUser.isBanned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3 h-3" /> Baneado
                  </span>
                )}
              </>
            )}
          </div>

          {/* Quick User Switcher Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#91A7BB]/40 text-[#2A2A2A] hover:border-[#4D76B4] transition-colors shadow-2xs font-semibold"
              aria-label="Cambiar usuario de prueba para verificar roles y permisos"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4D76B4]" />
              <span>Simular Usuario</span>
              <ChevronDown className="w-3 h-3 text-[#91A7BB]" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-[#91A7BB]/30 p-2 z-50"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-[#91A7BB] border-b border-[#91A7BB]/20">
                  Seleccionar rol para verificar permisos
                </div>
                <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSwitchUser(u.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        currentUser.id === u.id
                          ? 'bg-[#4D76B4]/10 text-[#4D76B4] font-bold'
                          : 'hover:bg-gray-100 text-[#2A2A2A]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-[#91A7BB]">
                          {u.email} {u.fpvNumber ? `• FPV ${u.fpvNumber}` : ''}
                        </div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${roleBadgeStyle(u.role)}`}>
                        {formatRoleText(u.role)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('inicio')}
            className="focus:outline-hidden text-left"
            aria-label="Ir a Inicio - Psicogénesis Andrés Rojas"
          >
            <BrandLogo variant="horizontal" size="md" brandConfig={brandConfig} showSubtitle={true} />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const isActive =
                currentSection === link.id ||
                (link.id === 'psicologos_aliados' && (currentSection === 'comunidad' || currentSection === 'psicologos_aliados'));
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-[#4D76B4] bg-[#4D76B4]/10 font-bold'
                      : 'text-[#2A2A2A] hover:text-[#4D76B4] hover:bg-[#91A7BB]/10'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#4D76B4] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Admin Panel button if role permits */}
            {hasAdminAccess && (
              <button
                onClick={() => handleLinkClick('admin')}
                className={`relative ml-2 px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                  currentSection === 'admin'
                    ? 'bg-[#4D76B4] text-white shadow-sm'
                    : 'bg-[#91A7BB]/15 text-[#4D76B4] hover:bg-[#4D76B4]/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#FFE571]" />
                <span>Panel Admin</span>
                {currentUser.role === 'SuperAdmin' && pendingVerificationsCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-black animate-bounce">
                    {pendingVerificationsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFE571] text-[#2A2A2A] text-sm font-bold shadow-sm hover:bg-[#ffe04d] hover:shadow-md transition-all active:scale-98"
            >
              <Calendar className="w-4 h-4 text-[#2A2A2A]" />
              <span>Agendar Cita</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenBookingModal()}
              className="p-2 rounded-xl bg-[#FFE571] text-[#2A2A2A] text-xs font-bold"
              aria-label="Agendar cita rápida"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2A2A2A] hover:bg-gray-100 focus:outline-hidden"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#91A7BB]/20 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#91A7BB]/15">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                  currentSection === link.id ||
                  (link.id === 'psicologos_aliados' && (currentSection === 'comunidad' || currentSection === 'psicologos_aliados'))
                    ? 'bg-[#4D76B4] text-white font-bold'
                    : 'text-[#2A2A2A] hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {hasAdminAccess && (
            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#4D76B4]/10 text-[#4D76B4] font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4D76B4]" />
                <span>Panel de Control Administrativo</span>
              </div>
              {pendingVerificationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-xs font-bold">
                  {pendingVerificationsCount} pendientes
                </span>
              )}
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full py-3 rounded-2xl bg-[#FFE571] text-[#2A2A2A] font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Consulta Clínica</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
