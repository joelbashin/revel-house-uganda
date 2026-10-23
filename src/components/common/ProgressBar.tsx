import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  className?: string;
  color?: 'green' | 'orange' | 'teal';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  className = '',
  color = 'green',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const barColor = {
    green: 'bg-[#69B53F]',
    orange: 'bg-[#F5A623]',
    teal: 'bg-[#36A8A0]',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-medium text-[var(--c-ink)]/70 mb-1.5">
          <span>Project Completion</span>
          <span className="font-semibold text-[var(--c-ink)]">{clamped}%</span>
        </div>
      )}
      <div
        className="w-full h-2.5 bg-[var(--c-soft)] rounded-full overflow-hidden p-0.5 border border-[var(--c-ink)]/5"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
