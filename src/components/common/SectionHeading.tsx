import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
  dark = false,
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 md:mb-14 ${isCenter ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-3.5 ${isCenter ? 'justify-center' : ''}`}>
          <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
          <span className={`text-[11px] font-semibold tracking-widest uppercase ${dark ? 'text-[#69B53F]' : 'text-[#69B53F]'}`}>
            {eyebrow}
          </span>
        </div>
      )}
      
      <h2
        className={`font-editorial text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] ${
          dark ? 'text-white' : 'text-[var(--c-ink)]'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? 'text-[#EDEBE2]/80' : 'text-[var(--c-ink)]/75'
          } ${isCenter ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
