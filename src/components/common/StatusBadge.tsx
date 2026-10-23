import React from 'react';
import { ProjectStatus } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus | 'ACTIVE' | 'SCALING' | 'PILOT';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    ONGOING: {
      bg: 'bg-[#69B53F]/10 border-[#69B53F]/30',
      text: 'text-[#3E7C20]',
      dot: 'bg-[#69B53F]',
    },
    'SEEKING FUNDING': {
      bg: 'bg-[#F5A623]/12 border-[#F5A623]/30',
      text: 'text-[#A86908]',
      dot: 'bg-[#F5A623]',
    },
    PLANNED: {
      bg: 'bg-[#36A8A0]/12 border-[#36A8A0]/30',
      text: 'text-[#1D6C66]',
      dot: 'bg-[#36A8A0]',
    },
    COMPLETED: {
      bg: 'bg-[#111111]/8 border-[var(--c-ink)]/15',
      text: 'text-[var(--c-ink)]/80',
      dot: 'bg-[#111111]/50',
    },
    ACTIVE: {
      bg: 'bg-[#69B53F]/10 border-[#69B53F]/30',
      text: 'text-[#3E7C20]',
      dot: 'bg-[#69B53F]',
    },
    SCALING: {
      bg: 'bg-[#36A8A0]/12 border-[#36A8A0]/30',
      text: 'text-[#1D6C66]',
      dot: 'bg-[#36A8A0]',
    },
    PILOT: {
      bg: 'bg-[#E85B3F]/10 border-[#E85B3F]/30',
      text: 'text-[#B03720]',
      dot: 'bg-[#E85B3F]',
    },
  };

  const current = styles[status] || styles.ONGOING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
};
