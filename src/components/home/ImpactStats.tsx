import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Info } from 'lucide-react';
import { ImpactStat } from '../../types';
import { SectionHeading } from '../common/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

interface ImpactStatsProps {
  stats: ImpactStat[];
  onNavigate: (path: string) => void;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ stats, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header: left heading comes from left, right button comes from right slowly as you scroll down; disappear slowly to left and right as you scroll up
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.impact-header-anim',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      headerTl
        .fromTo(
          '.impact-header-left',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.impact-header-right',
          { opacity: 0, x: 140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // Cards: cards 0 & 1 from left, cards 2 & 3 from right; converge slowly as you scroll down, disappear slowly as you scroll up
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#impact-cards-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      cardsTl
        .fromTo(
          '#impact-card-schools',
          { opacity: 0, x: -140, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '#impact-card-children',
          { opacity: 0, x: -60, y: 55, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '#impact-card-clinics',
          { opacity: 0, x: 60, y: 55, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '#impact-card-partners',
          { opacity: 0, x: 140, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // Methodology note: appear from bottom slowly as you scroll down, disappear as you scroll up
      const noteTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#impact-methodology-note',
          start: 'top 95%',
          end: 'top 50%',
          scrub: 2.2,
        },
      });
      noteTl.fromTo(
        '#impact-methodology-note',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'none', duration: 1 }
      );

      // Count up numbers: progressive reveal as user reaches the section
      stats.forEach((stat) => {
        const el = document.getElementById(`stat-number-${stat.id}`);
        if (!el) return;

        const targetVal = stat.value;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#impact-cards-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val).toLocaleString();
          },
        });
      });

      // Breathing aura ambient loops
      gsap.to('.impact-aura-1', {
        scale: 1.35,
        opacity: 0.28,
        duration: 8.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.impact-aura-2', {
        scale: 1.3,
        opacity: 0.22,
        duration: 9.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });

      // Parallax scroll scrub for auras and cards
      if (containerRef.current) {
        gsap.to('.impact-aura-1', {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });

        gsap.to('.impact-aura-2', {
          yPercent: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={containerRef}
      id="impact-section"
      className="py-20 md:py-28 bg-[#111111] text-[#EDEBE2] relative overflow-hidden border-0 border-none"
    >
      {/* Subtle organic background aura with living breathing float */}
      <div
        className="impact-aura-1 absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#69B53F]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="impact-aura-2 absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#36A8A0]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="impact-header-anim flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            eyebrow="TRANSPARENT IMPACT"
            title="Measured change backed by field verification."
            subtitle="Every metric we publish represents verifiable community progress audited with local school leadership and health officers."
            dark={true}
            className="mb-0 impact-header-left"
          />

          <button
            id="view-impact-report-btn"
            onClick={() => onNavigate('/impact')}
            className="impact-header-right inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69B53F] hover:text-white transition-colors shrink-0 self-start md:self-end pb-2"
          >
            <span>Full Impact Framework & Sources →</span>
          </button>
        </div>

        {/* 4-COLUMN METRICS GRID */}
        <div id="impact-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              id={`impact-card-${stat.id}`}
              className="stat-card-anim bg-white/5 rounded-[24px] p-6 sm:p-7 border border-white/10 hover:border-[#69B53F]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* NUMBER WITH COUNT-UP */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    id={`stat-number-${stat.id}`}
                    className="font-editorial text-4xl sm:text-5xl lg:text-[52px] text-white tracking-tight"
                  >
                    0
                  </span>
                  <span className="font-editorial text-3xl sm:text-4xl text-[#69B53F]">
                    {stat.suffix}
                  </span>
                </div>

                {/* LABEL */}
                <h4 className="text-sm font-semibold text-white group-hover:text-[#69B53F] transition-colors">
                  {stat.label}
                </h4>

                {/* DESCRIPTION */}
                <p className="mt-2 text-xs text-[#EDEBE2]/70 leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* AUDIT SOURCE & DATE (PER ETHICAL SPECIFICATION) */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-start justify-between text-[10px] text-[#EDEBE2]/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[#69B53F]">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="font-semibold uppercase tracking-wider">Source</span>
                  </div>
                  <span className="line-clamp-1">{stat.source}</span>
                </div>
                <span className="font-mono">{stat.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* METHODOLOGY NOTE */}
        <div id="impact-methodology-note" className="mt-12 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#EDEBE2]/60">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#69B53F] shrink-0" />
            <span>
              Revel House Uganda strictly adheres to transparent monitoring. We never inflate statistics or publish unverified beneficiary counts.
            </span>
          </div>
          <button
            onClick={() => onNavigate('/safeguarding')}
            className="text-[#69B53F] hover:underline shrink-0"
          >
            Review Safeguarding & Ethics →
          </button>
        </div>

      </div>
    </section>
  );
};
