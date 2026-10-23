import React from 'react';
import { ShieldCheck, AlertTriangle, Eye, Lock, FileCheck, Mail } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { OrganizationSettings } from '../types';

interface SafeguardingPageProps {
  settings: OrganizationSettings;
  onNavigate: (path: string) => void;
}

export const SafeguardingPage: React.FC<SafeguardingPageProps> = ({ settings, onNavigate }) => {
  return (
    <div id="safeguarding-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[960px] mx-auto px-5 sm:px-8">
        
        {/* HERO */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF2E8] text-[#3E7C20] border border-[#69B53F]/20 mb-4 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>ORGANIZATIONAL SAFEGUARDING CODE</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.06]">
            Our Commitment to Child Protection & Beneficiary Dignity.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
            Revel House Uganda maintains an absolute, non-negotiable zero-tolerance policy against sexual exploitation, abuse, child neglect, harassment, and unauthorized publication of sensitive beneficiary details.
          </p>
        </div>

        {/* POLICY SECTIONS */}
        <div className="space-y-10 text-sm sm:text-base text-[var(--c-ink)]/80 leading-relaxed font-light">
          
          <div className="bg-[var(--c-surface)] p-8 rounded-[28px] border border-[var(--c-ink)]/8 shadow-xs space-y-4">
            <h2 className="font-editorial text-2xl text-[var(--c-ink)]">
              1. Child Rights & Zero Tolerance
            </h2>
            <p>
              Every child, adolescent, and vulnerable adult who participates in Revel House Uganda activities has the fundamental right to be protected from harm, emotional distress, physical violence, and sexual abuse. All staff members, contractors, volunteers, and international visitors must sign and strictly adhere to our Child Safeguarding Code of Conduct prior to field engagement.
            </p>
            <p>
              Failure to uphold these guidelines results in immediate termination of association and mandatory formal referral to the Uganda Police Family and Child Protection Unit (FCPU).
            </p>
          </div>

          <div className="bg-[var(--c-surface)] p-8 rounded-[28px] border border-[var(--c-ink)]/8 shadow-xs space-y-4">
            <h2 className="font-editorial text-2xl text-[var(--c-ink)]">
              2. Photography, Media & Dignity Protocols
            </h2>
            <p>
              We treat community members with profound dignity. In accordance with humanitarian communications standards:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2 text-sm text-[var(--c-ink)]/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] mt-2 shrink-0" />
                <span>We never publish full legal names, physical residential coordinates, or medical diagnostic details of children.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--c-ink)]/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] mt-2 shrink-0" />
                <span>Written and verbal consent is obtained from legal guardians and school authorities before any photography or case studies are recorded.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--c-ink)]/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] mt-2 shrink-0" />
                <span>We strictly prohibit staging, coercive photography, or portraying children in states of humiliation or despair.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#111111] text-white p-8 sm:p-10 rounded-[32px] space-y-6">
            <div className="flex items-center gap-2 text-[#E85B3F]">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold tracking-wider">
                Confidential Reporting Channel
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-white">
              Reporting a Concern or Incident
            </h2>

            <p className="text-sm text-[#EDEBE2]/80 leading-relaxed">
              If you observe, suspect, or are informed of any behavior that violates child welfare or breaches staff ethics, contact our appointed safeguarding lead immediately. Whistleblowers are protected under strict confidentiality protocols.
            </p>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-[#EDEBE2]/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#69B53F]" />
                <span className="font-semibold text-white">Confidential Safeguarding Email:</span>
                <a href="mailto:revelhouseuganda@gmail.com" className="text-[#69B53F] underline">
                  revelhouseuganda@gmail.com
                </a>
              </div>
              <div>
                <span className="font-semibold text-white">Safeguarding Focal Point:</span> {settings.safeguardingLead || '[APPOINTED SAFEGUARDING OFFICER]'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};