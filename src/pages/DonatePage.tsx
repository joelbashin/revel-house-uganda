import React, { useState, useEffect } from 'react';
import { Heart, ShieldCheck, Check, Lock, CreditCard, Landmark, ArrowRight, Printer } from 'lucide-react';
import { createDonation } from '../services/api';
import { getSiteSettings } from '../services/siteSettingsService';
import { initialOrgSettings } from '../data/cmsData';
import { SectionHeading } from '../components/common/SectionHeading';

interface DonatePageProps {
  initialDesignation?: string;
  onNavigate: (path: string) => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({ initialDesignation, onNavigate }) => {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [designation, setDesignation] = useState<string>(
    initialDesignation || 'Where Most Needed'
  );
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer'>('bank_transfer');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    ref: string;
    amount: number;
    frequency: string;
    designation: string;
    date: string;
  } | null>(null);
  const [bankDetails, setBankDetails] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
  }>(initialOrgSettings.bankDetails);

  useEffect(() => {
    if (initialDesignation) {
      setDesignation(initialDesignation);
    }
  }, [initialDesignation]);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data?.bankDetails) setBankDetails(data.bankDetails);
      })
      .catch(() => {});
  }, []);

  const presetAmounts = [25, 50, 100, 250];

  const handleAmountClick = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedAmount(parsed);
    }
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await createDonation({
        amount: finalAmount,
        frequency,
        designation,
        donorName: anonymous ? 'Anonymous Supporter' : donorName,
        donorEmail,
        paymentMethod,
        phone,
        anonymous,
      });

      setReceipt({
        ref: res.transactionRef,
        amount: finalAmount,
        frequency,
        designation,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    } catch {
      alert('Simulation error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="donate-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
            <Heart className="w-3.5 h-3.5 text-[#69B53F] fill-current" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
              COMMUNITY SOLIDARITY
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.06]">
            Support community-led progress in Uganda.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
            Your contributions directly fund clean water cisterns, schooling kits, and caregiver support. Choose your amount and designation below.
          </p>
        </div>

        {/* DONATION CARD */}
        <div className="bg-[var(--c-surface)] rounded-[32px] p-6 sm:p-10 md:p-12 border border-[var(--c-ink)]/8 shadow-sm">
          
          {receipt ? (
            /* RECEIPT / SUCCESS STATE */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69B53F] block mb-1">
                  Thank You for Your Generosity
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[var(--c-ink)]">
                  Donation Confirmed
                </h2>
                <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 mt-2 max-w-md mx-auto">
                  A formal tax receipt has been simulated and logged in the organizational database.
                </p>
              </div>

              {/* RECEIPT SUMMARY BOX */}
              <div className="bg-[var(--c-bg)] p-6 rounded-2xl border border-[var(--c-ink)]/8 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-2">
                  <span className="text-[var(--c-ink)]/60">Transaction Reference:</span>
                  <span className="font-mono font-bold text-[var(--c-ink)]">{receipt.ref}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-2">
                  <span className="text-[var(--c-ink)]/60">Amount & Schedule:</span>
                  <span className="font-bold text-[var(--c-ink)]">${receipt.amount} USD ({receipt.frequency})</span>
                </div>
                <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-2">
                  <span className="text-[var(--c-ink)]/60">Designation:</span>
                  <span className="font-medium text-[var(--c-ink)] text-right line-clamp-1">{receipt.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--c-ink)]/60">Date:</span>
                  <span className="text-[var(--c-ink)]">{receipt.date}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--c-ink)]/20 text-xs font-semibold hover:bg-black/5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => { setReceipt(null); }}
                  className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#69B53F] transition-colors"
                >
                  Make Another Gift
                </button>
                <button
                  onClick={() => onNavigate('/projects')}
                  className="px-6 py-2.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
                >
                  Explore Supported Projects
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-8">
              
              {/* STEP 1: FREQUENCY TOGGLE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-3">
                  1. Donation Frequency
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/8">
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      frequency === 'one-time'
                        ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
                        : 'text-[var(--c-ink)]/60 hover:text-[var(--c-ink)]'
                    }`}
                  >
                    One-Time Gift
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      frequency === 'monthly'
                        ? 'bg-[var(--c-surface)] text-[#69B53F] shadow-xs'
                        : 'text-[var(--c-ink)]/60 hover:text-[var(--c-ink)]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Monthly Champion</span>
                  </button>
                </div>
              </div>

              {/* STEP 2: AMOUNT SELECTION */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-3">
                  2. Select Amount (USD)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountClick(amt)}
                      className={`py-3.5 rounded-2xl font-editorial text-xl sm:text-2xl border transition-all ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#111111] text-white border-[var(--c-line)] shadow-sm scale-[1.02]'
                          : 'bg-[var(--c-bg)] text-[var(--c-ink)] border-[var(--c-ink)]/8 hover:border-[var(--c-ink)]/30'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--c-ink)]/40">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Or enter custom amount in USD"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-sm text-[var(--c-ink)] font-semibold placeholder:text-[var(--c-ink)]/40 focus:outline-hidden focus:border-[#69B53F]"
                  />
                </div>
              </div>

              {/* STEP 3: PROGRAM DESIGNATION */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-2">
                  3. Program Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs sm:text-sm text-[var(--c-ink)] font-medium focus:outline-hidden focus:border-[#69B53F]"
                >
                  <option>Where Most Needed (General Humanitarian Pool)</option>
                  <option>WASH & School Sanitation Project (Water tanks & latrines)</option>
                  <option>Education & Literacy Fund (Scholastic packs & reading corners)</option>
                  <option>Child Care & Family Preservation (Protection & food relief)</option>
                  <option>Maternal & Infant Health Outreach (Mama delivery kits)</option>
                  <option>Caregivers Livelihoods & Micro-Farming</option>
                </select>
              </div>

              {/* STEP 4: DONOR INFORMATION */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-3">
                  4. Donor Details
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required={!anonymous}
                        placeholder="Your Full Name"
                        disabled={anonymous}
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] disabled:opacity-40 focus:outline-hidden focus:border-[#69B53F]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Receipt Email Address *"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] focus:outline-hidden focus:border-[#69B53F]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="anon-check"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="rounded border-[var(--c-ink)]/20 text-[#69B53F] focus:ring-[#69B53F]"
                    />
                    <label htmlFor="anon-check" className="text-xs text-[var(--c-ink)]/70 cursor-pointer">
                      Make this contribution anonymous (name omitted from public partner lists)
                    </label>
                  </div>
                </div>
              </div>

              {/* STEP 5: PAYMENT METHOD - BANK WIRE ONLY */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-ink)]/60 mb-3">
                  5. Payment Channel
                </label>
                <div className="p-5 rounded-2xl border bg-[var(--c-bg)] border-[#69B53F] ring-2 ring-[#69B53F]/20 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#69B53F]/15 flex items-center justify-center text-[#69B53F]">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[var(--c-ink)] block">Bank Wire</span>
                      <span className="text-xs text-[var(--c-ink)]/60 block">Direct bank wire transfer to our verified organizational account</span>
                    </div>
                  </div>

                  <div className="mt-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-ink)]/8 space-y-2.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-[var(--c-ink)]/8">
                      <Landmark className="w-4 h-4 text-[#69B53F]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--c-ink)]/70">
                        Official Bank Wire Details
                      </span>
                    </div>
                    <div className="text-xs space-y-2 pt-1">
                      <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-1.5">
                        <span className="text-[var(--c-ink)]/60">Bank Name</span>
                        <span className="font-semibold text-[var(--c-ink)]">{bankDetails?.bankName || 'Revel House Uganda'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-1.5">
                        <span className="text-[var(--c-ink)]/60">Account Name</span>
                        <span className="font-semibold text-[var(--c-ink)]">{bankDetails?.accountName || 'Revel House Uganda'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--c-ink)]/8 pb-1.5">
                        <span className="text-[var(--c-ink)]/60">Account Number</span>
                        <span className="font-mono font-bold text-[var(--c-ink)]">{bankDetails?.accountNumber || '0123456789'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--c-ink)]/60">Swift Code</span>
                        <span className="font-mono font-bold text-[var(--c-ink)]">{bankDetails?.swiftCode || 'RHVUUG'}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--c-ink)]/50 pt-1">
                      Complete your bank wire using these verified details. Your contribution receipt logs above upon confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full bg-[#69B53F] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#5aa134] shadow-md transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>
                    {isProcessing
                      ? 'Confirming Commitment...'
                      : `Donate $${finalAmount} USD ${frequency === 'monthly' ? '/ month' : ''}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[var(--c-ink)]/50">
                  <Lock className="w-3.5 h-3.5 text-[#69B53F]" />
                  <span>Official Humanitarian Bank Wire Processing · Verified Non-Profit Account</span>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};