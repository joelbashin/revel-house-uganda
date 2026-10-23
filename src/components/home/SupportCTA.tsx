import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrganicBlob } from '../common/Decorations';

gsap.registerPlugin(ScrollTrigger);

interface SupportCTAProps {
  onNavigate: (path: string) => void;
}

export const SupportCTA: React.FC<SupportCTAProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container & contents: appear from left & right converging slowly as user scrolls down, disappear slowly to left and right as user scrolls up
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      ctaTl
        .fromTo(
          '.cta-box-anim',
          { opacity: 0, scale: 0.94, y: 30, rotateX: -8, transformOrigin: 'center top' },
          { opacity: 1, scale: 1, y: 0, rotateX: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.cta-left-anim',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.cta-right-anim',
          { opacity: 0, x: 140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.cta-bottom-anim',
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, ease: 'none', duration: 1 },
          0.05
        );

      // Continuous living breathing organic blob inside the card
      gsap.to('.cta-blob-anim', {
        scale: 1.25,
        rotation: 14,
        x: 22,
        y: -18,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Parallax scroll scrub for background blob
      if (sectionRef.current) {
        gsap.to('.cta-blob-anim', {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="support-cta-section"
      className="py-16 md:py-24 bg-transparent border-0 border-none overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="cta-box-anim tilt-3d relative rounded-[36px] bg-[#111111] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl flow-line">
          
          {/* Subtle warm fluid wave layer */}
          <div className="wave-layer" aria-hidden="true" />

          {/* Subtle decorative background organic shape with living breathing loop */}
          <div className="cta-blob-anim absolute -right-20 -top-20 opacity-15 pointer-events-none" aria-hidden="true">
            <OrganicBlob color="green" className="w-[450px] h-[450px]" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="cta-left-anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#69B53F] font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#69B53F] animate-pulse-gently" />
              <span>COMMUNITY PARTNERSHIP</span>
            </div>

            <h2 className="cta-left-anim font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-tight leading-[1.06] text-white">
              Help create a future full of possibilities.
            </h2>

            <p className="cta-right-anim text-base sm:text-lg text-[#EDEBE2]/80 leading-relaxed font-light">
              Every contribution directly fuels clean water infrastructure in partner schools, basic school kits for vulnerable children, and essential maternal health outreaches across rural Uganda.
            </p>

            <div className="cta-right-anim pt-4 flex flex-wrap items-center gap-4">
              <button
                id="cta-donate-now-btn"
                onClick={() => onNavigate('/donate')}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#69B53F] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#5aa134] shadow-md transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>SUPPORT REVEL HOUSE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="cta-partner-btn"
                onClick={() => onNavigate('/partner')}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <span>Institutional Partnerships</span>
              </button>
            </div>

            <div className="cta-bottom-anim pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#EDEBE2]/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#69B53F]" />
                <span>Strict Safeguarding & Child Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F]" />
                <span>Transparent Quarterly Reporting</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
