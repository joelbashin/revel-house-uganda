import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Compass } from 'lucide-react';
import { DotPattern } from '../common/Decorations';

gsap.registerPlugin(ScrollTrigger);

interface AboutSnippetProps {
  onNavigate: (path: string) => void;
}

export const AboutSnippet: React.FC<AboutSnippetProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Words and elements: appear from left and right converging slowly as user scrolls down, disappear slowly to left and right as user scrolls up
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });

      aboutTl
        .fromTo(
          '.about-snippet-eyebrow',
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.about-snippet-heading',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-snippet-narrative',
          { opacity: 0, x: 140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-snippet-btn-left',
          { opacity: 0, x: -100, y: 25 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0.05
        )
        .fromTo(
          '.about-snippet-btn-right',
          { opacity: 0, x: 100, y: 25 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0.05
        );

      // Ambient breathing motion for background dots
      gsap.to('.about-dot-anim', {
        y: -18,
        x: 8,
        rotation: 3,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Subtle parallax scrub on scroll
      if (sectionRef.current) {
        gsap.to('.about-dot-anim', {
          yPercent: 40,
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
      id="about-snippet-section"
      className="py-16 md:py-24 relative overflow-hidden bg-transparent border-0 border-none"
    >
      <div className="about-dot-anim absolute top-10 left-10 opacity-30 pointer-events-none hidden md:block">
        <DotPattern rows={5} cols={5} />
      </div>

      <div className="max-w-[880px] mx-auto px-5 sm:px-8 text-center relative z-10">
        {/* Eyebrow */}
        <div className="about-snippet-eyebrow inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8">
          <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
            ABOUT REVEL HOUSE UGANDA
          </span>
        </div>

        {/* Heading */}
        <h2 className="about-snippet-heading font-editorial text-3xl sm:text-4xl md:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.12]">
          Building stronger futures through people, opportunity and community.
        </h2>

        {/* Narrative */}
        <p className="about-snippet-narrative mt-6 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed font-normal">
          Founded on the conviction that sustainable humanitarian impact begins by listening to local voices, Revel House Uganda works side-by-side with village elders, teachers, and mothers. Rather than imposing outside models, we invest in grassroots capacity—reinforcing child protection networks, equipping schools with clean sanitation, and nurturing family resilience.
        </p>

        {/* Buttons: Green Learn More, Black Our Story */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            id="about-snippet-learn-more-btn"
            onClick={() => onNavigate('/about')}
            className="about-snippet-btn-left inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] shadow-xs transition-all duration-300 transform active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Learn More</span>
          </button>

          <button
            id="about-snippet-our-story-btn"
            onClick={() => onNavigate('/about')}
            className="about-snippet-btn-right inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black/80 shadow-xs transition-all duration-300 transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Our Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
