import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, BarChart3, FileText, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { ImpactStat } from '../types';
import { SectionHeading } from '../components/common/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

interface ImpactPageProps {
  stats: ImpactStat[];
  onNavigate: (path: string) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ stats, onNavigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero timeline
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.impact-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl.fromTo(
        '.impact-hero-text',
        { opacity: 0, x: -140, y: 15 },
        { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
      );

      // 2. Metrics grid
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#impact-stats-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      cardsTl
        .fromTo(
          '.impact-stat-card-left',
          { opacity: 0, x: -120, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.impact-stat-card-right',
          { opacity: 0, x: 120, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // 3. Methodology section
      const methodTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.impact-methodology-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      methodTl
        .fromTo(
          '.impact-methodology-header',
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.impact-method-0',
          { opacity: 0, x: -100, y: 30 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.impact-method-1',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.impact-method-2',
          { opacity: 0, x: 100, y: 30 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // 4. Support Callout
      const calloutTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.impact-callout-section',
          start: 'top 95%',
          end: 'top 35%',
          scrub: 2.2,
        },
      });
      calloutTl.fromTo(
        '.impact-callout-card',
        { opacity: 0, y: 55, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="impact-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="impact-hero-section max-w-3xl mb-16">
          <div className="impact-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                ACCOUNTABILITY & IMPACT
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Measurable, verifiable community change.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              We believe trust is earned through rigor. Every metric presented on our platform is tied to source documentation, baseline surveys, and community audit logs.
            </p>
          </div>
        </div>

        {/* METRICS GRID */}
        <div id="impact-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const sideClass = idx < 2 ? 'impact-stat-card-left' : 'impact-stat-card-right';
            return (
              <div
                key={stat.id}
                className={`${sideClass} bg-[var(--c-surface)] rounded-[26px] p-7 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-editorial text-5xl text-[var(--c-ink)] tracking-tight">
                      {stat.value.toLocaleString()}
                    </span>
                    <span className="font-editorial text-4xl text-[#69B53F]">
                      {stat.suffix}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--c-ink)] mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-start justify-between text-[11px] text-[var(--c-ink)]/60">
                  <div>
                    <span className="font-semibold text-[#69B53F] block uppercase tracking-wider text-[9px]">
                      Verified Source
                    </span>
                    <span className="line-clamp-1">{stat.source}</span>
                  </div>
                  <span className="font-mono text-[10px]">{stat.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* METHODOLOGY & DATA GOVERNANCE */}
        <div className="impact-methodology-section bg-[var(--c-soft)]/50 rounded-[32px] p-8 sm:p-12 border border-[var(--c-ink)]/8 mb-16">
          <div className="impact-methodology-header">
            <SectionHeading
              eyebrow="METHODOLOGY"
              title="How We Measure and Verify Progress"
              subtitle="Our Monitoring and Evaluation (M&E) framework adheres to strict ethical and verification guidelines."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="impact-method-0 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--c-surface)] flex items-center justify-center text-[#69B53F] shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                Baseline Surveys
              </h4>
              <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
                Before launching any intervention, we conduct household and school baseline surveys to document absenteeism, water access times, and child welfare conditions.
              </p>
            </div>

            <div className="impact-method-1 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--c-surface)] flex items-center justify-center text-[#69B53F] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                Community Verification
              </h4>
              <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
                School management committees (SMCs) and Village Health Teams sign off on completed works and log daily usage to prevent paper-only reporting.
              </p>
            </div>

            <div className="impact-method-2 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--c-surface)] flex items-center justify-center text-[#69B53F] shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                Annual Public Audits
              </h4>
              <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
                We prepare comprehensive financial and program execution reports filed with the Uganda NGO Bureau and shared openly with institutional partners.
              </p>
            </div>
          </div>
        </div>

        {/* SUPPORT CALLOUT */}
        <div className="impact-callout-section text-center max-w-2xl mx-auto space-y-5">
          <div className="impact-callout-card space-y-5">
            <h3 className="font-editorial text-3xl text-[var(--c-ink)]">
              Empower lasting change today
            </h3>
            <p className="text-sm text-[var(--c-ink)]/75 leading-relaxed">
              Your support delivers real, verified progress directly to children and communities who need it most.
            </p>
            <button
              onClick={() => onNavigate('/donate')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
