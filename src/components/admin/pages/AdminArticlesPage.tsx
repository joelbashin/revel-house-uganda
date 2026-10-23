import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { Article } from '../../../types';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../../../services/articlesService';
import { generateAdminArticle, ArticleAssistantInput } from '../../../services/aiService';
import { GlassButton } from '../../common/GlassButton';
import { SearchInput } from '../common/SearchInput';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useAuth } from '../../../context/AuthContext';

const emptyArticle: Omit<Article, 'id'> = {
  title: '',
  slug: '',
  category: '',
  author: '',
  authorRole: '',
  publishedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  readTime: '3 min read',
  excerpt: '',
  content: [],
  tags: [],
  seoTitle: '',
  seoDescription: '',
  published: false,
};

export function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Article | null>(null);
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<Article, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updateArticle(editing.id, data);
        setToast('Article updated successfully.');
      } else {
        await createArticle(data);
        setToast('Article created successfully.');
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      console.error(err);
      setToast('Error saving article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteArticle(confirmDelete.id);
      setToast('Article deleted.');
      setConfirmDelete(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Articles</h1>
          <p className="text-xs text-[var(--c-ink-soft)]">{articles.length} total articles</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search articles..." />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <p className="text-sm text-[var(--c-ink-soft)]/50">No articles found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((art) => (
            <div key={art.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-semibold text-[#B36B00]">{art.category}</span>
                    <span className="text-[10px] text-[var(--c-ink-soft)]/60">· {art.publishedDate}</span>
                    <span className="text-[10px] text-[var(--c-ink-soft)]/60">· {art.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--c-ink)] truncate">{art.title}</h3>
                  <p className="text-xs text-[var(--c-ink-soft)]/80 truncate">{art.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => { await updateArticle(art.id, { published: !art.published }); await loadData(); }}
                    className={`p-2 rounded-lg transition-colors ${art.published ? 'text-[#69B53F] hover:bg-[#69B53F]/10' : 'text-[var(--c-ink-soft)]/40 hover:bg-[var(--c-ink)]/5'}`}
                  >
                    {art.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(art); setShowForm(true); }}
                    className="p-2 rounded-lg text-[var(--c-ink-soft)]/80 hover:bg-[var(--c-ink)]/5 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(art)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ArticleForm article={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} saving={saving} />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

function ArticleForm({
  article,
  onSave,
  onClose,
  saving,
}: {
  article: Article | null;
  onSave: (data: Omit<Article, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState<Omit<Article, 'id'>>(article || { ...emptyArticle });
  const [contentText, setContentText] = useState((article?.content || []).join('\n\n'));
  const [tagsText, setTagsText] = useState((article?.tags || []).join(', '));

  // AI Assistant Drawer state
  const [showAiTools, setShowAiTools] = useState(false);
  const [aiAction, setAiAction] = useState<ArticleAssistantInput['action']>('generate');
  const [aiTopic, setAiTopic] = useState('');
  const [aiFacts, setAiFacts] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      content: contentText.split('\n\n').filter(Boolean),
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  const handleRunAi = async () => {
    setAiError('');
    setAiLoading(true);

    try {
      const res = await generateAdminArticle({
        action: aiAction,
        title: form.title,
        topic: aiTopic || form.title || form.category,
        facts: aiFacts,
        existingContent: contentText,
        tone: 'Humanitarian & Professional',
        length: 'Medium',
      }, user?.uid);

      if (res.title && aiAction !== 'excerpt' && aiAction !== 'headline') {
        setForm((prev) => ({
          ...prev,
          title: res.title,
          excerpt: res.excerpt || prev.excerpt,
          seoTitle: prev.seoTitle || res.title,
        }));
      }

      if (aiAction === 'headline' && res.title) {
        setForm((prev) => ({ ...prev, title: res.title }));
      } else if (aiAction === 'excerpt' && res.excerpt) {
        setForm((prev) => ({ ...prev, excerpt: res.excerpt }));
      } else if (res.content && res.content.length > 0) {
        setContentText(res.content.join('\n\n'));
      }

      setShowAiTools(false);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Processing failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5 border border-[var(--c-line)]">
        
        {/* HEADER WITH AI ASSISTANT BUTTON */}
        <div className="flex items-center justify-between border-b border-[var(--c-line)] pb-3">
          <h2 className="text-lg font-bold text-[var(--c-ink)]">
            {article ? 'Edit Article' : 'Create Article'}
          </h2>

          <GlassButton
            compact
            type="button"
            onClick={() => setShowAiTools(!showAiTools)}
            className={showAiTools ? 'glass-btn--open' : ''}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{showAiTools ? 'Close Assistant' : 'Ask Revel'}</span>
          </GlassButton>
        </div>

        {/* AI ASSISTANT PANEL */}
        {showAiTools && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--c-ink)] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#D35400]" />
                Article Assistant (Drafting Only)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { action: 'generate', label: 'Generate Complete' },
                { action: 'improve', label: 'Improve & Polish' },
                { action: 'rewrite', label: 'Rewrite Style' },
                { action: 'expand', label: 'Expand Paragraphs' },
                { action: 'shorten', label: 'Shorten Content' },
                { action: 'headline', label: 'New Headline' },
                { action: 'excerpt', label: 'New Excerpt' },
              ].map((btn) => (
                <button
                  key={btn.action}
                  type="button"
                  onClick={() => setAiAction(btn.action as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                    aiAction === btn.action
                      ? 'bg-[#121417] text-white border-[#69B53F]'
                      : 'bg-[var(--c-surface)] text-[var(--c-ink)] border-[var(--c-line)] hover:border-[#69B53F]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <input
                placeholder="Topic or focal point (e.g. WASH latrine commissioning at St. Jude)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none"
              />
              <textarea
                rows={2}
                placeholder="Important facts to preserve (e.g. 10,000L tanks, 31% attendance increase, 400 beneficiaries)"
                value={aiFacts}
                onChange={(e) => setAiFacts(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] text-xs text-[var(--c-ink)] outline-none resize-none"
              />
            </div>

            {aiError && (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{aiError}</span>
              </div>
            )}

            <GlassButton
              compact
              type="button"
              onClick={handleRunAi}
              disabled={aiLoading}
              className="w-full"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Processing Article...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Apply Assistance to Form Fields</span>
                </>
              )}
            </GlassButton>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Author Role</label>
              <input value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Read Time</label>
              <input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Content (paragraphs separated by blank lines)</label>
            <textarea rows={8} value={contentText} onChange={(e) => setContentText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Tags (comma separated)</label>
              <input value={tagsText} onChange={(e) => setTagsText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded border-[var(--c-line)] text-[#69B53F] focus:ring-[#69B53F]" />
            <span className="text-xs font-semibold text-[var(--c-ink-soft)]">Published</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <div className="bg-[#3B2F2F] text-white px-5 py-3 rounded-xl text-xs font-medium shadow-xl flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
      </div>
    </div>
  );
}
