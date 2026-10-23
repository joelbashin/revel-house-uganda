import React, { useState } from 'react';
import { Handshake, CheckCircle2, ShieldCheck, Building2, Globe, HeartHandshake, Check } from 'lucide-react';
import { submitPartnerForm } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';

export const PartnerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnerType: 'Philanthropic Foundation',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await submitPartnerForm(formData);
      setStatusMessage({ success: true, text: res.message });
      setFormData({
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        partnerType: 'Philanthropic Foundation',
        message: '',
      });
    } catch {
      setStatusMessage({
        success: false,
        text: 'Failed to record partnership inquiry. Please email leadership directly at frankhalland64@gmail.com or revelhouseuganda@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="partner-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
              INSTITUTIONAL PARTNERSHIPS
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
            Build enduring impact through verified partnership.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
            We work alongside philanthropic trusts, corporate CSR departments, non-governmental networks, and technical innovators committed to ethical, community-led development in Uganda.
          </p>
        </div>

        {/* WHY PARTNER WITH US */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[var(--c-surface)] rounded-[28px] p-8 border border-[var(--c-ink)]/8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] border border-[var(--c-ink)]/6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Strict Due Diligence & M&E
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
              We provide formal grant agreements, milestone sign-offs, line-item budget accountability, and high-resolution audit trails for every shilling disbursed.
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-[28px] p-8 border border-[var(--c-ink)]/8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] border border-[var(--c-ink)]/6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              High Grassroots Proximity
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
              We operate directly in village centers and community schools, eliminating multi-layered administrative overhead and ensuring resources reach beneficiary hands.
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-[28px] p-8 border border-[var(--c-ink)]/8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--c-bg)] flex items-center justify-center text-[#69B53F] border border-[var(--c-ink)]/6">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Community Co-Ownership
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
              Interventions are never imposed. Every school rainwater tank, literacy corner, and maternal health clinic is co-designed with Local Council authorities and school heads.
            </p>
          </div>
        </div>

        {/* HOW PARTNERSHIP WORKS & FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-t border-[var(--c-ink)]/8">
          
          <div className="lg:col-span-5 space-y-6">
            <SectionHeading
              eyebrow="ENGAGEMENT PROCESS"
              title="How We Collaborate"
              subtitle="A structured, transparent pathway from initial dialogue to project commissioning."
              className="mb-6"
            />

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-editorial text-lg text-[var(--c-ink)]">Consultation & Alignment</h4>
                  <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                    We discuss your organizational thematic focus (e.g. WASH, child literacy, maternal care) and identify aligned verified community proposals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-editorial text-lg text-[var(--c-ink)]">Project Proposal & M&E Framework</h4>
                  <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                    We deliver a comprehensive project execution plan with verified beneficiary counts, engineering schematics, and timeline commitments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-editorial text-lg text-[var(--c-ink)]">Field Execution & Reporting</h4>
                  <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                    Our team executes on the ground, filing milestone reports and facilitating site inspection visits where requested.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PARTNERSHIP ENQUIRY FORM */}
          <div className="lg:col-span-7 bg-[var(--c-surface)] rounded-[32px] p-8 sm:p-10 border border-[var(--c-ink)]/8 shadow-sm">
            <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-2">
              Partnership Enquiry Form
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 mb-6">
              Our executive director and partnerships team review institutional inquiries weekly.
            </p>

            {statusMessage ? (
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 ${
                  statusMessage.success
                    ? 'bg-[#EBF2E8] border-[#69B53F]/30 text-[#3E7C20]'
                    : 'bg-[#F9EDE8] border-[#E85B3F]/30 text-[#B03720]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--c-surface)] flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-5 h-5 text-[#69B53F]" />
                </div>
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                  {statusMessage.success ? 'Inquiry Recorded' : 'Submission Alert'}
                </h4>
                <p className="text-xs text-[var(--c-ink)]/80 max-w-md mx-auto">{statusMessage.text}</p>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="px-6 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Organization / Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Acme Foundation"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Primary Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. David Mukasa"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partnerships@org.org"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                    Partnership Category
                  </label>
                  <select
                    value={formData.partnerType}
                    onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                  >
                    <option>Philanthropic Foundation</option>
                    <option>Corporate Social Responsibility (CSR)</option>
                    <option>Bilateral / Multilateral Development Agency</option>
                    <option>Academic / Research Institution</option>
                    <option>Technical Equipment / In-Kind Supplier</option>
                    <option>Faith-Based / Community Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                    Nature of Proposed Collaboration *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your objectives, target timeline, or specific programs of interest (e.g. WASH School Infrastructure, Girls Literacy)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting Inquiry...' : 'Submit Partnership Inquiry'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};