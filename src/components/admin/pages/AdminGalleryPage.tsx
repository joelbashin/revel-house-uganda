import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Image, GripVertical, Film, Upload, RefreshCw } from 'lucide-react';
import { GalleryPhoto, GalleryItem } from '../../../types/gallery';
import { getGalleryPhotos, createPhoto, updatePhoto, deletePhoto } from '../../../services/galleryService';
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem, uploadGalleryFile } from '../../../services/galleryItemsService';
import { SearchInput } from '../common/SearchInput';
import { ConfirmDialog } from '../common/ConfirmDialog';

type Tab = 'photos' | 'items';

const emptyPhoto: Omit<GalleryPhoto, 'id'> = {
  image_path: '',
  aspect_ratio: 'landscape',
  title: '',
  location: '',
  photo_date: '',
  category: '',
  credit: 'Revel House Uganda · Field Archive',
  description: '',
  link: null,
  display_order: 0,
};

const emptyItem: Omit<GalleryItem, 'id'> = {
  type: 'image',
  src: '',
  alt: '',
  title: '',
  category: '',
  description: '',
  display_order: 0,
};

export function AdminGalleryPage() {
  const [tab, setTab] = useState<Tab>('items');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Gallery Management</h1>
        <p className="text-xs text-[var(--c-ink-soft)]">Manage the public photo gallery and sponsorship photos.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[var(--c-bg)] p-1 rounded-xl border border-[var(--c-line)]">
        <button
          onClick={() => setTab('items')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'items'
              ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
              : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          Photo & Video Gallery
        </button>
        <button
          onClick={() => setTab('photos')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'photos'
              ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
              : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Sponsorship Photos
        </button>
      </div>

      {tab === 'items' ? <GalleryItemsTab /> : <SponsorshipPhotosTab />}
    </div>
  );
}

/* ============================================================
   GALLERY ITEMS TAB — Images + Videos with file upload
   ============================================================ */
function GalleryItemsTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<GalleryItem | null>(null);
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filtered = items.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.alt.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, form: Omit<GalleryItem, 'id'>, setForm: (f: Omit<GalleryItem, 'id'>) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(null);
    try {
      const isVideo = file.type.startsWith('video/');
      const url = await uploadGalleryFile(file, isVideo ? 'video' : 'image', isVideo ? (pct) => setUploadProgress(pct) : undefined);
      setForm({ ...form, src: url, type: isVideo ? 'video' : 'image' });
      setToast(isVideo ? 'Video uploaded to gallery.' : 'Image uploaded to gallery.');
    } catch (err) {
      console.error(err);
      setToast('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async (data: Omit<GalleryItem, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updateGalleryItem(editing.id, data);
        setToast('Gallery item updated successfully.');
      } else {
        await createGalleryItem(data);
        setToast('Gallery item created successfully.');
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
      await deleteGalleryItem(confirmDelete.id);
      setToast('Gallery item deleted.');
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
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Photo & Video Gallery</h2>
          <p className="text-xs text-[var(--c-ink-soft)]">{items.length} items total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search gallery items..." />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-surface)] text-sm text-[var(--c-ink)] outline-none"
        >
          <option value="all">All Categories ({items.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <Image className="w-8 h-8 text-[var(--c-ink-soft)]/20 mx-auto mb-2" />
          <p className="text-sm text-[var(--c-ink-soft)]/50">No gallery items found.</p>
          <p className="text-xs text-[var(--c-ink-soft)]/40 mt-1">Upload images or videos to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] shadow-xs overflow-hidden">
              <div className="relative aspect-[4/3]">
                {item.type === 'video' ? (
                  item.src ? (
                    <video src={item.src} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--c-ink)]/5 flex items-center justify-center">
                      <Film className="w-8 h-8 text-[var(--c-ink-soft)]/20" />
                    </div>
                  )
                ) : (
                  item.src ? (
                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--c-ink)]/5 flex items-center justify-center">
                      <Image className="w-8 h-8 text-[var(--c-ink-soft)]/20" />
                    </div>
                  )
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                    {item.type === 'video' ? <Film className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                    {item.type}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => { setEditing(item); setShowForm(true); }}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(item)}
                    className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <GripVertical className="w-3 h-3 text-[var(--c-ink-soft)]/30" />
                  <span className="text-[10px] font-mono text-[var(--c-ink-soft)]/40">#{item.display_order}</span>
                  <span className="text-[10px] text-[var(--c-ink-soft)]/40">·</span>
                  <span className="text-[10px] text-[#69B53F] font-semibold">{item.category}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--c-ink)] truncate">{item.title}</h3>
                <p className="text-xs text-[var(--c-ink-soft)]/80 truncate">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryItemForm
          item={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
          saving={saving}
          uploading={uploading}
          uploadProgress={uploadProgress}
          onFileUpload={handleFileUpload}
          fileRef={fileRef}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Gallery Item"
        message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

/* ============================================================
   SPONSORSHIP PHOTOS TAB — Existing functionality
   ============================================================ */
function SponsorshipPhotosTab() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editing, setEditing] = useState<GalleryPhoto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<GalleryPhoto | null>(null);
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      const data = await getGalleryPhotos();
      setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const categories = Array.from(new Set(photos.map((p) => p.category)));

  const filtered = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (data: Omit<GalleryPhoto, 'id'>) => {
    setSaving(true);
    try {
      if (editing) {
        await updatePhoto(editing.id, data);
        setToast('Photo updated successfully.');
      } else {
        await createPhoto(data);
        setToast('Photo created successfully.');
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
      await deletePhoto(confirmDelete.id);
      setToast('Photo deleted.');
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
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Sponsorship Gallery</h2>
          <p className="text-xs text-[var(--c-ink-soft)]">{photos.length} photos total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search gallery photos..." />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-surface)] text-sm text-[var(--c-ink)] outline-none"
        >
          <option value="all">All Categories ({photos.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)]">
          <Image className="w-8 h-8 text-[var(--c-ink-soft)]/20 mx-auto mb-2" />
          <p className="text-sm text-[var(--c-ink-soft)]/50">No photos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((photo) => (
            <div key={photo.id} className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] shadow-xs overflow-hidden">
              <div className={`relative ${photo.aspect_ratio === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                {photo.image_path ? (
                  <img src={photo.image_path} alt={photo.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--c-ink)]/5 flex items-center justify-center">
                    <Image className="w-8 h-8 text-[var(--c-ink-soft)]/20" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                    {photo.aspect_ratio}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => { setEditing(photo); setShowForm(true); }}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(photo)}
                    className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <GripVertical className="w-3 h-3 text-[var(--c-ink-soft)]/30" />
                  <span className="text-[10px] font-mono text-[var(--c-ink-soft)]/40">#{photo.display_order}</span>
                  <span className="text-[10px] text-[var(--c-ink-soft)]/40">·</span>
                  <span className="text-[10px] text-[#69B53F] font-semibold">{photo.category}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--c-ink)] truncate">{photo.title}</h3>
                <p className="text-xs text-[var(--c-ink-soft)]/80 truncate">{photo.location} · {photo.photo_date}</p>
                <p className="text-[10px] text-[var(--c-ink-soft)]/40 mt-1 truncate">{photo.credit}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PhotoForm photo={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} saving={saving} />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Photo"
        message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

/* ============================================================
   GALLERY ITEM FORM — Upload images/videos from computer
   ============================================================ */
function GalleryItemForm({
  item,
  onSave,
  onClose,
  saving,
  uploading,
  uploadProgress,
  onFileUpload,
  fileRef,
}: {
  item: GalleryItem | null;
  onSave: (data: Omit<GalleryItem, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
  uploading: boolean;
  uploadProgress: number | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, form: Omit<GalleryItem, 'id'>, setForm: (f: Omit<GalleryItem, 'id'>) => void) => void;
  fileRef: React.RefObject<HTMLInputElement>;
}) {
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(item || { ...emptyItem });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.src) return;
    const filename = form.src.split('/').pop() || '';
    const autoName = filename.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '') || 'Gallery photo';
    const title = form.title || autoName;
    onSave({
      ...form,
      title,
      alt: form.alt || title,
      category: form.category || 'Gallery',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 border border-[var(--c-line)]">
        <h2 className="text-lg font-bold text-[var(--c-ink)]">{item ? 'Edit Gallery Item' : 'Add to Gallery'}</h2>

        {/* File Upload Area — large and prominent */}
        <div className="bg-[var(--c-bg)] rounded-xl border-2 border-dashed border-[var(--c-ink)]/15 p-8 text-center">
          <Upload className="w-10 h-10 text-[var(--c-ink-soft)]/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--c-ink-soft)] mb-1">
            Choose an image or video
          </p>
          <p className="text-[11px] text-[var(--c-ink-soft)]/50 mb-4">
            From your computer or phone
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => onFileUpload(e, form, setForm)}
            disabled={uploading}
            className="w-full px-3 py-2.5 rounded-xl border border-dashed border-[var(--c-ink)]/20 text-sm text-[var(--c-ink-soft)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#69B53F] file:text-white hover:file:bg-[#5aa134] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-xs text-[#69B53F]">
              {uploadProgress !== null ? (
                <div className="w-full max-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-4 h-4 border-2 border-[#69B53F]/30 border-t-[#69B53F] rounded-full animate-spin" />
                    <span className="font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--c-ink)]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#69B53F] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--c-ink-soft)]/60 mt-1">Uploading video to Storage...</p>
                </div>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-[#69B53F]/30 border-t-[#69B53F] rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              )}
            </div>
          )}
          {form.src && (
            <div className="mt-4">
              {form.type === 'video' ? (
                <video src={form.src} muted playsInline className="w-40 h-28 object-cover rounded-lg mx-auto" />
              ) : (
                <img src={form.src} alt="Preview" className="w-40 h-28 object-cover rounded-lg mx-auto" />
              )}
              <p className="text-[11px] text-[#69B53F] mt-2 font-medium">Ready to save</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Single text field — optional title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Title (optional)</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Leave empty to auto-name from file"
              className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5">Cancel</button>
            <button type="submit" disabled={saving || uploading || !form.src}
              className="px-5 py-2 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   SPONSORSHIP PHOTO FORM — Existing functionality
   ============================================================ */
function PhotoForm({
  photo,
  onSave,
  onClose,
  saving,
}: {
  photo: GalleryPhoto | null;
  onSave: (data: Omit<GalleryPhoto, 'id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<GalleryPhoto, 'id'>>(photo || { ...emptyPhoto });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5 border border-[var(--c-line)]">
        <h2 className="text-lg font-bold text-[var(--c-ink)]">{photo ? 'Edit Photo' : 'Add Photo'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Image Path (e.g., /images/sp2.jpeg)</label>
              <input required value={form.image_path} onChange={(e) => setForm({ ...form, image_path: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Aspect Ratio</label>
              <select value={form.aspect_ratio}
                onChange={(e) => setForm({ ...form, aspect_ratio: e.target.value as 'landscape' | 'portrait' })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none">
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Display Order</label>
              <input type="number" min={0} value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Photo Date</label>
              <input value={form.photo_date} onChange={(e) => setForm({ ...form, photo_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Credit</label>
              <input value={form.credit} onChange={(e) => setForm({ ...form, credit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-1">Link (optional)</label>
              <input value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value || null })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#69B53F] text-white text-xs font-semibold hover:bg-[#5aa134] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Photo'}
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
