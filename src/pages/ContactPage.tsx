import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, Check, Send, AlertCircle, MessageCircle } from 'lucide-react';
import { OrganizationSettings } from '../types';
import { submitContactForm } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';

interface ContactPageProps {
  settings: OrganizationSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Community Inquiry',
    message: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string; waLink?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please check the consent box to proceed.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // Prepare direct message for WhatsApp
    const lines = [
      `*New Inquiry - Revel House Uganda*`,
      ``,
      `*Name:* ${formData.name}`,
      `*Email:* ${formData.email}`,
      formData.phone ? `*Phone/WhatsApp:* ${formData.phone}` : null,
      `*Subject:* ${formData.subject}`,
      ``,
      `*Message:*`,
      formData.message,
    ].filter(Boolean);

    const waText = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/256742195432?text=${waText}`;

    // Open WhatsApp directly
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Ignore window.open errors
    }

    try {
      const res = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setStatusMessage({
        success: true,
        text: 'Your message has been prepared for WhatsApp and recorded with our team.',
        waLink: whatsappUrl,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Community Inquiry',
        message: '',
        consent: false,
      });
    } catch {
      setStatusMessage({
        success: true,
        text: 'Your message was opened in WhatsApp. You can also write directly to frankhalland64@gmail.com or revelhouseuganda@gmail.com',
        waLink: whatsappUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
              CONTACT & COMMUNITY LIAISON
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
            We welcome your dialogue and feedback.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
            Reach out to our field coordination desk in Uganda. For sensitive child protection disclosures, please review our dedicated safeguarding protocol.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: CONTACT DETAILS + FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: VERIFIED DETAILS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--c-surface)] rounded-[28px] p-8 border border-[var(--c-ink)]/8 shadow-xs space-y-6">
              <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
                Official Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[var(--c-ink)]/80">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#69B53F] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[var(--c-ink)] block">General Inquiries</span>
                    <a href="mailto:frankhalland64@gmail.com" className="text-[#69B53F] hover:underline">
                      frankhalland64@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#69B53F] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[var(--c-ink)] block">Official Phone Lines</span>
                    <div className="space-y-1 mt-0.5">
                      <div>
                        <a
                          href="https://wa.me/256742195432"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--c-ink)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>+256 742 195432</span>
                        </a>
                      </div>
                      <div>
                        <a
                          href="https://wa.me/256771495075"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--c-ink)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>+256771495075</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-[var(--c-ink)]/8">
                  <ShieldCheck className="w-4 h-4 text-[#E85B3F] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[var(--c-ink)] block">Safeguarding Officer Desk</span>
                    <a href="mailto:revelhouseuganda@gmail.com" className="text-[#E85B3F] hover:underline">
                      revelhouseuganda@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/6 text-[11px] text-[var(--c-ink)]/60 leading-relaxed">
                Notice: All official communications are retained securely in accordance with our organizational privacy and data protection policies.
              </div>
            </div>

            {/* SAFEGUARDING CALLOUT */}
            <div className="bg-[#111111] text-white p-7 rounded-[24px] space-y-3">
              <span className="text-[10px] uppercase font-semibold text-[#69B53F] tracking-wider block">
                Urgent Child Protection Notice
              </span>
              <h4 className="font-editorial text-lg text-white">
                Child Safety Reporting
              </h4>
              <p className="text-xs text-[#EDEBE2]/70 leading-relaxed">
                If you suspect immediate child abuse, exploitation, or safeguarding violations, access our confidential reporting channel directly.
              </p>
              <button
                onClick={() => onNavigate('/safeguarding')}
                className="text-xs text-[#69B53F] font-semibold hover:underline hover:text-white transition-colors"
              >
                Go to Safeguarding Protocol →
              </button>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7 bg-[var(--c-surface)] rounded-[32px] p-8 sm:p-10 border border-[var(--c-ink)]/8 shadow-sm">
            <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 mb-6">
              Our community liaison officer typically reviews messages within 24–48 business hours. Messages can also be delivered directly to WhatsApp.
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
                  {statusMessage.success ? 'Message Delivered' : 'Notice'}
                </h4>
                <p className="text-xs text-[var(--c-ink)]/80 max-w-md mx-auto">{statusMessage.text}</p>
                {statusMessage.waLink && (
                  <div>
                    <a
                      href={statusMessage.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                )}
                <div>
                  <button
                    onClick={() => setStatusMessage(null)}
                    className="px-6 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold mt-2"
                  >
                    Write Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Kintu"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+256..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                    >
                      <option>General Community Inquiry</option>
                      <option>WASH & School Project Inquiry</option>
                      <option>Donation & Financial Inquiry</option>
                      <option>Volunteer Opportunities</option>
                      <option>Media & Research Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--c-ink)] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please share your questions or notes..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent-check"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-[var(--c-ink)]/20 text-[#69B53F] focus:ring-[#69B53F]"
                  />
                  <label htmlFor="consent-check" className="text-xs text-[var(--c-ink)]/70 leading-relaxed cursor-pointer">
                    I consent to Revel House Uganda holding this contact information for the sole purpose of replying to my inquiry in accordance with privacy laws.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#25D366] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>{isSubmitting ? 'Transmitting to WhatsApp...' : 'Send Direct Message to WhatsApp'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};