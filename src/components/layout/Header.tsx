import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  dark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, dark, onToggleDark }) => {
  const { getImage } = useMedia();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Programs', path: '/programs' },
    { label: 'Projects', path: '/projects' },
    { label: 'WASH Project', path: '/wash' },
    { label: 'Impact', path: '/impact' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'News', path: '/news' },
    { label: 'Get Involved', path: '/get-involved' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--c-bg)]/95 backdrop-blur-md shadow-xs border-b border-[var(--c-line)] py-3.5'
          : 'bg-[var(--c-bg)] py-5 border-b border-[var(--c-line)]'
      }`}
    >
      {/* Scroll progress bar across the top */}
      <div
        className="absolute top-0 left-0 h-[2.5px] bg-[#69B53F] transition-all duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <button
          id="nav-logo-btn"
          onClick={() => handleLinkClick('/')}
          className="group flex items-center gap-3 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#69B53F] rounded-lg p-1 -ml-1 transition-transform"
        >
          {/* Logo Mark: Revel House Uganda logo */}
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs ring-1 ring-[#111111]/10 group-hover:ring-[#69B53F]/50 transition-all duration-300">
            <img
              src={getImage('header.logo', '/images/logo.jpeg')}
              alt="Revel House Uganda logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-editorial text-lg sm:text-xl tracking-tight text-[var(--c-ink)] block leading-none">
              Revel House
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#69B53F] block mt-0.5">
              Uganda
            </span>
          </div>
        </button>

        {/* DESKTOP NAVIGATION */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleLinkClick(item.path)}
                className={`relative px-3 py-2 rounded-full text-[12.5px] font-medium transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#69B53F] ${
                  isActive
                    ? 'text-[var(--c-ink)] font-semibold'
                    : 'text-[var(--c-ink)]/70 hover:text-[var(--c-ink)] hover:bg-black/4 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#69B53F] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* PRIMARY CTA & ACTIONS */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            id="nav-safeguarding-badge"
            onClick={() => handleLinkClick('/safeguarding')}
            title="Safe, verified organization safeguarding policies"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[var(--c-ink)]/60 hover:text-[var(--c-ink)] hover:bg-black/5 dark:text-[#F2F3F1]/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors border border-transparent hover:border-[var(--c-ink)]/10 dark:hover:border-white/10"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#69B53F]" />
            <span>Safeguarding</span>
          </button>

          <button
            id="nav-theme-toggle"
            onClick={onToggleDark}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--c-ink)] dark:text-[#F2F3F1] border border-[var(--c-ink)]/12 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="nav-donate-pill-btn"
            onClick={() => handleLinkClick('/donate')}
            className="btn-african-primary group relative inline-flex items-center gap-2 px-5 py-2.5 shadow-xs transition-all duration-300 transform active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Donate / Support</span>
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="nav-mobile-theme-toggle"
            onClick={onToggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-[var(--c-ink)] dark:text-[#F2F3F1] border border-[var(--c-ink)]/12 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="nav-mobile-donate-btn"
            onClick={() => handleLinkClick('/donate')}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-[11px] font-medium shadow-xs hover:bg-[#69B53F] transition-colors"
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Support</span>
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl text-[var(--c-ink)] hover:bg-black/5 dark:hover:bg-white/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#69B53F]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE ACCESSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 top-[65px] bg-[var(--c-bg)] z-40 lg:hidden overflow-y-auto px-6 py-8 flex flex-col justify-between border-t border-[var(--c-line)] animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-widest text-[#69B53F] font-semibold px-3 mb-3">
              Menu Navigation
            </p>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#111111] text-white font-semibold'
                      : 'text-[var(--c-ink)] hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--c-ink)]/40'}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[var(--c-line)] mt-6 space-y-3">
            <button
              onClick={() => handleLinkClick('/donate')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#69B53F] text-white text-sm font-semibold shadow-xs hover:bg-[#5aa134] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate / Support Revel House</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLinkClick('/safeguarding')}
                className="py-2.5 px-3 rounded-xl border border-[var(--c-line)] text-center text-xs text-[var(--c-ink)]/80 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Safeguarding Policy
              </button>
              <button
                onClick={() => handleLinkClick('/partner')}
                className="py-2.5 px-3 rounded-xl border border-[var(--c-line)] text-center text-xs text-[var(--c-ink)]/80 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
