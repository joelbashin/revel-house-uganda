import React, { useRef, useEffect } from 'react';
import { Heart, Mail, MessageCircle, ShieldCheck, ArrowUpRight, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrganizationSettings } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  settings: OrganizationSettings;
  onNavigate: (path: string) => void;
}

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.776-.963-1.393-1.813-1.79-.128 2.854-1.19 5.003-3.188 5.003-1.971 0-3.074-2.051-3.074-3.884 0-2.268 1.27-4.526 3.627-5.847.764-.43 1.614-.654 2.522-.654.363 0 .708.038 1.03.114-.32-1.372-1.276-2.45-2.528-2.45-1.226 0-1.812.954-1.812 2.093 0 1.143.586 2.093 1.812 2.093.524 0 .995-.147 1.406-.418C14.755 11.956 14.5 10.72 14.5 9.423c0-3.44 2.093-6.243 5.203-6.243 3.11 0 5.203 2.803 5.203 6.243 0 4.306-1.827 7.126-4.413 7.126-1.607 0-2.603-1.357-3.064-2.331-.09.872-.378 1.682-.829 2.374C16.95 21.326 14.883 22.2 12.186 24zM7.107 14.978c.762 0 1.379-.67 1.379-1.496 0-.826-.617-1.496-1.379-1.496s-1.379.67-1.379 1.496c0 .826.617 1.496 1.379 1.496z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const socialRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rhu-social-icon',
        { opacity: 0.35, y: 12, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: socialRowRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, socialRowRef);
    return () => ctx.revert();
  }, []);

  const socialLinks: { key: string; url: string; label: string; icon: React.ReactNode }[] = [
    { key: 'facebook', url: settings.socialLinks.facebook || '#', label: 'Facebook', icon: <FacebookIcon /> },
    { key: 'instagram', url: settings.socialLinks.instagram || '#', label: 'Instagram', icon: <InstagramIcon /> },
    { key: 'tiktok', url: settings.socialLinks.tiktok || '#', label: 'TikTok', icon: <TikTokIcon /> },
    { key: 'youtube', url: settings.socialLinks.youtube || '#', label: 'YouTube', icon: <YouTubeIcon /> },
    { key: 'linkedin', url: settings.socialLinks.linkedin || '#', label: 'LinkedIn', icon: <LinkedInIcon /> },
    { key: 'twitter', url: settings.socialLinks.twitter || '#', label: 'X', icon: <XIcon /> },
    { key: 'threads', url: settings.socialLinks.threads || '#', label: 'Threads', icon: <ThreadsIcon /> },
  ].filter((link) => link.url !== '#');
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#EDEBE2] pt-16 md:pt-20 pb-12 border-t border-white/10">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* TOP ROW: BRAND & DONATE BANNER */}
        <div className="pb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#69B53F] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <circle cx="12" cy="13" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-editorial text-2xl tracking-tight text-white">
                Revel House Uganda
              </span>
            </div>
            <p className="text-sm text-[#EDEBE2]/70 max-w-lg leading-relaxed">
              A community-driven nonprofit organization advancing child protection, foundational education, maternal health, and WASH infrastructure in Uganda.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-end gap-3">
            <button
              id="footer-donate-btn"
              onClick={() => handleNav('/donate')}
              className="btn-african-primary inline-flex items-center gap-2.5 px-6 py-3 transition-all duration-300 transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Support Our Mission</span>
            </button>
            <button
              id="footer-get-involved-btn"
              onClick={() => handleNav('/get-involved')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              <span>Get Involved</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: 4 COLUMNS */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* COL 1: NAVIGATION */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#69B53F] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EDEBE2]/75">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors">
                  About Our Organization
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/programs')} className="hover:text-white transition-colors">
                  Key Programs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/projects')} className="hover:text-white transition-colors">
                  Active Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/impact')} className="hover:text-white transition-colors">
                  Impact & Accountability
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/news')} className="hover:text-white transition-colors">
                  News & Community Stories
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sponsor-a-child')} className="hover:text-white transition-colors">
                  Sponsor a Child
                </button>
              </li>
            </ul>
          </div>

          {/* COL 2: INITIATIVES */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#69B53F] mb-4">
              Initiatives
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EDEBE2]/75">
              <li>
                <button onClick={() => handleNav('/projects/wash-sanitation-schools')} className="hover:text-white transition-colors text-left">
                  WASH & School Sanitation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/programs/child-care-and-protection')} className="hover:text-white transition-colors text-left">
                  Child Care & Protection
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/programs/education-and-foundational-learning')} className="hover:text-white transition-colors text-left">
                  Education & Literacy Hubs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/programs/health-and-medical-care')} className="hover:text-white transition-colors text-left">
                  Health & Medical Outreach
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/partner')} className="hover:text-white transition-colors text-left">
                  Institutional Partnerships
                </button>
              </li>
            </ul>
          </div>

          {/* COL 3: CONTACT INFORMATION */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#69B53F] mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#EDEBE2]/75">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#69B53F] shrink-0" />
                <a href="mailto:frankhalland64@gmail.com" className="hover:text-white transition-colors">
                  frankhalland64@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#69B53F] shrink-0" />
                <a
                  href="https://wa.me/256742195432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +256 742 195432
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#69B53F] shrink-0" />
                <a
                  href="https://wa.me/256771495075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +256771495075
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#69B53F] shrink-0" />
                <a href="mailto:revelhouseuganda@gmail.com" className="hover:text-white transition-colors">
                  revelhouseuganda@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => handleNav('/contact')}
                  className="text-xs font-semibold text-[#69B53F] hover:underline flex items-center gap-1"
                >
                  <span>Open Contact Desk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* COL 4: SAFEGUARDING & GOVERNANCE */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-[#69B53F]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Safeguarding</span>
            </div>
            <p className="text-xs text-[#EDEBE2]/70 leading-relaxed">
              We hold zero tolerance for harm, neglect, or exploitation of children and vulnerable beneficiaries.
            </p>
            <div className="pt-1">
              <button
                onClick={() => handleNav('/safeguarding')}
                className="text-xs text-white underline hover:text-[#69B53F] transition-colors"
              >
                Read Safeguarding Protocols →
              </button>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] text-[#EDEBE2]/50 block">NGO Status:</span>
              <span className="text-[11px] text-[#EDEBE2]/75 font-mono">
                {settings.registrationNumber}
              </span>
            </div>
          </div>
        </div>

        {/* SOCIAL MEDIA ICONS */}
        <div ref={socialRowRef} className="pt-10 pb-8 border-b border-white/10 flex flex-col items-center gap-5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#EDEBE2]/40 font-medium">
            Follow Us
          </span>
          <div className="flex items-center gap-3">
             {socialLinks.map((link) => (
               <a
                 key={link.key}
                 href={link.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label={link.label}
                 className="rhu-social-icon w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#EDEBE2]/60 hover:text-[#69B53F] hover:border-[#69B53F]/40 hover:bg-[#69B53F]/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(105,181,63,0.15)] transition-all duration-300 ease-out"
               >
                 <span className="text-[#EDEBE2]">{link.icon}</span>
               </a>
             ))}
          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT & LEGAL */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDEBE2]/50">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button
              onClick={() => handleNav('/privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => handleNav('/safeguarding')}
              className="hover:text-white transition-colors"
            >
              Child Safeguarding
            </button>
            <span>·</span>
            <button
              onClick={() => handleNav('/admin')}
              className="hover:text-white transition-colors text-[#69B53F]"
            >
              CMS Preview Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
