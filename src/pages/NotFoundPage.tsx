import React from 'react';
import { Compass, Home, Heart, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div id="not-found-page" className="min-h-[75vh] flex items-center justify-center px-5 py-24">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[var(--c-soft)] text-[var(--c-ink)]/70 flex items-center justify-center mx-auto border border-[var(--c-ink)]/8">
          <Compass className="w-8 h-8 text-[#69B53F]" />
        </div>

        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--c-ink)]/40 block">
          ERROR 404
        </span>

        <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--c-ink)] tracking-tight">
          Looks like this page took a different path.
        </h1>

        <p className="text-sm text-[var(--c-ink)]/70 leading-relaxed max-w-sm mx-auto">
          The link you followed may be expired or typed incorrectly. Explore our active community programs or return to the main overview.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>

          <button
            onClick={() => onNavigate('/projects')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-[var(--c-ink)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--c-soft)] transition-colors"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('/donate')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Support Us</span>
          </button>
        </div>
      </div>
    </div>
  );
};