import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Shield, CheckCircle, Mail, Phone, MapPin, ExternalLink, Heart, Sparkles, LifeBuoy } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  brandConfig?: import('../types').SiteBrandConfig;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, brandConfig }) => {
  const footerConfig = brandConfig?.footerConfig || {
    manifestoText:
      'Servicio de Psicología Clínica fundamentado de manera estricta y exclusiva en el Análisis de la Conducta, el Conductismo Radical, el Interconductismo y las Terapias Contextuales de Tercera Generación (ACT, DBT, FAP, Activación Conductual).',
    rigorCommitmentText:
      'Rechazamos categóricamente modelos no avalados científicamente, pseudociencias y explicaciones mentalistas sin respaldo experimental. Toda intervención se basa en datos, líneas base y formulaciones funcionales reproducibles.',
    contactEmail: 'RojasBandres@gmail.com',
    contactPhone: '+58 (412) 555-0199',
    locationText: 'Caracas, Venezuela / Consulta Online Global',
    customNotice: 'Atención psicológica profesional y divulgación científica rigurosa.'
  };

  return (
    <footer className="bg-white border-t border-[#91A7BB]/30 pt-16 pb-12 overflow-hidden relative">
      {/* Decorative background subtle circular blobs matching identity manual */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#91A7BB]/10 blur-3xl pointer-events-none -ml-28 -mb-28" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#6BD4FF]/10 blur-3xl pointer-events-none -mr-32 -mt-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#91A7BB]/20">
          {/* Column 1: Brand & Epistemological Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="horizontal" size="md" brandConfig={brandConfig} showSubtitle={false} />
            <p className="text-sm text-[#2A2A2A]/80 leading-relaxed pr-4">
              {footerConfig.manifestoText}
            </p>

            <div className="p-4 rounded-2xl bg-[#4D76B4]/5 border border-[#4D76B4]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4D76B4] uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#4D76B4]" />
                Compromiso de Rigor Empírico
              </div>
              <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
                {footerConfig.rigorCommitmentText}
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              Secciones
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tarifas')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  Tarifas y Modalidades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tecnicas')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  Catálogo de Técnicas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('psicologos_aliados')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  Psicólogos aliados
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vlog')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  El Vlog Científico
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('debate-sociedad')}
                  className="text-[#2A2A2A]/80 hover:text-[#4D76B4] transition-colors"
                >
                  Debate Sociedad
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Evidencia y Marcos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              Marcos Científicos
            </h4>
            <ul className="space-y-2 text-xs text-[#2A2A2A]/75">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Análisis Experimental de la Conducta (AEC)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Interconductismo de J.R. Kantor
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Teoría de Marcos Relacionales (RFT)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Activación Conductual (BA)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Exposición con Prevención de Respuesta
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4D94FF] flex-shrink-0" />
                Psicoterapia Analítico Funcional (FAP)
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto y Enlaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4]">
              Contacto & Coordinación
            </h4>
            <div className="space-y-2.5 text-xs text-[#2A2A2A]/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#91A7BB] flex-shrink-0" />
                <span>{footerConfig.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#91A7BB] flex-shrink-0" />
                <span>{footerConfig.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#91A7BB] flex-shrink-0" />
                <span>{footerConfig.locationText}</span>
              </div>

              {footerConfig.customNotice && (
                <div className="p-2.5 rounded-xl bg-[#FFE571]/20 border border-[#FFE571] text-[11px] text-[#2A2A2A] font-medium mt-2">
                  {footerConfig.customNotice}
                </div>
              )}

              {/* Protocolo de Urgencias */}
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[10px] text-red-700 leading-tight flex items-start gap-1.5 mt-2">
                <LifeBuoy className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de Urgencias:</strong> Plataforma para atención psicológica ambulatoria programada. En emergencias psiquiátricas inmediatas o crisis vital, acuda al centro hospitalario más cercano o llame a las líneas de emergencia locales.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#91A7BB]">
          <div>
            © {new Date().getFullYear()} Psicogénesis - Lic. Andrés Rojas. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[#2A2A2A]/70">
              <span className="w-2 h-2 rounded-full bg-[#FFE571]" /> Paz
              <span className="w-2 h-2 rounded-full bg-[#6BD4FF] ml-1" /> Esperanza
              <span className="w-2 h-2 rounded-full bg-[#4D94FF] ml-1" /> Amor
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-[#4D76B4] font-semibold">100% Conductismo y Evidencia Empírica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
