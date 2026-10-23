import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { OrganizationSettings } from '../types';

interface PrivacyPageProps {
  settings: OrganizationSettings;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ settings }) => {
  return (
    <div id="privacy-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/70 mb-4">
            <Shield className="w-3.5 h-3.5 text-[#69B53F]" />
            <span>DATA PROTECTION POLICY</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl text-[var(--c-ink)] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs text-[var(--c-ink)]/50 font-mono">
            Effective Date: Updated for {new Date().getFullYear()} Operations
          </p>
        </div>

        <div className="bg-[var(--c-surface)] p-8 sm:p-10 rounded-[32px] border border-[var(--c-ink)]/8 shadow-xs space-y-8 text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed font-light">
          <div>
            <h2 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              1. Information We Collect
            </h2>
            <p>
              We only collect personal information that you voluntarily provide when submitting a contact inquiry, applying as a volunteer, proposing an institutional partnership, or making a donation. This includes your name, email address, phone number, and transaction references.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              2. Use of Information
            </h2>
            <p>
              Your details are used solely to communicate regarding your inquiry, send official donation receipts, or coordinate volunteer and field activities. We never rent, sell, or trade your personal information to third parties or marketing brokers.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              3. Payment Security
            </h2>
            <p>
              Financial transactions are processed through encrypted, compliant payment gateways. Revel House Uganda does not store credit card numbers, CVVs, or mobile money PINs on our servers.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              4. Beneficiary Privacy
            </h2>
            <p>
              In accordance with our Safeguarding Code, personal identifiers of vulnerable children and community members are kept strictly confidential and protected in compliance with national and international child privacy laws.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              5. Contact Us Regarding Your Data
            </h2>
            <p>
              To request correction or deletion of your contact records, please write to our privacy desk at{' '}
              <a href={`mailto:${settings.contactEmail}`} className="text-[#69B53F] underline">
                {settings.contactEmail}
              </a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};