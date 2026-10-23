import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  compact?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  compact = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`glass-btn${compact ? ' glass-btn--sm' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="glass-btn-label">{children}</span>
    </button>
  );
};
