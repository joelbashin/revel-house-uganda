import React from 'react';
import { Menu, User } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  userName: string;
}

export function AdminHeader({ onMenuToggle, userName }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--c-bg)]/80 backdrop-blur-xl border-b border-[var(--c-line)]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-[var(--c-ink)]/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-[var(--c-ink)]" />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-ink)]/5">
            <div className="w-7 h-7 rounded-full bg-[#69B53F] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-[var(--c-ink-soft)] hidden sm:block">
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
