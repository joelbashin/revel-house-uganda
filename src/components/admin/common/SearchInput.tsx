import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-ink-soft)]/30" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-surface)] text-sm text-[var(--c-ink)] placeholder:text-[var(--c-ink-soft)]/30 focus:outline-none focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] transition-all"
      />
    </div>
  );
}
