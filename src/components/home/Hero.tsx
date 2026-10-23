import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Heart } from 'lucide-react';
import { BlankImage } from '../common/BlankImage';
import { MapDecoration, OrganicBlob, DecorativeDots } from '../common/Decorations';
import { OrganizationSettings } from '../../types';
import { useMedia } from '../../context/MediaContext';
import heroBgImage from '../../assets/hero-bg.png';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  settings: OrganizationSettings;
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onNavigate }) => {
  const { getImage } = useMedia();
  const heroRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP deliberate, slow, breathing animations
    const ctx = gsap.context(() => {
      // Left text entrance: slow, graceful, editorial appearance
      gsap.from('.hero-text-elem', {
        opacity: 0,
        y: 45,
        duration: 1.7,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.1,
      });

      // Right collage segmented blank frames: slow, organic bloom into view
      gsap.from('.hero-segment', {
        opacity: 0,
        scale: 0.88,
        y: 50,
        duration: 1.9,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.35,
      });

      // 3D scroll parallax on the collage stage + left content
      if (collageRef.current && heroRef.current) {
        // Give the collage a lightweight 3D stage that rotates as you scroll
        gsap.to('.hero-collage', {
          rotateY: 8,
          rotateX: -4,
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom center',
            scrub: 1.6,
          },
        });
        gsap.to('.hero-pillar-3', { z: 120, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.6 } });
        gsap.to('.hero-pillar-1', { z: -60, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.6 } });
      }

      // Continuous slow, natural breathing loops (making it feel alive)
      gsap.to('.hero-float-blob', {
        y: -28,
        x: 16,
        scale: 1.08,
        rotation: 6,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-float-map', {
        y: 20,
        x: -12,
        rotation: -4,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Three collage columns breathe with gently desynchronized counter-rhythms
      gsap.to('.hero-pillar-1', {
        y: -14,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-pillar-2', {
        y: 16,
        duration: 8.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8,
      });

      gsap.to('.hero-pillar-3', {
        y: -12,
        duration: 7.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
      });

      gsap.to('.hero-badge-float', {
        y: -8,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Rich scroll-linked parallax: gentle scrolling reaction as user scrolls down
      if (heroRef.current) {
        gsap.to('.hero-float-blob', {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });

        // Subtle parallax scrub as user scrolls
        gsap.to('.hero-float-map', {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative pt-28 pb-10 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20 overflow-hidden border-none"
    >
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute top-12 right-0 md:right-10 pointer-events-none opacity-40 hero-float-blob" aria-hidden="true">
        <OrganicBlob color="cream" className="w-[480px] h-[480px]" />
      </div>
      <div className="absolute -bottom-8 left-10 pointer-events-none opacity-30 hero-float-map" aria-hidden="true">
        <MapDecoration className="w-80 h-80 text-[#69B53F]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: MISSION HEADLINE & CTAS */}
          <div ref={leftContentRef} className="lg:col-span-6 xl:col-span-6 space-y-6 relative">
            {/* Background image behind text */}
            <div 
              className="absolute -inset-4 sm:-inset-6 lg:-inset-8 -z-10 rounded-3xl overflow-hidden pointer-events-none select-none"
              aria-hidden="true"
            >
              <img
                src={heroBgImage}
                alt="Joyful Boy with Raised Hands"
                className="w-full h-full object-cover object-center"
              />
              {/* Transparent subtle backdrop ensuring complete clarity and image visibility */}
              <div className="absolute inset-0 bg-transparent" />
            </div>
            
            {/* Small Eyebrow */}
            <div className="hero-text-elem inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[var(--c-ink)]/15 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#E85B3F] animate-pulse-gently" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--c-ink)]">
                {settings.tagline || 'COMMUNITY DEVELOPMENT · UGANDA'}
              </span>
            </div>

            {/* Large Serif Headline */}
            <h1 className="hero-text-elem font-editorial text-4xl sm:text-5xl md:text-6xl xl:text-[68px] tracking-tight leading-[1.02] text-white font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Creating opportunities. <br />
              <span className="text-[#FFD166] italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">Strengthening</span> communities. <br />
              Building better futures.
            </h1>

            {/* Supporting Paragraph */}
            <p className="hero-text-elem text-base sm:text-lg text-white font-bold leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {settings.mission}
            </p>

            {/* Call to Actions */}
            <div className="hero-text-elem pt-2 flex flex-wrap items-center gap-4">
              <button
                id="hero-donate-cta"
                onClick={() => onNavigate('/donate')}
                className="btn-african-primary group relative inline-flex items-center gap-2.5 px-7 py-3.5 shadow-lg transition-all duration-300 transform active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-golden"
              >
                <Heart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Donate / Support</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-learn-more-cta"
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--c-surface)] text-[var(--c-ink)] text-sm font-bold border border-white/40 hover:bg-[var(--c-soft)] transition-all duration-200 shadow-md"
              >
                <span>Learn More</span>
              </button>
            </div>

            {/* Transparency assurance note */}
            <div className="hero-text-elem pt-4 flex items-center gap-3 text-xs text-white font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              <DecorativeDots />
              <span>Direct grassroots delivery · Transparent community reporting</span>
            </div>
          </div>

          {/* RIGHT COLUMN: ORGANIC MULTI-IMAGE COMPOSITION */}
          {/* Field photographs fill the collage frames. */}
          <div ref={collageRef} className="lg:col-span-6 xl:col-span-6 relative scene-3d">
            <div className="hero-collage grid grid-cols-12 gap-3 sm:gap-4 items-center scene-3d-preserve">
              
              {/* SEGMENT 1: Tall elongated left pillar */}
              <div className="col-span-4 space-y-3 sm:space-y-4 hero-pillar-1">
                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-[3/5]"
                    rounded="rounded-[36px]"
                    tone="sage"
                    src={getImage('hero.safeCare', '/images/safecare.jpeg')}
                    label="Safe Care Community field photograph"
                    className="shadow-sm hover:border-[#69B53F]/40 transition-all duration-500"
                  >
                    <div className="text-center p-3">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                        Safe Care
                      </span>
                      <span className="text-[9px] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Community</span>
                    </div>
                  </BlankImage>
                </div>

                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-square"
                    rounded="rounded-[28px]"
                    tone="cream"
                    src={getImage('hero.literacy', '/images/imgt5.jpeg')}
                    label="Literacy and learning field photograph"
                    className="shadow-xs"
                  />
                </div>
              </div>

              {/* SEGMENT 2: Center dominant editorial pillar */}
              <div className="col-span-4 space-y-3 sm:space-y-4 -mt-6 sm:-mt-10 hero-pillar-2">
                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-[4/5]"
                    rounded="rounded-[42px]"
                    tone="canvas"
                    src={getImage('hero.wash', '/images/imgt1.jpeg')}
                    label="School sanitation and water project photograph"
                    className="shadow-md hover:border-[var(--c-ink)]/20 transition-all duration-500"
                  >
                    <div className="text-center p-4">
                      <span className="font-editorial text-[15px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                        WASH & Water
                      </span>
                      <span className="text-[10px] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Dignity in Schools</span>
                    </div>
                  </BlankImage>
                </div>

                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-[3/4]"
                    rounded="rounded-[32px]"
                    tone="clay"
                    src={getImage('hero.youth', '/images/imgt3.jpeg')}
                    label="Youth mentoring field photograph"
                    className="shadow-xs"
                  />
                </div>
              </div>

              {/* SEGMENT 3: Right pillar */}
              <div className="col-span-4 space-y-3 sm:space-y-4 mt-4 sm:mt-8 hero-pillar-3">
                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-square"
                    rounded="rounded-[30px]"
                    tone="stone"
                    src={getImage('hero.livelihoods', '/images/livelihoods.jpeg')}
                    label="Caregiver livelihood groups field photograph"
                    className="shadow-xs hover:border-[#36A8A0]/40 transition-all duration-500"
                  >
                    <div className="text-center p-3">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                        Livelihoods
                      </span>
                      <span className="text-[9px] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Caregiver Circles</span>
                    </div>
                  </BlankImage>
                </div>

                <div className="hero-segment">
                  <BlankImage
                    aspectRatio="aspect-[3/5]"
                    rounded="rounded-[36px]"
                    tone="cream"
                    src={getImage('hero.health', '/images/imgt4.jpeg')}
                    label="Health and nutrition outreach field photograph"
                    className="shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* Subtle floating badge */}
            <div className="hero-segment hero-badge-float absolute -bottom-4 right-6 sm:right-12 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border border-[var(--c-ink)]/8 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#69B53F] animate-pulse-gently" />
              <div>
                <p className="text-[11px] font-semibold text-[var(--c-ink)] leading-none">
                  Central Uganda
                </p>
                <p className="text-[9px] text-[var(--c-ink)]/60 mt-0.5">
                  Verified Grassroots Programs
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
