import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { BlankImage } from '../common/BlankImage';
import { useMedia } from '../../context/MediaContext';

gsap.registerPlugin(ScrollTrigger);

interface SponsorSnippetProps {
  onNavigate: (path: string) => void;
}

export const SponsorSnippet: React.FC<SponsorSnippetProps> = ({ onNavigate }) => {
  const { getImage } = useMedia();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sponsorTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      sponsorTl
        .fromTo(
          '.sponsor-home-visual',
          { opacity: 0, x: -140, y: 15, rotateY: -8, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.sponsor-home-content',
          { opacity: 0, x: 140, y: 15, rotateY: 8, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 },
          0
        );

      // Offset badge continuous breathing float
      gsap.to('.sponsor-home-offset', {
        y: -14,
        x: 4,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    'Education & Learning',
    'Nutritious Food',
    'Healthcare & Checkups',
    'Protection & Safe Care',
  ];

  return (
    <section
      ref={sectionRef}
      id="sponsor-section"
      className="py-16 md:py-24 bg-transparent border-0 border-none overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* LEFT: CHILD-FOCUSED VISUAL */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative sponsor-home-visual">
            <div className="relative max-w-lg mx-auto">
              <BlankImage
                aspectRatio="aspect-square"
                rounded="rounded-[40px]"
                tone="sage"
                src={getImage('sponsor.main', '/images/safecare.jpeg')}
                label="Sponsored child community care photograph"
                className="shadow-md border-[#69B53F]/20"
              >
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white mb-4 border border-white/20">
                    <Heart className="w-7 h-7 fill-current" />
                  </div>
                  <span className="font-editorial text-2xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] block mb-1">
                    Sponsor a Child
                  </span>
                  <span className="text-xs text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] max-w-xs">
                    Consistent support — education, food, healthcare, and protection.
                  </span>
                </div>
              </BlankImage>

              {/* Offset secondary frame with breathing float */}
              <div className="sponsor-home-offset absolute -bottom-6 -right-4 sm:-right-8 w-44 sm:w-56 hidden sm:block">
                <BlankImage
                  aspectRatio="aspect-[4/3]"
                  rounded="rounded-[24px]"
                  tone="cream"
                  src={getImage('sponsor.offset', '/images/imgt15.jpeg')}
                  label="Verified child sponsorship impact photograph"
                  className="shadow-lg border-[var(--c-ink)]/10"
                >
                  <div className="p-3 text-center">
                    <span className="text-[10px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block uppercase tracking-wider">
                      Your Investment
                    </span>
                    <span className="text-xs text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      A Lifetime of Possibilities
                    </span>
                  </div>
                </BlankImage>
              </div>
            </div>
          </div>

          {/* RIGHT: STORYTELLING & CTA */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 sponsor-home-content">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/8">
              <span className="w-2 h-2 rounded-full bg-[#69B53F] animate-pulse-gently" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#69B53F]">
                SPONSOR A CHILD · TRANSFORM A FUTURE
              </span>
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] tracking-tight leading-[1.08] text-[var(--c-ink)]">
              Be the reason a child keeps dreaming.
            </h3>

            <p className="text-base text-[var(--c-ink)]/80 leading-relaxed">
              Every child deserves the opportunity to learn, grow, feel safe, and dream beyond their
              circumstances. Through consistent sponsorship, you can provide education, nutritious food,
              healthcare, protection, and opportunity for a brighter future.
            </p>

            {/* WHAT SPONSORSHIP PROVIDES */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[var(--c-ink)]/80">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* ACTIONS */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="sponsor-home-cta-btn"
                onClick={() => onNavigate('/sponsor-a-child')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] shadow-xs transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Sponsor a Child</span>
              </button>

              <button
                id="sponsor-home-options-btn"
                onClick={() => onNavigate('/sponsor-a-child')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[var(--c-surface)] text-[var(--c-ink)] text-xs font-semibold uppercase tracking-wider border border-[var(--c-ink)]/15 hover:border-[var(--c-ink)]/30 transition-colors"
              >
                <span>Explore Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};