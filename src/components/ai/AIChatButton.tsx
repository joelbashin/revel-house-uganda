import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';

interface AIChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AIChatButton: React.FC<AIChatButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <GlassButton
        compact
        onClick={onToggle}
        aria-label={isOpen ? 'Close Ask Revel AI assistant' : 'Open Ask Revel AI assistant'}
        aria-expanded={isOpen}
        className={isOpen ? 'glass-btn--open' : ''}
      >
        {isOpen ? (
          <span className="inline-flex items-center gap-2">
            <X className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Close</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold tracking-wide uppercase">Ask Revel AI</span>
          </span>
        )}
      </GlassButton>
    </div>
  );
};
