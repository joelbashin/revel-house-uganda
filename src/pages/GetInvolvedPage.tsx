import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Users, Handshake, Megaphone, Share2, Check, ArrowRight, X } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { submitVolunteerForm } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface GetInvolvedPageProps {
  onNavigate: (path: string) => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onNavigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    areaOfInterest: 'Education & Child Mentoring',
    availability: 'Part-time (Weekends)',
    skills: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const options = [
    {
      title: 'Volunteer in the Field or Remotely',
      desc: 'Lend your professional expertise in teacher mentoring, technical engineering for water projects, digital literacy, or curriculum design.',
      actionText: 'Apply to Volunteer',
      action: () => setVolunteerModalOpen(true),
      icon: Users,
    },
    {
      title: 'Institutional Partnerships',
      desc: 'Collaborate with us as an institutional foundation, bilateral agency, corporate social partner, or faith-based charity.',
      actionText: 'Explore Partnerships',
      action: () => onNavigate('/partner'),
      icon: Handshake,
    },
    {
      title: 'Direct Program Support',
      desc: 'Fuel our core programs through tax-deductible contributions, child education sponsorship, or designated water infrastructure funding.',
      actionText: 'Support Revel House',
      action: () => onNavigate('/donate'),
      icon: Heart,
    },
    {
      title: 'Community Advocacy',
      desc: 'Amplify the voices of rural Ugandan children and caregivers by sharing verified stories, organizing community talks, and advocating for child safeguarding.',
      actionText: 'View Advocacy Resources',
      action: () => onNavigate('/news'),
      icon: Megaphone,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero timeline
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.get-involved-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl.fromTo(
        '.get-involved-hero-text',
        { opacity: 0, x: -140, y: 15 },
        { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
      );

      // 2. Cards grid timeline
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#get-involved-cards-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      cardsTl
        .fromTo(
          '.get-involved-card-left',
          { opacity: 0, x: -140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.get-involved-card-right',
          { opacity: 0, x: 140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitVolunteerForm(formData);
      setSubmittedMessage(res.message);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        areaOfInterest: 'Education & Child Mentoring',
        availability: 'Part-time (Weekends)',
        skills: '',
      });
    } catch {
      setSubmittedMessage('Unable to submit at this moment. Please email frankhalland64@gmail.com or revelhouseuganda@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="get-involved-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="get-involved-hero-section max-w-3xl mb-16">
          <div className="get-involved-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                JOIN THE MISSION
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              There are many ways to stand with Ugandan communities.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              Whether through personal skills, institutional grants, monthly giving, or vocal advocacy, your involvement directly strengthens vulnerable children and families.
            </p>
          </div>
        </div>

        {/* 4 CARDS GRID */}
        <div id="get-involved-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {options.map((opt, idx) => {
            const Icon = opt.icon;
            const sideClass = idx % 2 === 0 ? 'get-involved-card-left' : 'get-involved-card-right';
            return (
              <div
                key={idx}
                className={`${sideClass} bg-[var(--c-surface)] rounded-[28px] p-8 sm:p-10 border border-[var(--c-ink)]/8 shadow-xs hover:border-[#69B53F]/40 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] mb-6 border border-[var(--c-ink)]/6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-3">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-[var(--c-ink)]/75 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--c-ink)]/8">
                  <button
                    onClick={opt.action}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-all duration-300"
                  >
                    <span>{opt.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* VOLUNTEER MODAL */}
        {volunteerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--c-bg)] rounded-[32px] max-w-xl w-full p-6 sm:p-8 border border-[var(--c-ink)]/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => { setVolunteerModalOpen(false); setSubmittedMessage(null); }}
                className="absolute top-6 right-6 p-2 rounded-full text-[var(--c-ink)]/60 hover:text-[var(--c-ink)] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] uppercase font-semibold text-[#69B53F] block tracking-wider mb-1">
                  Volunteer Application
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)]">
                  Join Our Volunteer Network
                </h3>
                <p className="text-xs text-[var(--c-ink)]/70 mt-1">
                  We welcome both local Ugandan community champions and remote technical supporters.
                </p>
              </div>

              {submittedMessage ? (
                <div className="p-6 bg-[var(--c-surface)] rounded-2xl border border-[#69B53F]/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-editorial text-xl text-[var(--c-ink)]">Application Received</h4>
                  <p className="text-xs text-[var(--c-ink)]/75 leading-relaxed">{submittedMessage}</p>
                  <button
                    onClick={() => { setVolunteerModalOpen(false); setSubmittedMessage(null); }}
                    className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Namubiru"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+256..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Your Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Kampala, Mukono, or International"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Area of Interest</label>
                      <select
                        value={formData.areaOfInterest}
                        onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                      >
                        <option>Education & Child Mentoring</option>
                        <option>WASH & Water Engineering</option>
                        <option>Health & Medical Outreach</option>
                        <option>Community Livelihoods & VSLA</option>
                        <option>Communications & Storytelling</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Availability</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    >
                      <option>Part-time (Weekends)</option>
                      <option>Full-time / Field placement</option>
                      <option>Occasional / Project-based</option>
                      <option>Remote digital support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">Skills & Experience Overview</label>
                    <textarea
                      rows={3}
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="Briefly describe your background, training, or what inspires you to join Revel House Uganda..."
                      className="w-full px-4 py-2 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/15 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <p className="text-[11px] text-[var(--c-ink)]/60">
                    By submitting, you agree to comply with our zero-tolerance Child Safeguarding Code of Conduct.
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
