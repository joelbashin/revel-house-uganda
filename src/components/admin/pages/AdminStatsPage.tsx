import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { ImpactStat } from '../../../types';
import { getStats, createStat, updateStat, deleteStat } from '../../../services/statsService';
import { ConfirmDialog } from '../common/ConfirmDialog';

const emptyStat: Omit<ImpactStat, 'id'> = {
  value: 0,
  suffix: '+',
  label: '',
  description: '',
  source: '',
  date: '',
  displayOrder: 0,
  published: true,
};

export function AdminStatsPage() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ImpactStat | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ImpactStat | null>(null);
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (data: Omit<ImpactStat, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updateStat(editing.id, data);
        setToast('Statistic updated successfully.');
      } else {
        await createStat(data);
        setToast('Statistic created successfully.');
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteStat(confirmDelete.id);
      setToast('Statistic deleted.');
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
          <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Statistics</h1>
          <p className="text-xs text-[var(--c-ink-soft)]">{stats.length} impact metrics</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Statistic
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-28" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <p className="text-sm text-[var(--c-ink-soft)]/50">No statistics found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.sort((a, b) => a.displayOrder - b.displayOrder).map((stat) => (
            <div key={stat.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] shadow-xs">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1 text-[var(--c-ink-soft)]/30">
                  <GripVertical className="w-3 h-3" />
                  <span className="text-[10px] font-mono">#{stat.displayOrder}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(stat); setShowForm(true); }}
                    className="p-1.5 rounded-lg text-[var(--c-ink-soft)]/80 hover:bg-[var(--c-ink)]/5 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(stat)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="font-editorial text-3xl text-[var(--c-ink)] mb-1">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <h3 className="text-sm font-bold text-[var(--c-ink)]">{stat.label}</h3>
              <p className="text-xs text-[var(--c-ink-soft)]/80 mt-1">{stat.description}</p>
              <div className="text-[10px] text-[var(--c-ink-soft)]/40 mt-2">
                Source: {stat.source} · {stat.date}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <StatForm stat={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} saving={saving} />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Statistic"
        message={`Delete "${confirmDelete?.label}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

function StatForm({
  stat,
  onSave,
  onClose,
  saving,
}: {
  stat: ImpactStat | null;
  onSave: (data: Omit<ImpactStat, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<ImpactStat, 'id'>>(stat || { ...emptyStat });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 border border-[var(--c-line)]">
        <h2 className="text-lg font-bold text-[var(--c-ink)]">{stat ? 'Edit Statistic' : 'Create Statistic'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Value</label>
              <input type="number" required value={form.value}
                onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Suffix</label>
              <input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Order</label>
              <input type="number" min={0} value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Label</label>
            <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Source</label>
              <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Date/Period</label>
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
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
              {saving ? 'Saving...' : 'Save Statistic'}
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
