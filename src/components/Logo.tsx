import React from 'react';
import { useBrandContent } from '../context/BrandContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const { branding } = useBrandContent();
  const logo = branding?.logo;

  const activeSrc = logo?.activeUrl || '/assets/images/mohab_logo.png';
  const altText = logo?.altText || 'MOHAB MOHAMMED Official Brand Logo';

  const sizeClasses = {
    sm: 'max-h-7 sm:max-h-8',
    md: 'max-h-9 sm:max-h-11 md:max-h-12',
    lg: 'max-h-12 sm:max-h-14',
    xl: 'max-h-16 sm:max-h-20',
  };

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      <a
        href="/"
        id="brand-logo-link"
        className="inline-flex items-center focus:outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        aria-label={altText}
      >
        <img
          src={activeSrc}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/assets/images/mohab_logo.png') {
              target.src = '/assets/images/mohab_logo.png';
            }
          }}
          className={`w-auto h-auto ${sizeClasses[size] || sizeClasses.md} object-contain filter drop-shadow-sm transition-opacity duration-300 group-hover:opacity-90`}
        />
      </a>
    </div>
  );
};
