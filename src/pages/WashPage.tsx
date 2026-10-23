import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  Droplets,
  HardHat,
  Brush,
  GraduationCap,
  Trophy,
  Palette,
  Megaphone,
  Heart,
  Users,
  Sparkles,
  Wrench,
  Camera,
  Lightbulb,
  Handshake,
  ArrowRight,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  MousePointerClick,
} from 'lucide-react';
import { useMedia } from '../context/MediaContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface WashPageProps {
  onNavigate: (path: string) => void;
}

export const WashPage: React.FC<WashPageProps> = ({ onNavigate }) => {
  const { getImage } = useMedia();
  const pageRef = useRef<HTMLDivElement>(null);

  // Interactive toilet hole reveal state
  const [revealedHoles, setRevealedHoles] = useState<Record<string, boolean>>({});

  const toggleHole = (key: string) => {
    setRevealedHoles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance: staggered organic rise
      const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroIntro
        .from('.wash-hero-eyebrow', { opacity: 0, y: -30, duration: 1 })
        .from('.wash-hero-title .line-reveal', {
          opacity: 0,
          yPercent: 110,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
        }, 0.15)
        .from('.wash-hero-sub', { opacity: 0, y: 25, duration: 1 }, 0.9)
        .from('.wash-hero-cta', { opacity: 0, y: 25, scale: 0.95, duration: 0.9, stagger: 0.15 }, 1.1)
        .from('.wash-hero-float', { opacity: 0, scale: 0.85, y: 40, duration: 1.4, ease: 'back.out(1.4)' }, 0.4);

      // 2. Continuous ambient floating of decorative blobs
      gsap.to('.wash-float-blob-1', {
        y: -30,
        x: 18,
        rotation: 8,
        scale: 1.06,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.wash-float-blob-2', {
        y: 24,
        x: -14,
        rotation: -7,
        scale: 1.04,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });

      // 3. Hero badge bounce loop
      gsap.to('.wash-hero-badge', {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 4. Scroll-linked parallax scrub for hero composition
      ScrollTrigger.create({
        trigger: '.wash-hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 2.2,
        animation: gsap.timeline()
          .to('.wash-hero-image-stack', { yPercent: 18, scale: 1.05, ease: 'none' }, 0)
          .to('.wash-hero-title', { yPercent: -12, ease: 'none' }, 0),
      });

      // 5. Mission section timeline (scrub)
      const buildTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.wash-build-section',
          start: 'top 90%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      buildTl
        .fromTo('.wash-build-left', { opacity: 0, x: -140, y: 20, rotateY: -8, transformOrigin: 'left center' }, { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 })
        .fromTo('.wash-build-right', { opacity: 0, x: 140, scale: 0.94, rotateY: 8, transformOrigin: 'right center' }, { opacity: 1, x: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 }, 0);

      // 6. Collaborators reveal
      const collabTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-collab-section', start: 'top 90%', end: 'top 25%', scrub: 2.2 },
      });
      collabTl
        .fromTo('.wash-collab-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 })
        .fromTo('.wash-collab-chip', { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, ease: 'back.out(1.5)', stagger: 0.08, duration: 0.5 }, 0.15);

      // 7. Fun section: cards stagger in
      const funTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-fun-section', start: 'top 92%', end: 'top 25%', scrub: 2.2 },
      });
      funTl
        .fromTo('.wash-fun-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 })
        .fromTo('.wash-fun-card', { opacity: 0, y: 70, scale: 0.92, rotateY: -6, transformOrigin: 'top center' }, { opacity: 1, y: 0, scale: 1, rotateY: 0, ease: 'power2.out', stagger: 0.15, duration: 0.9 }, 0.2);

      // 8. Volunteer section
      const volTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-volunteer-section', start: 'top 92%', end: 'top 25%', scrub: 2.2 },
      });
      volTl
        .fromTo('.wash-volunteer-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 })
        .fromTo('.wash-volunteer-card', { opacity: 0, y: 50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', stagger: 0.12, duration: 0.8 }, 0.2);

      // 9. Vision section: bold reveal
      const visionTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-vision-section', start: 'top 92%', end: 'top 25%', scrub: 2.2 },
      });
      visionTl
        .fromTo('.wash-vision-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 })
        .fromTo('.wash-vision-chip', { opacity: 0, scale: 0.75, y: 25, rotateY: 40 }, { opacity: 1, scale: 1, y: 0, rotateY: 0, ease: 'power2.out', stagger: 0.1, duration: 0.7 }, 0.2)
        .fromTo('.wash-vision-big', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 }, 0.5);

      // 10. Do holes section
      const holesTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-holes-section', start: 'top 92%', end: 'top 25%', scrub: 2.2 },
      });
      holesTl
        .fromTo('.wash-holes-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 })
        .fromTo('.wash-hole-card', { opacity: 0, y: 70, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', stagger: 0.2, duration: 1 }, 0.2);

      // 11. CTA section
      const ctaTl = gsap.timeline({
        scrollTrigger: { trigger: '.wash-cta-section', start: 'top 92%', end: 'top 30%', scrub: 2.2 },
      });
      ctaTl.fromTo('.wash-cta-card', { opacity: 0, y: 70, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 });

      // 12. Continuous gentle water-droplet pulse on icons
      gsap.utils.toArray<Element>('.wash-drop-pulse').forEach((el) => {
        gsap.to(el, {
          scale: 1.12,
          opacity: 0.75,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 1.5,
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  // Collaborator chips
  const collaborators = [
    { icon: HardHat, label: 'Volunteers' },
    { icon: Wrench, label: 'Builders' },
    { icon: Brush, label: 'Artists' },
    { icon: GraduationCap, label: 'Students' },
    { icon: Users, label: 'Schools' },
    { icon: Handshake, label: 'Community Members' },
    { icon: GlobeIcon, label: 'Partner Organisations' },
    { icon: Droplets, label: 'WASH Professionals' },
  ];

  // Fun activity cards
  const funActivities = [
    {
      icon: Droplets,
      color: 'text-[#36A8A0]',
      bg: 'bg-[#36A8A0]/10',
      title: 'Soap Making in Schools',
      desc: 'Interactive liquid soap-making sessions in local schools. Children learn practical hygiene skills while participating in a hands-on activity they can enjoy and remember.',
      img: getImage('wash.fun.soap', '/images/wash1.jpeg'),
    },
    {
      icon: Trophy,
      color: 'text-[#F5A623]',
      bg: 'bg-[#F5A623]/12',
      title: 'WASH Challenges & Prizes',
      desc: 'Competitions where students win prizes for best hygiene ideas, sanitation innovations, outstanding participation, creative designs, and community impact.',
      img: getImage('wash.fun.challenges', '/images/wash2.jpeg'),
    },
    {
      icon: Palette,
      color: 'text-[#E85B3F]',
      bg: 'bg-[#E85B3F]/10',
      title: 'Toilet Art & Design',
      desc: 'Artists and young people paint and design sanitation facilities with educational messages, hygiene awareness, creative artwork, and positive community messages.',
      img: getImage('wash.fun.toiletArt', '/images/wash3.jpeg'),
    },
    {
      icon: Megaphone,
      color: 'text-[#69B53F]',
      bg: 'bg-[#69B53F]/10',
      title: 'Community Sensitisation',
      desc: 'Fun and engaging awareness activities around proper sanitation, handwashing, personal hygiene, toilet maintenance, disease prevention, and safe waste management.',
      img: getImage('wash.fun.community', '/images/wash5.jpeg'),
    },
  ];

  // Volunteer call items
  const volunteerCalls = [
    { icon: HardHat, label: 'Help Construct' },
    { icon: Palette, label: 'Paint & Design' },
    { icon: Droplets, label: 'Teach Soap Making' },
    { icon: Megaphone, label: 'Participate in Sensitisation' },
    { icon: Camera, label: 'Document Activities' },
    { icon: GraduationCap, label: 'Work With Schools' },
    { icon: Lightbulb, label: 'Share Innovative Ideas' },
    { icon: Handshake, label: 'Mobilise Communities' },
  ];

  // Vision chips
  const visionChips = [
    { label: 'Health', icon: Heart, color: '#E85B3F' },
    { label: 'Dignity', icon: Sparkles, color: '#F5A623' },
    { label: 'Innovation', icon: Lightbulb, color: '#36A8A0' },
    { label: 'Creativity', icon: Palette, color: '#69B53F' },
    { label: 'Community', icon: Users, color: '#3E7C20' },
  ];

  // Interactive toilet hole cards (click to reveal filter)
  const holeCards = [
    {
      id: 'hole-a',
      img: getImage('wash.hole.filtration', '/images/wash4.jpeg'),
      title: 'Built-In Filtration System',
      desc: 'Sanitation filter clearly visible behind the drop hole. Click the cover to reveal the filtration mechanism.',
      hint: 'Click to reveal the filter',
      startRevealed: false,
    },
    {
      id: 'hole-b',
      img: getImage('wash.hole.cover', '/images/wash5.jpeg'),
      title: 'Secure Drop Hole Cover',
      desc: 'A protective cover seals the drop hole. Press the corner to lift the cover and see the safe disposal channel beneath.',
      hint: 'Press to lift the cover',
      startRevealed: false,
    },
  ];

  return (
    <div id="wash-page" ref={pageRef} className="relative pt-24 pb-20 md:pt-28 md:pb-28 overflow-hidden">
      {/* Logo watermark in top corner */}
      <div className="absolute top-24 md:top-28 right-6 md:right-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden opacity-25 rotate-6 shadow-lg pointer-events-none select-none">
        <img
          src={getImage('header.logo', '/images/logo.jpeg')}
          alt="Revel House Uganda logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ============ 1. HERO ============ */}
      <section className="wash-hero-section relative max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 min-h-[82vh] flex flex-col justify-center py-16">
        {/* Fluid golden-hour wave layer */}
        <div className="wave-layer z-0" aria-hidden="true" />
        {/* Floating decorative blobs */}
        <div className="absolute -top-10 -right-16 md:right-0 pointer-events-none opacity-50 wash-float-blob-1 z-0" aria-hidden="true">
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#36A8A0]/15 blur-3xl" />
        </div>
        <div className="absolute bottom-0 -left-20 pointer-events-none opacity-40 wash-float-blob-2 z-0" aria-hidden="true">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-[#69B53F]/15 blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* LEFT: Headline content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="wash-hero-eyebrow inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/10 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#69B53F] animate-pulse-gently" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--c-ink)]">
                A Revel House Uganda Flagship Initiative
              </span>
            </div>

            <h1 className="wash-hero-title font-editorial text-5xl sm:text-6xl md:text-7xl text-[var(--c-ink)] tracking-tight leading-[1.02] overflow-hidden">
              <span className="line-reveal block text-[#69B53F]">THE WASH</span>
              <span className="line-reveal block">PROJECT&nbsp;
                <span className="text-[#36A8A0] text-4xl sm:text-5xl md:text-6xl align-middle">💧</span>
              </span>
              <span className="line-reveal block font-sans text-sm sm:text-base font-semibold tracking-[0.25em] uppercase text-[var(--c-ink)]/60 mt-2">
                Building Better Toilets · Creating Healthier Communities
              </span>
            </h1>

            <p className="wash-hero-sub text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed max-w-xl font-light">
              Revel House Uganda does many things — from supporting vulnerable children and feeding people in need to medical outreaches, youth sensitisation, and community support. But the WASH Project is different. This is one of our biggest and most ambitious projects yet.
            </p>

            <p className="wash-hero-sub text-base sm:text-lg text-[var(--c-ink)]/85 leading-relaxed max-w-xl font-medium">
              At the heart of the project is one major mission:&nbsp;
              <span className="font-editorial text-[#3E7C20]">Build better toilets. Change lives.</span>
            </p>

            {/* CTA buttons */}
            <div className="wash-hero-cta pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => gsap.to(window, { duration: 1.1, scrollTo: '.wash-holes-section', ease: 'power2.inOut' })}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-all duration-300 transform active:scale-95 shadow-md"
              >
                <MousePointerClick className="w-4 h-4" />
                <span>Explore the Interactive Toilet</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => gsap.to(window, { duration: 1.1, scrollTo: '.wash-build-section', ease: 'power2.inOut' })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--c-surface)] text-[var(--c-ink)] text-xs font-semibold uppercase tracking-wider border border-[var(--c-ink)]/15 hover:bg-[var(--c-soft)] transition-colors shadow-sm"
              >
                <HardHat className="w-4 h-4" />
                <span>Our Main Focus</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Hero image composition */}
          <div className="lg:col-span-5 relative wash-hero-image-stack">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="wash-hero-float rounded-[32px] overflow-hidden shadow-md border border-[var(--c-ink)]/8">
                  <img src={getImage('wash.main', '/images/wash1.jpeg')} alt="WASH soap making session" className="w-full aspect-[3/4] object-cover" />
                </div>
                <div className="wash-hero-float rounded-[28px] overflow-hidden shadow-sm border border-[var(--c-ink)]/8">
                  <img src={getImage('wash.secondary', '/images/wash3.jpeg')} alt="Toilet art and design" className="w-full aspect-square object-cover" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 mt-8">
                <div className="wash-hero-float rounded-[30px] overflow-hidden shadow-sm border border-[var(--c-ink)]/8">
                  <img src={getImage('wash.tertiary', '/images/wash4.jpeg')} alt="WASH toilet hole filtration" className="w-full aspect-square object-cover" />
                </div>
                <div className="wash-hero-float rounded-[32px] overflow-hidden shadow-md border border-[var(--c-ink)]/8">
                  <img src={getImage('wash.quaternary', '/images/wash2.jpeg')} alt="WASH challenges and prizes" className="w-full aspect-[3/4] object-cover" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="wash-hero-badge absolute -bottom-4 -left-3 sm:left-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-[#69B53F]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] wash-drop-pulse">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--c-ink)] leading-none">WASH Project</p>
                <p className="text-[9px] text-[var(--c-ink)]/60 mt-1">Uganda · Flagship Movement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. THE CHALLENGE / WHY IT MATTERS ============ */}
      <section className="py-16 md:py-20 bg-[var(--c-surface)] border-y border-[var(--c-ink)]/6">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8">
                <span className="w-2 h-2 rounded-full bg-[#E85B3F]" />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">THE PROBLEM WE CHANGE</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.08]">
                Across many communities in Uganda, poor sanitation affects {''}
                <span className="text-[#E85B3F] italic">health, dignity, education,</span> and everyday life.
              </h2>
            </div>
            <div className="space-y-5">
              <div className="p-6 rounded-[24px] bg-[#FFF1ED]/60 border border-[#E85B3F]/15 space-y-3">
                <p className="text-sm text-[var(--c-ink)]/80 leading-relaxed">
                  Poorly constructed toilets can create serious hygiene challenges and leave communities without safe and dignified sanitation.
                </p>
              </div>
              <div className="p-6 rounded-[24px] bg-[var(--c-surface)] border border-[var(--c-ink)]/8 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E85B3F]">
                  <Sparkles className="w-4 h-4" />
                  <span>For many girls</span>
                </div>
                <p className="text-sm text-[var(--c-ink)]/75 leading-relaxed">
                  Inadequate sanitation facilities can make it harder to manage their normal biological processes comfortably and privately, particularly in schools.
                </p>
              </div>
              <p className="text-sm sm:text-base text-[var(--c-ink)]/85 leading-relaxed font-medium">
                The WASH Project wants to change that. But we don't just want to talk about the problem — we want people to get involved and physically become part of the solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. MAIN FOCUS: TOILET CONSTRUCTION ============ */}
      <section className="wash-build-section py-16 md:py-24 max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="wash-build-left lg:col-span-6">
            <div className="space-y-6">
              <SectionHeadingInline
                eyebrow="OUR MAIN FOCUS"
                title="Toilet Construction & Improvement"
                subtitle="The central mission of the WASH Project is to support the construction and improvement of safe, durable, hygienic, and dignified toilets."
              />
              <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
                The idea is simple: instead of only asking people to donate, we invite them to show up, get their hands involved, and build something that will serve communities for years.
              </p>

              {/* Collaborators */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-4">
                  We want to bring together
                </h4>
                <div className="wash-collab-section grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {collaborators.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="wash-collab-chip flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 hover:-translate-y-0.5 transition-all duration-300">
                        <span className="w-7 h-7 rounded-lg bg-[#69B53F]/10 flex items-center justify-center text-[#3E7C20] shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--c-ink)]/80 leading-tight">{c.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="wash-build-right lg:col-span-6">
            <div className="relative">
              <div className="rounded-[36px] overflow-hidden shadow-md border border-[var(--c-ink)]/8">
                <img src={getImage('wash.build', '/images/wash5.jpeg')} alt="WASH toilet construction and drop hole" className="w-full aspect-[4/3] object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:left-4 bg-[var(--c-surface)] px-4 py-3 rounded-2xl shadow-lg border border-[var(--c-ink)]/8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] wash-drop-pulse">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[var(--c-ink)] leading-none">Hands-On Construction</p>
                  <p className="text-[9px] text-[var(--c-ink)]/60 mt-1">Durable · Hygienic · Dignified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. MAKING SANITATION FUN ============ */}
      <section className="wash-fun-section py-16 md:py-24 bg-[var(--c-surface)] border-y border-[var(--c-ink)]/6">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="wash-fun-header mb-12">
            <SectionHeadingInline
              eyebrow="MAKING SANITATION FUN"
              title="Sanitation projects are often treated as boring. We want to change that."
              subtitle="The WASH Project combines impact with creativity, competition, teamwork, learning, and fun."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="wash-fun-card tilt-3d bg-[var(--c-bg)] rounded-[28px] overflow-hidden border border-[var(--c-ink)]/6 hover:border-[#69B53F]/40 hover:shadow-lg transition-all duration-500 group">
                  <div className="overflow-hidden">
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className={`w-12 h-12 rounded-2xl ${act.bg} ${act.color} flex items-center justify-center mb-5 wash-drop-pulse`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-3">{act.title}</h3>
                    <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 5. INTERACTIVE TOILET HOLE REVEAL ============ */}
      <section className="wash-holes-section py-16 md:py-24 bg-[#111111] text-white relative overflow-hidden">
        {/* Ambient particle field for golden-hour atmosphere */}
        <div className="particle-field z-0" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{ left: `${(i * 7.2) % 100}%`, top: `${(i * 13.7) % 100}%`, animationDelay: `${(i * 0.7) % 5}s` }}
            />
          ))}
        </div>
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <div className="wash-holes-header mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#69B53F]">Interactive Demo</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1] mt-5">
              Take a peek inside the toilet hole.
            </h2>
            <p className="text-sm sm:text-base text-[#EDEBE2]/70 leading-relaxed mt-4">
              These are real drop-hole designs with built-in filtration. The cover is locked — press where indicated to reveal what's beneath. Just as in our toilets, some details are only visible when you look closely.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#69B53F] font-semibold">
              <MousePointerClick className="w-4 h-4" />
              <span>Click / tap to reveal each hidden filter</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {holeCards.map((hole, idx) => {
              const isRevealed = revealedHoles[hole.id];
              return (
                <div key={hole.id} className="wash-hole-card group">
                  <div
                    className="relative rounded-[32px] overflow-hidden bg-[#151515] cursor-pointer select-none"
                    onClick={() => toggleHole(hole.id)}
                  >
                    {/* Image that is dimmed but peeking when hidden */}
                    <div className={`relative transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 blur-0' : 'opacity-40 blur-[2px] scale-105'}`}>
                      <img
                        src={hole.img}
                        alt={`${hole.title} - hidden until revealed`}
                        className="w-full aspect-[3/2] object-cover"
                      />
                      {/* Hidden state overlay */}
                      {!isRevealed && (
                        <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                            <EyeOff className="w-7 h-7 text-white/80" />
                          </div>
                          <p className="font-editorial text-xl text-white mb-2">{hole.title}</p>
                          <p className="text-xs text-white/70 leading-relaxed max-w-xs">{hole.hint}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#69B53F] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg animate-pulse-gently">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            Press to Reveal
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Revealed state content */}
                    {isRevealed && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-6">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#69B53F] mb-2">
                            <Eye className="w-3.5 h-3.5" />
                            Revealed · Filter Visible
                          </span>
                          <p className="font-editorial text-2xl text-white mb-1">{hole.title}</p>
                          <p className="text-xs text-white/80 leading-relaxed max-w-md">{hole.desc}</p>
                        </div>
                      </div>
                    )}

                    {/* Revealed overlaid badge */}
                    {isRevealed && (
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#69B53F]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Status row */}
                  <div className="mt-4 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Droplets className="w-3.5 h-3.5 text-[#36A8A0]" />
                      <span className="text-white">Hole Unit {String.fromCharCode(65 + idx)}</span>
                    </div>
                    <button
                      onClick={() => toggleHole(hole.id)}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${isRevealed ? 'text-white/60 hover:text-white' : 'text-[#69B53F] hover:text-[#85d95c]'}`}
                    >
                      {isRevealed ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Reveal</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-[#EDEBE2]/50 max-w-lg mx-auto">
              Just like our real toilets, some of the most important details are hidden away — safe, hygienic, and protective. Click, explore, and see the difference built-in filtration makes.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 6. VOLUNTEERS AT THE HEART ============ */}
      <section className="wash-volunteer-section py-16 md:py-24 max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="wash-volunteer-header mb-12">
          <SectionHeadingInline
            eyebrow="VOLUNTEERS ARE AT THE HEART OF THIS PROJECT"
            title="We want hands-on participation."
            subtitle="The WASH Project is not designed to be a project where people only watch from the sidelines. Join us with your time, skills, creativity, knowledge, and physical participation."
          />
        </div>

        <div className="bg-[var(--c-soft)]/50 rounded-[32px] p-6 sm:p-10 border border-[var(--c-ink)]/8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-6">
            We are looking for people willing to
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {volunteerCalls.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="wash-volunteer-card bg-[var(--c-surface)] rounded-2xl p-4 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#69B53F]/10 flex items-center justify-center text-[#3E7C20] shrink-0 wash-drop-pulse">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--c-ink)]/85 leading-tight">{v.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-[var(--c-surface)] border border-[#69B53F]/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm text-[var(--c-ink)]/85 leading-relaxed font-medium">
                Donations are welcome and important. But time, skills, creativity, knowledge, and physical participation are equally valuable.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/get-involved')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors"
            >
              <Handshake className="w-4 h-4" />
              <span>Volunteer For WASH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/donate')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate & Support</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============ 7. THE BIGGER VISION ============ */}
      <section className="wash-vision-section py-16 md:py-24 bg-[#111111] text-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="wash-vision-header mb-12">
            <SectionHeadingInline
              eyebrow="THE BIGGER VISION"
              title="We don't just want to build toilets. We want to build a movement."
              subtitle="The WASH Project begins with sanitation, but the vision is much bigger — to create a culture where communities see sanitation differently."
              dark
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {visionChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <div key={idx} className="wash-vision-chip inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 transition-colors">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ color: chip.color }}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-white">{chip.label}</span>
                </div>
              );
            })}
          </div>

          <div className="wash-vision-big text-center">
            <p className="font-editorial text-2xl sm:text-3xl md:text-4xl text-white leading-snug max-w-3xl mx-auto mb-4">
              Not an embarrassing subject. Not a boring development topic.
              <br />
              But something connected to <span className="text-[#69B53F] italic">health, dignity, innovation, creativity,</span> and <span className="text-[#36A8A0] italic">community.</span>
            </p>
            <p className="text-sm sm:text-base text-[#EDEBE2]/70 leading-relaxed max-w-2xl mx-auto mb-10">
              The long-term goal is to develop the WASH Project into a major flagship movement that can grow beyond Uganda and eventually reach communities across Africa.
            </p>

            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#69B53F]/10 border border-[#69B53F]/25">
              <Droplets className="w-6 h-6 text-[#69B53F]" />
              <span className="font-editorial text-xl md:text-2xl text-white">
                Clean Spaces. Healthy Communities. Dignified Lives.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 8. CTA ============ */}
      <section className="wash-cta-section max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-24">
        <div className="wash-cta-card tilt-3d bg-[var(--c-soft)]/50 rounded-[36px] p-8 sm:p-16 text-center space-y-6 max-w-4xl mx-auto border border-[var(--c-ink)]/8 relative overflow-hidden flow-line">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -left-16 pointer-events-none opacity-30 wash-float-blob-1" aria-hidden="true">
            <div className="w-64 h-64 rounded-full bg-[#36A8A0]/20 blur-3xl" />
          </div>
          <div className="absolute -bottom-16 -right-16 pointer-events-none opacity-30 wash-float-blob-2" aria-hidden="true">
            <div className="w-64 h-64 rounded-full bg-[#69B53F]/20 blur-3xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/10 relative">
            <span className="w-2 h-2 rounded-full bg-[#69B53F] animate-pulse-gently" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--c-ink)]">WASH PROJECT</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.1] relative">
            Become part of the solution.
          </h2>

          <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed max-w-xl mx-auto relative">
            A flagship initiative by Revel House Uganda. Join us to build safer, dignified sanitation that serves communities for years to come.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative">
            <button
              onClick={() => onNavigate('/get-involved')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-all duration-300 transform active:scale-95 shadow-md"
            >
              <Users className="w-4 h-4" />
              <span>Volunteer Your Skills</span>
            </button>
            <button
              onClick={() => onNavigate('/donate')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-all duration-300 transform active:scale-95 shadow-md"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Support WASH</span>
            </button>
          </div>

          <p className="text-[10px] text-[var(--c-ink)]/50 uppercase tracking-wider font-semibold mt-4 relative">
            A flagship initiative by Revel House Uganda
          </p>
        </div>
      </section>
    </div>
  );
};

// Local lightweight section heading to match existing design
const SectionHeadingInline: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}> = ({ eyebrow, title, subtitle, align = 'left', dark = false, className = '' }) => {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-3.5 ${isCenter ? 'justify-center' : ''}`}>
          <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
          <span className={`text-[11px] font-semibold tracking-widest uppercase ${dark ? 'text-[#69B53F]' : 'text-[#69B53F]'}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className={`font-editorial text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] ${dark ? 'text-white' : 'text-[var(--c-ink)]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? 'text-[#EDEBE2]/75' : 'text-[var(--c-ink)]/70'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
