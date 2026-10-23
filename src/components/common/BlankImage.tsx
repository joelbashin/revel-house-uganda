import React from 'react';

interface BlankImageProps {
  className?: string;
  aspectRatio?: string;
  rounded?: string;
  tone?: 'cream' | 'canvas' | 'sage' | 'clay' | 'stone';
  label?: string;
  children?: React.ReactNode;
  id?: string;
  src?: string;
  alt?: string;
}

export const BlankImage: React.FC<BlankImageProps> = ({
  className = '',
  aspectRatio = 'aspect-[4/3]',
  rounded = 'rounded-[24px]',
  tone = 'cream',
  label,
  children,
  id,
  src,
  alt,
}) => {
  // Editorial soft neutral tones for blank frames
  const toneClasses = {
    cream: 'bg-[var(--c-soft)]/80 border-[var(--c-ink)]/8',
    canvas: 'bg-[#F2F3EF]/90 border-[var(--c-ink)]/6',
    sage: 'bg-[#EBF2E8]/80 border-[#69B53F]/15',
    clay: 'bg-[#F9EDE8]/75 border-[#E85B3F]/15',
    stone: 'bg-[#EAECE9]/80 border-[#36A8A0]/15',
  }[tone];

  return (
    <div
      id={id}
      className={`relative overflow-hidden border transition-all duration-500 select-none ${aspectRatio} ${rounded} ${toneClasses} ${className}`}
      role="img"
      aria-label={src ? alt || label || 'Field photograph' : label || 'Visual frame (intentionally blank per design specification)'}
    >
      {src ? (
        <>
          {/* Real field photograph fills the frame */}
          <img
            src={src}
            alt={alt || label || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle scrim keeps overlay captions readable */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.08] to-black/[0.08] pointer-events-none"
            aria-hidden="true"
          />

          {children && (
            <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
              {children}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Subtle architectural tactile texture - no images, pure minimalist geometry */}
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(17,17,17,0.06) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
            aria-hidden="true"
          />

          {/* Subtle corner registration marks reminiscent of fine editorial prints */}
          <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[var(--c-ink)]/15 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[var(--c-ink)]/15 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[var(--c-ink)]/15 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[var(--c-ink)]/15 pointer-events-none" aria-hidden="true" />

          {/* Subtle living inner breathing aura */}
          <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-black/[0.03] animate-aura-breathe pointer-events-none" aria-hidden="true" />

          {children && (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
};