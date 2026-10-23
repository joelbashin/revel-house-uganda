import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Program } from '../../../types';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../../services/programsService';
import { SearchInput } from '../common/SearchInput';
import { ConfirmDialog } from '../common/ConfirmDialog';

const emptyProgram: Omit<Program, 'id'> = {
  title: '',
  slug: '',
  category: 'Child Care & Protection',
  shortDescription: '',
  description: '',
  status: 'ACTIVE',
  objectives: [],
  activities: [],
  impactSummary: '',
  relatedProjects: [],
  seoTitle: '',
  seoDescription: '',
  published: false,
};

export function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Program | null>(null);
  const [toast, setToast] = useState('');

  const loadPrograms = async () => {
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPrograms(); }, []);

  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<Program, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updateProgram(editing.id, data);
        setToast('Program updated successfully.');
      } else {
        await createProgram(data);
        setToast('Program created successfully.');
      }
      setShowForm(false);
      setEditing(null);
      await loadPrograms();
    } catch (err) {
      console.error(err);
      setToast('Error saving program.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProgram(confirmDelete.id);
      setToast('Program deleted.');
      setConfirmDelete(null);
      await loadPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (prog: Program) => {
    try {
      await updateProgram(prog.id, { published: !prog.published });
      await loadPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Programs</h1>
          <p className="text-xs text-[var(--c-ink-soft)]">{programs.length} total programs</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search programs..." />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <p className="text-sm text-[var(--c-ink-soft)]/50">No programs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prog) => (
            <div key={prog.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-semibold text-[#69B53F]">{prog.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      prog.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{prog.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--c-ink)] truncate">{prog.title}</h3>
                  <p className="text-xs text-[var(--c-ink-soft)]/80 truncate">{prog.shortDescription}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(prog)}
                    className={`p-2 rounded-lg transition-colors ${prog.published ? 'text-[#69B53F] hover:bg-[#69B53F]/10' : 'text-[var(--c-ink-soft)]/40 hover:bg-[var(--c-ink)]/5'}`}
                    title={prog.published ? 'Published' : 'Unpublished'}
                  >
                    {prog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setEditing(prog); setShowForm(true); }}
                    className="p-2 rounded-lg text-[var(--c-ink-soft)]/80 hover:bg-[var(--c-ink)]/5 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(prog)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProgramForm
          program={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
          saving={saving}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Program"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && (
        <Toast message={toast} onClose={() => setToast('')} />
      )}
    </div>
  );
}

function ProgramForm({
  program,
  onSave,
  onClose,
  saving,
}: {
  program: Program | null;
  onSave: (data: Omit<Program, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<Program, 'id'>>(
    program || { ...emptyProgram }
  );
  const [objectivesText, setObjectivesText] = useState(
    (program?.objectives || []).join('\n')
  );
  const [activitiesText, setActivitiesText] = useState(
    (program?.activities || []).join('\n')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      objectives: objectivesText.split('\n').filter(Boolean),
      activities: activitiesText.split('\n').filter(Boolean),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5 border border-[var(--c-line)]">
        <h2 className="text-lg font-bold text-[var(--c-ink)]">{program ? 'Edit Program' : 'Create Program'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Program['category'] })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none">
                <option>Child Care & Protection</option>
                <option>Education</option>
                <option>Health & Medical Care</option>
                <option>Community Outreach</option>
                <option>Agriculture & Sustainability</option>
                <option>WASH & Hygiene</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Program['status'] })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none">
                <option>ACTIVE</option>
                <option>SCALING</option>
                <option>PILOT</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Short Description</label>
              <input required value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Description</label>
              <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Objectives (one per line)</label>
              <textarea rows={4} value={objectivesText} onChange={(e) => setObjectivesText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Activities (one per line)</label>
              <textarea rows={4} value={activitiesText} onChange={(e) => setActivitiesText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Impact Summary</label>
              <textarea rows={2} value={form.impactSummary} onChange={(e) => setForm({ ...form, impactSummary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">SEO Description</label>
              <input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-[var(--c-line)] text-[#69B53F] focus:ring-[#69B53F]" />
                <span className="text-xs font-semibold text-[var(--c-ink-soft)]">Published</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Program'}
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
