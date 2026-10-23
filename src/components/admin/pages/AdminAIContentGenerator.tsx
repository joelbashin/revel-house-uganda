import React, { useState } from 'react';
import { Copy, Check, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { generateAdminContent, ContentGeneratorInput } from '../../../services/aiService';
import { useAuth } from '../../../context/AuthContext';
import { GlassButton } from '../../common/GlassButton';

export function AdminAIContentGenerator() {
  const { user } = useAuth();

  const [form, setForm] = useState<ContentGeneratorInput>({
    contentType: 'Program description',
    topic: '',
    keyInfo: '',
    tone: 'Professional & Warm',
    length: 'Medium (2-3 paragraphs)',
    additionalInstructions: '',
  });

  const [generating, setGenerating] = useState(false);
  const [draftResult, setDraftResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const contentTypes = [
    'Program description',
    'Project summary',
    'Article excerpt',
    'Social media post',
    'Volunteer announcement',
    'Donation campaign appeal',
    'General webpage copy',
  ];

  const tones = [
    'Professional & Warm',
    'Humanitarian & Inspiring',
    'Urgent & Action-Oriented',
    'Informative & Educational',
    'Formal & Technical',
  ];

  const lengths = [
    'Short (1 paragraph / 50 words)',
    'Medium (2-3 paragraphs / 150 words)',
    'Detailed (4+ paragraphs / 300+ words)',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError('Please specify a topic or title.');
      return;
    }

    setError('');
    setGenerating(true);
    setCopied(false);

    try {
      const result = await generateAdminContent(form, user?.uid);
      setDraftResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl text-[var(--c-ink)] flex items-center gap-2">
            Content Generator
          </h1>
          <p className="text-xs text-[var(--c-ink-soft)]">
            Generate high-quality draft copy for programs, projects, appeals, and announcements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT FORM */}
        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[var(--c-ink)] border-b border-[var(--c-line)] pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D35400]" />
            Generation Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                Content Type *
              </label>
              <select
                value={form.contentType}
                onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none focus:ring-2 focus:ring-[#D35400]/30"
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                Topic / Subject *
              </label>
              <input
                required
                placeholder="e.g. Clean water cisterns for rural primary schools in Wakiso"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none focus:ring-2 focus:ring-[#D35400]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                Key Facts & Details to Include
              </label>
              <textarea
                rows={3}
                placeholder="List key bullet points, beneficiaries count, locations, or goals (e.g. 10,000L tanks, 4 schools, 1,100 students)"
                value={form.keyInfo}
                onChange={(e) => setForm({ ...form, keyInfo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none resize-none focus:ring-2 focus:ring-[#D35400]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                  Tone
                </label>
                <select
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                  Desired Length
                </label>
                <select
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none"
                >
                  {lengths.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">
                Additional Instructions (Optional)
              </label>
              <input
                placeholder="e.g. Emphasize community ownership and girls retention in school"
                value={form.additionalInstructions}
                onChange={(e) => setForm({ ...form, additionalInstructions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <GlassButton
              compact
              type="submit"
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Generating Draft...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Generate Content Draft</span>
                </span>
              )}
            </GlassButton>
          </form>
        </div>

        {/* DRAFT OUTPUT AREA */}
        <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--c-line)] pb-3">
            <h2 className="text-sm font-bold text-[var(--c-ink)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#69B53F]" />
              Generated Content Draft
            </h2>

            {draftResult && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--c-soft)] text-xs font-semibold text-[var(--c-ink)] hover:bg-[#69B53F]/20 hover:text-[#69B53F] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#69B53F]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              readOnly={!draftResult}
              value={draftResult}
              onChange={(e) => setDraftResult(e.target.value)}
              placeholder="Your content draft will appear here. You can edit the text directly before copying it into your CMS forms."
              className="w-full flex-1 min-h-[300px] p-4 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-xs sm:text-sm text-[var(--c-ink)] outline-none resize-none font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
