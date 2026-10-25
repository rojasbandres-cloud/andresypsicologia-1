import React from 'react';
import { SiteBrandConfig } from '../types';

interface BrandLogoProps {
  variant?: 'full' | 'isotype' | 'horizontal' | 'compact' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  brandConfig?: SiteBrandConfig;
  showSubtitle?: boolean;
  showFpvBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  brandConfig,
  showSubtitle = true,
  showFpvBadge = false
}) => {
  const siteTitle = brandConfig?.siteTitle || 'Psicogénesis';
  const headerSubtitle = brandConfig?.headerSubtitle || 'Por Andrés Rojas - F.P.V. 17.522';
  const logoType = brandConfig?.logoType || 'official_svg';
  const customLogoUrl = brandConfig?.customLogoUrl;

  // Dimension definitions
  const dimensions = {
    sm: { icon: 34, textTitle: 'text-base', textSub: 'text-[9px]', textFpv: 'text-[9px]' },
    md: { icon: 44, textTitle: 'text-xl', textSub: 'text-[11px]', textFpv: 'text-[10px]' },
    lg: { icon: 60, textTitle: 'text-2xl', textSub: 'text-xs', textFpv: 'text-xs' },
    xl: { icon: 88, textTitle: 'text-3xl', textSub: 'text-sm', textFpv: 'text-sm' }
  }[size];

  const iconPx = dimensions.icon;

  // Render official vector isotype or custom logo image
  const renderIcon = () => {
    if (logoType === 'custom_url' && customLogoUrl) {
      return (
        <img
          src={customLogoUrl}
          alt={siteTitle}
          style={{ width: iconPx, height: iconPx }}
          className="object-contain rounded-full flex-shrink-0 shadow-xs border border-[#4D76B4]/30"
        />
      );
    }

    return (
      <svg
        width={iconPx}
        height={iconPx}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="Isotipo Oficial Psicogénesis"
      >
        {/* 1. EL CÍRCULO - Open therapeutic cycle arc (Jörmungander allegory) */}
        <path
          d="M 52 14 C 28 14 12 32 14 56 C 16 78 35 92 58 90 C 76 88 88 74 88 58"
          stroke="#4D76B4"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 2 & 3. SÍMBOLO PSY + FLOR DE LIS */}
        {/* Pedestal / base */}
        <path
          d="M 38 80 L 62 80 M 50 80 L 50 40"
          stroke="#91A7BB"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Central Lily Spearhead */}
        <path
          d="M 50 30 C 47 38 48 55 50 68 C 52 55 53 38 50 30 Z"
          fill="#91A7BB"
        />
        {/* Left curved wing / Psi prong */}
        <path
          d="M 50 62 C 40 60 30 52 28 42 C 26 34 32 30 35 34 C 38 38 43 50 50 56"
          fill="#91A7BB"
          opacity="0.95"
        />
        {/* Right curved wing / Psi prong */}
        <path
          d="M 50 62 C 60 60 70 52 72 42 C 74 34 68 30 65 34 C 62 38 57 50 50 56"
          fill="#91A7BB"
          opacity="0.95"
        />

        {/* 4. LA TRINIDAD - Three dots (Paz, Esperanza, Amor) */}
        {/* Dot 1: Yellow (Top) #FFE571 */}
        <circle cx="51" cy="9" r="6" fill="#FFE571" />
        {/* Dot 2: Light Blue (Middle) #6BD4FF */}
        <circle cx="69" cy="18" r="5" fill="#6BD4FF" />
        {/* Dot 3: Azure / Deep Blue (Right) #4D94FF */}
        <circle cx="83" cy="33" r="5.5" fill="#4D94FF" />
      </svg>
    );
  };

  if (variant === 'isotype') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  if (variant === 'full' || variant === 'compact') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderIcon()}
        <div className="mt-2">
          <span className={`block font-black tracking-wider text-[#4D76B4] uppercase ${dimensions.textTitle}`}>
            {siteTitle}
          </span>
          <span className="block font-bold tracking-wide text-[#4D76B4] text-[11px] mt-0.5">
            {headerSubtitle}
          </span>
        </div>
      </div>
    );
  }

  // Default: Horizontal brand logo (clean title "PSICOGÉNESIS" with subtitle "Por Andrés Rojas - F.P.V. 17.522")
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {renderIcon()}
      <div className="flex flex-col justify-center">
        <span className={`font-black tracking-wider text-[#4D76B4] uppercase ${dimensions.textTitle} leading-tight`}>
          {siteTitle}
        </span>
        {showSubtitle !== false && headerSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-bold text-[#4D76B4] tracking-wide mt-0.5">
            {headerSubtitle}
          </span>
        )}
      </div>
    </div>
  );
};
