import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { OrganizationSettings } from '../../../types';
import { getSiteSettings, updateSiteSettings } from '../../../services/siteSettingsService';
import { initialOrgSettings } from '../../../data/cmsData';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<OrganizationSettings>(initialOrgSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings({
            ...initialOrgSettings,
            ...data,
            bankDetails: {
              ...initialOrgSettings.bankDetails,
              ...(data.bankDetails || {}),
            },
            socialLinks: {
              ...initialOrgSettings.socialLinks,
              ...(data.socialLinks || {}),
            },
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      setToast('Settings saved successfully.');
    } catch (err) {
      console.error(err);
      setToast('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Site Settings</h1>
          <p className="text-xs text-[var(--c-ink-soft)]">Manage global website content and organization details.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D35400] to-[#F4A300] text-white text-xs font-semibold hover:from-[#F4A300] hover:to-[#D35400] transition-all disabled:opacity-50 shadow-md"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Organization</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Name</label>
              <input value={settings.name || ''} onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Tagline</label>
              <input value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Registration Number</label>
              <input value={settings.registrationNumber || ''} onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Founded Year</label>
              <input value={settings.foundedYear || ''} onChange={(e) => setSettings({ ...settings, foundedYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Country</label>
              <input value={settings.country || ''} onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Email</label>
              <input value={settings.contactEmail || ''} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Phone</label>
              <input value={settings.contactPhone || ''} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Address</label>
              <input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Safeguarding</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Lead</label>
              <input value={settings.safeguardingLead || ''} onChange={(e) => setSettings({ ...settings, safeguardingLead: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Email</label>
              <input value={settings.safeguardingEmail || ''} onChange={(e) => setSettings({ ...settings, safeguardingEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Bank Details</h2>
          <p className="text-xs text-[var(--c-ink-soft)]">These details will appear on the donate page for bank transfer donations.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Bank Name</label>
              <input value={settings.bankDetails?.bankName || ''} onChange={(e) => setSettings({ ...settings, bankDetails: { bankName: e.target.value, accountName: settings.bankDetails?.accountName || '', accountNumber: settings.bankDetails?.accountNumber || '', swiftCode: settings.bankDetails?.swiftCode || '' } })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Account Name</label>
              <input value={settings.bankDetails?.accountName || ''} onChange={(e) => setSettings({ ...settings, bankDetails: { bankName: settings.bankDetails?.bankName || '', accountName: e.target.value, accountNumber: settings.bankDetails?.accountNumber || '', swiftCode: settings.bankDetails?.swiftCode || '' } })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Account Number</label>
              <input value={settings.bankDetails?.accountNumber || ''} onChange={(e) => setSettings({ ...settings, bankDetails: { bankName: settings.bankDetails?.bankName || '', accountName: settings.bankDetails?.accountName || '', accountNumber: e.target.value, swiftCode: settings.bankDetails?.swiftCode || '' } })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Swift Code</label>
              <input value={settings.bankDetails?.swiftCode || ''} onChange={(e) => setSettings({ ...settings, bankDetails: { bankName: settings.bankDetails?.bankName || '', accountName: settings.bankDetails?.accountName || '', accountNumber: settings.bankDetails?.accountNumber || '', swiftCode: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings.socialLinks).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1 capitalize">{key}</label>
                <input value={value || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, [key]: e.target.value },
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200]">
          <div className="bg-[#3B2F2F] text-white px-5 py-3 rounded-xl text-xs font-medium shadow-xl flex items-center gap-3">
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="text-white/50 hover:text-white">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
