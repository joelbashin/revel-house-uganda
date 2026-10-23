import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, GraduationCap, Apple, Stethoscope, ShieldCheck, ArrowRight, Repeat, Gift, Users } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BlankImage } from '../components/common/BlankImage';
import { SponsorGallery } from '../components/common/SponsorGallery';
import { useMedia } from '../context/MediaContext';

gsap.registerPlugin(ScrollTrigger);

interface SponsorChildPageProps {
  onNavigate: (path: string) => void;
}

export const SponsorChildPage: React.FC<SponsorChildPageProps> = ({ onNavigate }) => {
  const { getImage } = useMedia();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.sponsor-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl
        .fromTo(
          '.sponsor-hero-text',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.sponsor-hero-image',
          { opacity: 0, x: 140, y: 15, scale: 0.96 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // Provides grid
      const providesTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#sponsor-provides-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      providesTl
        .fromTo(
          '.sponsor-provide-card-left',
          { opacity: 0, x: -120, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.sponsor-provide-card-right',
          { opacity: 0, x: 120, y: 25, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // Manifesto band
      const manifestoTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.sponsor-manifesto-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      manifestoTl
        .fromTo(
          '.sponsor-manifesto-heading',
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.sponsor-manifesto-image',
          { opacity: 0, x: -140, y: 25 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.sponsor-manifesto-item',
          { opacity: 0, x: 60, y: 20 },
          { opacity: 1, x: 0, y: 0, ease: 'none', stagger: 0.12, duration: 0.7 },
          0
        );

      // Options grid
      const optionsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#sponsor-options-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      optionsTl.fromTo(
        '.sponsor-option-card',
        { opacity: 0, y: 70, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, ease: 'none', stagger: 0.1, duration: 0.9 }
      );

      // Process steps
      const processTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.sponsor-process-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      processTl
        .fromTo(
          '.sponsor-process-heading',
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.sponsor-step-0',
          { opacity: 0, x: -100, y: 30 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.sponsor-step-1',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.sponsor-step-2',
          { opacity: 0, x: 100, y: 30 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // Final callout
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.sponsor-cta-section',
          start: 'top 95%',
          end: 'top 35%',
          scrub: 2.2,
        },
      });
      ctaTl.fromTo(
        '.sponsor-cta-card',
        { opacity: 0, y: 55, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const scrollToOptions = () => {
    document.getElementById('sponsor-options')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openSponsorship = () => {
    onNavigate(
      '/donate?designation=' +
        encodeURIComponent('Child Care & Family Preservation (Protection & food relief)')
    );
  };

  const provides = [
    {
      title: 'Education & Learning',
      text: 'School kits, uniforms, tuition support, and literacy programs that keep vulnerable children in the classroom.',
      img: getImage('sponsorChild.education', '/images/imgt5.jpeg'),
      tone: 'sage' as const,
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      title: 'Nutritious Food',
      text: 'Balanced meals and household food security that let children grow strong, stay healthy, and concentrate in school.',
      img: getImage('sponsorChild.food', '/images/livelihoods.jpeg'),
      tone: 'sage' as const,
      icon: <Apple className="w-5 h-5" />,
    },
    {
      title: 'Healthcare & Checkups',
      text: 'Medical screening, treatment referrals, hygiene education, and psychosocial support for safer childhoods.',
      img: getImage('sponsorChild.healthcare', '/images/imgt4.jpeg'),
      tone: 'clay' as const,
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      title: 'Protection & Safe Care',
      text: 'Community safeguarding, family preservation, and protective safety nets wrapped around every sponsored child.',
      img: getImage('sponsorChild.protection', '/images/imgt10.jpeg'),
      tone: 'clay' as const,
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  const manifesto = [
    'One Sponsor. One Child. A Lifetime of Possibilities.',
    "Change a Child's Story, One Step at a Time.",
    'Give Hope. Create Opportunity. Transform Tomorrow.',
    'Your Support Can Build a Brighter Future.',
  ];

  const options = [
    {
      key: 'monthly',
      icon: Repeat,
      title: 'Monthly Sponsorship',
      text: "Consistent monthly support that sustains a child's education, nutrition, healthcare, and protection throughout the year.",
      cta: 'Sponsor Monthly',
    },
    {
      key: 'once',
      icon: Gift,
      title: 'One-Time Gift',
      text: "A single contribution that responds to a child's immediate needs — from school essentials to emergency food relief.",
      cta: 'Give Once',
    },
    {
      key: 'circle',
      icon: Users,
      title: 'Family & Group Circle',
      text: 'Combine support as a family, classroom, faith group, or workplace to sponsor change together.',
      cta: 'Form a Circle',
    },
  ];

  const steps = [
    {
      title: 'Choose How to Give',
      text: 'Select monthly sponsorship, a one-time gift, or a group circle that fits your capacity and your heart.',
    },
    {
      title: 'Receive Verified Updates',
      text: 'Our field teams document the impact of your support through site notes, photographs, and progress records.',
    },
    {
      title: 'Watch a Life Transform',
      text: "Follow a child's journey as education, good health, and hope reshape what the future holds.",
    },
  ];

  return (
    <div id="sponsor-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="sponsor-hero-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="sponsor-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                SPONSOR A CHILD · TRANSFORM A FUTURE
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Sponsor a Child. Transform a Future.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              Every child deserves the opportunity to learn, grow, feel safe, and dream beyond their circumstances.
              Through sponsorship, you can provide consistent support that helps vulnerable children access education,
              nutritious food, healthcare, protection, and opportunities for a brighter future.
            </p>

            <p className="mt-5 font-editorial text-xl sm:text-2xl text-[#69B53F] leading-snug">
              Your support is more than a donation. It is a lasting investment in a life.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openSponsorship}
                className="btn-african-primary group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Sponsor a Child Today</span>
              </button>
              <button
                onClick={scrollToOptions}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[var(--c-ink)]/15 text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)] hover:bg-[var(--c-ink)] hover:text-[var(--c-bg)] transition-colors"
              >
                <span>Explore Sponsorship Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="sponsor-hero-image">
            <BlankImage
              aspectRatio="aspect-[4/5]"
              rounded="rounded-[36px]"
              tone="sage"
              src={getImage('sponsorChild.hero', '/images/safecare.jpeg')}
              label="Field photograph of community-supported child care"
              className="shadow-md"
            >
              <div className="p-6 text-center">
                <span className="text-[11px] uppercase font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block mb-1">
                  Your Promise In Action
                </span>
                <span className="font-editorial text-2xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] block">
                  Every child, a future worth investing in
                </span>
              </div>
            </BlankImage>
          </div>
        </div>
      </div>

      {/* SPONSORSHIP FIELD ARCHIVE — immersive horizontal gallery */}
      <div className="gallery-room border-y border-[var(--c-ink)]/8 bg-[var(--c-soft)]/35 py-10 sm:py-12 overflow-hidden">
        <SponsorGallery onNavigate={onNavigate} />
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* WHAT SPONSORSHIP PROVIDES */}
        <div className="mb-20">
          <SectionHeading
            align="center"
            eyebrow="WHAT SPONSORSHIP PROVIDES"
            title="Where Your Support Goes"
            subtitle="Consistent sponsorship delivers five essentials of a thriving childhood — education, nutritious food, healthcare, protection, and opportunity."
          />

          <div id="sponsor-provides-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {provides.map((item, idx) => (
              <div
                key={item.title}
                className={`${
                  idx % 2 === 0 ? 'sponsor-provide-card-left' : 'sponsor-provide-card-right'
                } bg-[var(--c-surface)] rounded-[26px] p-5 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 transition-all duration-300`}
              >
                <div className="mb-5 overflow-hidden rounded-[20px]">
                  <BlankImage
                    aspectRatio="aspect-[16/10]"
                    rounded="rounded-[20px]"
                    tone={item.tone}
                    src={item.img}
                    label={`Field photograph representing ${item.title}`}
                  >
                    <div className="p-3 text-center">
                      <span className="font-editorial text-base text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {item.title}
                      </span>
                    </div>
                  </BlankImage>
                </div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] border border-[var(--c-ink)]/6 shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="font-editorial text-lg text-[var(--c-ink)]">{item.title}</h3>
                </div>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MANIFESTO / DARK BAND */}
        <div className="sponsor-manifesto-section bg-[#111111] text-white rounded-[36px] p-8 sm:p-12 mb-20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 sponsor-manifesto-image">
              <BlankImage
                aspectRatio="aspect-[4/3]"
                rounded="rounded-[26px]"
                tone="sage"
                src={getImage('sponsorChild.manifesto', '/images/imgt13.jpeg')}
                label="Field photograph of a child supported by community sponsorship"
              >
                <div className="p-4 text-center">
                  <span className="font-editorial text-xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] block">
                    Hope, delivered daily
                  </span>
                </div>
              </BlankImage>
            </div>

            <div className="lg:col-span-7">
              <div className="sponsor-manifesto-heading mb-8">
                <div className="inline-flex items-center gap-2 mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#69B53F]">
                    THE PROMISE OF SPONSORSHIP
                  </span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] text-white">
                  Be the Reason a Child Keeps Dreaming.
                </h2>
              </div>

              <ul className="space-y-4">
                {manifesto.map((line, idx) => (
                  <li key={line} className="sponsor-manifesto-item flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 border border-[#69B53F]/30 text-[#69B53F] flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-editorial text-lg sm:text-xl text-[#EDEBE2] leading-snug">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SPONSORSHIP OPTIONS */}
        <div id="sponsor-options" className="mb-20 scroll-mt-28">
          <SectionHeading
            align="center"
            eyebrow="SPONSORSHIP OPTIONS"
            title="Explore Sponsorship Options"
            subtitle="Choose the way that fits you best. Every path delivers consistent, dignified support directly to children in Uganda."
          />

          <div id="sponsor-options-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.key}
                  className="sponsor-option-card bg-[var(--c-surface)] rounded-[28px] p-8 border border-[var(--c-ink)]/8 shadow-xs space-y-4 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] border border-[var(--c-ink)]/6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-2xl text-[var(--c-ink)]">{opt.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed flex-1">
                    {opt.text}
                  </p>
                  <button
                    onClick={() => onNavigate('/donate')}
                    className="w-full py-3 rounded-full border border-[var(--c-ink)]/15 text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)] hover:bg-[#69B53F] hover:border-[#69B53F] hover:text-white transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>{opt.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW SPONSORSHIP WORKS */}
        <div className="sponsor-process-section bg-[var(--c-soft)]/50 rounded-[32px] p-8 sm:p-12 mb-20 border border-[var(--c-ink)]/8">
          <div className="sponsor-process-heading">
            <SectionHeading
              eyebrow="HOW SPONSORSHIP WORKS"
              title="Three Simple Steps"
              subtitle="From your first gift to a child's long-term transformation — the process is transparent, dignified, and community-owned."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.title} className={`sponsor-step-${idx} space-y-3`}>
                <span className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">{step.title}</h4>
                <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CALLOUT */}
        <div className="sponsor-cta-section text-center max-w-2xl mx-auto space-y-5">
          <div className="sponsor-cta-card space-y-5">
            <h3 className="font-editorial text-3xl sm:text-4xl text-[var(--c-ink)]">
              Give Hope. Create Opportunity. Transform Tomorrow.
            </h3>
            <p className="text-sm text-[var(--c-ink)]/75 leading-relaxed">
              Your support today becomes a child's tomorrow.
            </p>
            <button
              onClick={openSponsorship}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Sponsor a Child Today</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};