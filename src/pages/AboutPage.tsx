import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Heart, Users, Target, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { OrganizationSettings, TeamMember } from '../types';
import { BlankImage } from '../components/common/BlankImage';
import { SectionHeading } from '../components/common/SectionHeading';
import { MapDecoration, DotPattern } from '../components/common/Decorations';
import { useMedia } from '../context/MediaContext';

gsap.registerPlugin(ScrollTrigger);

interface AboutPageProps {
  settings: OrganizationSettings;
  team: TeamMember[];
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, team, onNavigate }) => {
  const { getImage } = useMedia();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero scroll timeline
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl
        .fromTo(
          '.about-hero-left',
          { opacity: 0, x: -140, y: 15, rotateY: -8, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.about-hero-right',
          { opacity: 0, x: 140, scale: 0.94, rotateY: 8, transformOrigin: 'right center' },
          { opacity: 1, x: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        );

      // 2. Story / Origin section timeline
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-story-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      storyTl
        .fromTo(
          '.about-story-visual',
          { opacity: 0, x: -140, y: 20 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.about-story-content',
          { opacity: 0, x: 140, y: 20 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // 3. Mission & Vision section timeline
      const missionTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-mission-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      missionTl
        .fromTo(
          '.about-mission-card',
          { opacity: 0, x: -120, y: 25, scale: 0.95, rotateY: -10, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.about-vision-card',
          { opacity: 0, x: 120, y: 25, scale: 0.95, rotateY: 10, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        );

      // 3B. Goals section timeline
      const goalsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-goals-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      goalsTl
        .fromTo(
          '.about-goals-header',
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.about-goal-card-0',
          { opacity: 0, x: -100, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-goal-card-1',
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-goal-card-2',
          { opacity: 0, x: 100, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // 3C. Specific Objectives section timeline
      const objectivesTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-objectives-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      objectivesTl
        .fromTo(
          '.about-objectives-header',
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.about-obj-card-left',
          { opacity: 0, x: -100, y: 25 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-obj-card-right',
          { opacity: 0, x: 100, y: 25 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // 4. Guiding values timeline
      const valuesTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-values-section',
          start: 'top 95%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      valuesTl
        .fromTo(
          '.about-values-header',
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.about-val-0',
          { opacity: 0, x: -100, y: 30, scale: 0.94, rotateY: -12, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-val-1',
          { opacity: 0, x: -35, y: 50, scale: 0.94, rotateY: -8, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-val-2',
          { opacity: 0, x: 35, y: 50, scale: 0.94, rotateY: 8, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.about-val-3',
          { opacity: 0, x: 100, y: 30, scale: 0.94, rotateY: 12, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        );

      // 5. Team section timeline
      const teamTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-team-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      teamTl
        .fromTo(
          '.about-team-header',
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 }
        )
        .fromTo(
          '.about-team-cards',
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );

      // 6. CTA section timeline
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-cta-section',
          start: 'top 95%',
          end: 'top 30%',
          scrub: 2.2,
        },
      });
      ctaTl.fromTo(
        '.about-cta-card',
        { opacity: 0, y: 70, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);
  const values = [
    {
      title: 'Community Primacy',
      desc: 'Grassroots leaders, caregivers, and teachers are the architects of their own progress. We listen before we act.',
      icon: Users,
    },
    {
      title: 'Uncompromising Safeguarding',
      desc: 'The safety, dignity, and rights of children and vulnerable beneficiaries guide every single operational decision.',
      icon: ShieldCheck,
    },
    {
      title: 'Radical Transparency',
      desc: 'We publish open, verifiable project updates and maintain clear accountability for every resource entrusted to us.',
      icon: Target,
    },
    {
      title: 'Sustainable Stewardship',
      desc: 'We construct infrastructure and design programs that local communities can independently maintain and operate.',
      icon: Compass,
    },
  ];

  return (
    <div id="about-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      {/* 1. ABOUT HERO */}
      <section className="about-hero-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 mb-16 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="about-hero-left lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                OUR IDENTITY & STORY
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Grounded in community. <br />
              Driven by <span className="text-[#69B53F] italic">dignity</span> and shared progress.
            </h1>

            <p className="text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              Revel House Uganda was established to bridge critical gaps in child care, foundational schooling, clean water, and caregiver livelihoods across rural and semi-rural districts of Uganda.
            </p>
          </div>

          <div className="about-hero-right lg:col-span-5 relative">
            {/* Blank visual composition per user directive */}
            <BlankImage
              aspectRatio="aspect-[4/3]"
              rounded="rounded-[36px]"
              tone="sage"
              src={getImage('about.hero1', '/images/imgt9.jpeg')}
              label="Community assembly field photograph"
              className="shadow-md"
            >
              <div className="p-6 text-center">
                <span className="text-xs uppercase font-semibold tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block mb-1">
                  Community-Led
                </span>
                <span className="font-editorial text-xl text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                  Revel House Uganda
                </span>
                <span className="text-[11px] text-white/85 mt-1 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Founded {settings.foundedYear} · Registered NGO Framework
                </span>
              </div>
            </BlankImage>
          </div>
        </div>
      </section>

      {/* 2. ORGANIZATION STORY & ORIGIN */}
      <section className="about-story-section py-16 md:py-24 bg-[var(--c-surface)] border-y border-[var(--c-ink)]/6 mb-16 md:mb-24">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="about-story-visual lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <BlankImage
                  aspectRatio="aspect-[3/4]"
                  rounded="rounded-[28px]"
                  tone="clay"
                  src={getImage('about.hero2', '/images/imgt10.jpeg')}
                  label="Community gathering photograph"
                />
                <BlankImage
                  aspectRatio="aspect-[3/4]"
                  rounded="rounded-[28px]"
                  tone="stone"
                  src={getImage('about.hero3', '/images/imgt11.jpeg')}
                  label="Grassroots program activity photograph"
                  className="mt-8"
                />
              </div>
            </div>

            <div className="about-story-content lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="OUR ORIGIN"
                title="From grassroots observation to structured humanitarian action."
                className="mb-4"
              />

              <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
                In many semi-rural Ugandan communities, the barriers facing a child rarely occur in isolation. A child struggling in class is often grappling with chronic waterborne sickness from unsafe drinking water, or hunger at home when erratic rains ruin a family vegetable patch.
              </p>

              <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
                Revel House Uganda began with a simple commitment: do not offer isolated single-day charity handouts. Instead, establish durable, interconnected community systems. When we construct a rainwater reservoir at a school, we simultaneously train girls in menstrual hygiene, support teachers with literacy primers, and engage mothers in savings circles.
              </p>

              <div className="p-5 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/8 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#69B53F] block">
                  Our Non-Negotiable Principle
                </span>
                <p className="text-xs sm:text-sm text-[var(--c-ink)]/80 italic">
                  &ldquo;Every project we undertake must be owned, co-designed, and maintained by the people who call the community home.&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION, VISION & APPROACH */}
      <section className="about-mission-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 mb-20 md:mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="about-mission-card bg-[var(--c-soft)]/60 rounded-[32px] p-8 sm:p-10 border border-[var(--c-ink)]/8 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold tracking-widest text-[#69B53F] block mb-3">
                MISSION STATEMENT
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-4">
                Empowering Vulnerable Children
              </h3>
              <p className="text-sm sm:text-base text-[var(--c-ink)]/80 leading-relaxed">
                {settings.mission}
              </p>
            </div>
          </div>

          <div className="about-vision-card bg-[var(--c-surface)] rounded-[32px] p-8 sm:p-10 border border-[var(--c-ink)]/8 relative overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold tracking-widest text-[#36A8A0] block mb-3">
                VISION STATEMENT
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-4">
                A World Free from Poverty
              </h3>
              <p className="text-sm sm:text-base text-[var(--c-ink)]/80 leading-relaxed">
                {settings.vision}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3B. STRATEGIC GOALS */}
      <section className="about-goals-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 mb-20 md:mb-28">
        <div className="about-goals-header mb-10">
          <SectionHeading
            eyebrow="STRATEGIC GOALS"
            title="Six overarching goals guiding our community mission."
            subtitle="Anchored in child rights, poverty alleviation, safeguarding, and sustainable community empowerment."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(settings.goals || []).map((goal, idx) => (
            <div
              key={idx}
              className={`about-goal-card-${idx % 3} bg-[var(--c-surface)] rounded-[26px] p-7 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="w-9 h-9 rounded-xl bg-[#69B53F]/10 text-[#3E7C20] font-editorial text-sm font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--c-ink)]/40">
                    Goal {idx + 1}
                  </span>
                </div>
                <p className="text-sm text-[var(--c-ink)]/85 leading-relaxed font-medium">
                  {goal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3C. SPECIFIC OBJECTIVES */}
      <section className="about-objectives-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 mb-20 md:mb-28">
        <div className="bg-[var(--c-soft)]/50 rounded-[32px] p-8 sm:p-12 border border-[var(--c-ink)]/8">
          <div className="about-objectives-header mb-8">
            <SectionHeading
              eyebrow="SPECIFIC OBJECTIVES"
              title="Targeted operational objectives on the ground."
              subtitle="Concrete, actionable pathways that translate our vision and goals into measurable community transformation."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(settings.objectives || []).map((obj, idx) => (
              <div
                key={idx}
                className={`about-obj-card-${idx % 2 === 0 ? 'left' : 'right'} bg-[var(--c-surface)] rounded-[22px] p-5 sm:p-6 border border-[var(--c-ink)]/8 flex items-start gap-4 shadow-xs`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#111111] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-[var(--c-ink)]/80 leading-relaxed font-medium">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="about-values-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 mb-20 md:mb-28">
        <div className="about-values-header">
          <SectionHeading
            eyebrow="GUIDING PRINCIPLES"
            title="The core values shaping every decision."
            subtitle="How we evaluate partnerships, deploy funds, and protect vulnerable lives."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className={`about-val-${idx} bg-[var(--c-surface)] rounded-[24px] p-7 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] mb-5 border border-[var(--c-ink)]/6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2.5">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LEADERSHIP & TEAM */}
      <section className="about-team-section py-16 md:py-24 bg-[#111111] text-[#EDEBE2] mb-16 md:mb-24">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="about-team-header">
            <SectionHeading
              eyebrow="LEADERSHIP & OPERATIONS"
              title="Stewards of the mission."
              subtitle="Our leadership team pairs deep grassroots local roots with professional compliance and safeguarding standards."
              dark={true}
            />
          </div>

          <div className="about-team-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white/5 rounded-[24px] p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  {/* Blank avatar frame per user directive */}
                  <div className="mb-4">
                    <BlankImage
                      aspectRatio="aspect-square"
                      rounded="rounded-2xl"
                      tone="stone"
                      label={`Blank portrait container for ${member.name}`}
                      className="w-20 h-20 border-white/10"
                    >
                      <span className="text-xs font-mono text-[#EDEBE2]/60">
                        RHU Team
                      </span>
                    </BlankImage>
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#69B53F] block mb-1">
                    {member.department}
                  </span>
                  <h4 className="font-editorial text-xl text-white">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[#EDEBE2]/60 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#EDEBE2]/75 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#EDEBE2]/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#69B53F]" />
                  <span>Safeguarding Certified</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-[#EDEBE2]/50 max-w-lg mx-auto">
              Note: Staff appointments and governance bios are regularly updated in our annual registration filing with the Uganda National Bureau for Non-Governmental Organisations.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENCY & CTA */}
      <section className="about-cta-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 text-center">
        <div className="about-cta-card bg-[var(--c-soft)]/50 rounded-[32px] p-8 sm:p-14 border border-[var(--c-ink)]/8 max-w-3xl mx-auto space-y-6">
          <span className="text-[11px] uppercase font-semibold tracking-widest text-[#69B53F] block">
            GET CONNECTED
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[var(--c-ink)]">
            Partner with us to create sustainable impact.
          </h2>
          <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
            Whether you represent a philanthropic foundation, a community group, or want to volunteer your professional skills, there is a place for you at Revel House Uganda.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/partner')}
              className="px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors"
            >
              Partner With Us
            </button>
            <button
              onClick={() => onNavigate('/donate')}
              className="px-7 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
            >
              Support Our Programs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
