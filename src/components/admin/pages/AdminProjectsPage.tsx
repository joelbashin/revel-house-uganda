import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Project } from '../../../types';
import { getProjects, createProject, updateProject, deleteProject } from '../../../services/projectsService';
import { SearchInput } from '../common/SearchInput';
import { ConfirmDialog } from '../common/ConfirmDialog';

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  slug: '',
  status: 'ONGOING',
  location: '',
  summary: '',
  problem: '',
  whyItMatters: '',
  objectives: [],
  activities: [],
  progressPercentage: 0,
  fundingGoal: 0,
  amountRaised: 0,
  currency: 'USD',
  whatIsNeeded: [],
  updates: [],
  relatedProgramSlug: '',
  supportEnabled: true,
  seoTitle: '',
  seoDescription: '',
  published: false,
};

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<Project, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing.id, data);
        setToast('Project updated successfully.');
      } else {
        await createProject(data);
        setToast('Project created successfully.');
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      console.error(err);
      setToast('Error saving project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProject(confirmDelete.id);
      setToast('Project deleted.');
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
          <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Projects</h1>
          <p className="text-xs text-[var(--c-ink-soft)]">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <p className="text-sm text-[var(--c-ink-soft)]/50">No projects found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div key={proj.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      proj.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                      proj.status === 'SEEKING FUNDING' ? 'bg-amber-100 text-amber-700' :
                      proj.status === 'PLANNED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{proj.status}</span>
                    <span className="text-[10px] text-[var(--c-ink-soft)]/60">{proj.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--c-ink)] truncate">{proj.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="w-24 h-1.5 bg-[var(--c-ink)]/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#69B53F] rounded-full" style={{ width: `${proj.progressPercentage}%` }} />
                    </div>
                    <span className="text-[10px] text-[var(--c-ink-soft)]/60">{proj.progressPercentage}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => { await updateProject(proj.id, { published: !proj.published }); await loadData(); }}
                    className={`p-2 rounded-lg transition-colors ${proj.published ? 'text-[#69B53F] hover:bg-[#69B53F]/10' : 'text-[var(--c-ink-soft)]/40 hover:bg-[var(--c-ink)]/5'}`}
                  >
                    {proj.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(proj); setShowForm(true); }}
                    className="p-2 rounded-lg text-[var(--c-ink-soft)]/80 hover:bg-[var(--c-ink)]/5 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(proj)}
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
        <ProjectForm project={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} saving={saving} />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Project"
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

function ProjectForm({
  project,
  onSave,
  onClose,
  saving,
}: {
  project: Project | null;
  onSave: (data: Omit<Project, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<Project, 'id'>>(project || { ...emptyProject });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5 border border-[var(--c-line)]">
        <h2 className="text-lg font-bold text-[var(--c-ink)]">{project ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] focus:ring-2 focus:ring-[#69B53F]/30 focus:border-[#69B53F] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none">
                <option>PLANNED</option>
                <option>ONGOING</option>
                <option>SEEKING FUNDING</option>
                <option>COMPLETED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Location</label>
              <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Progress %</label>
              <input type="number" min={0} max={100} value={form.progressPercentage}
                onChange={(e) => setForm({ ...form, progressPercentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Funding Goal (USD)</label>
              <input type="number" min={0} value={form.fundingGoal || 0}
                onChange={(e) => setForm({ ...form, fundingGoal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Amount Raised (USD)</label>
              <input type="number" min={0} value={form.amountRaised || 0}
                onChange={(e) => setForm({ ...form, amountRaised: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Related Program Slug</label>
              <input value={form.relatedProgramSlug} onChange={(e) => setForm({ ...form, relatedProgramSlug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Summary</label>
            <textarea rows={3} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Problem Statement</label>
            <textarea rows={3} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Why It Matters</label>
            <textarea rows={3} value={form.whyItMatters} onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-[var(--c-line)] text-[#69B53F] focus:ring-[#69B53F]" />
              <span className="text-xs font-semibold text-[var(--c-ink-soft)]">Published</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Project'}
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
