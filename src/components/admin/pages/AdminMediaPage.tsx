import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image, Trash2, Copy, Check, LayoutGrid, RefreshCw, Film } from 'lucide-react';
import { uploadMediaFile, deleteMediaFile, listMediaFiles, getStoragePath, getVideoStoragePath, MediaFile } from '../../../services/storageService';
import { getAllMediaContent, setMediaContent, deleteMediaContent } from '../../../services/mediaContentService';
import { getMediaVideos, setMediaVideos } from '../../../services/mediaVideosService';

type GalleryCategory = 'gallery' | 'programs' | 'projects' | 'articles' | 'pages' | 'general';
type Tab = 'upload' | 'pages' | 'videos';

interface PageSection {
  key: string;
  label: string;
  page: string;
  fallback: string;
}

const PAGE_SECTIONS: PageSection[] = [
  { key: 'header.logo', label: 'Site Logo', page: 'Header', fallback: '/images/logo.jpeg' },
  { key: 'hero.safeCare', label: 'Safe Care Community', page: 'Home', fallback: '/images/safecare.jpeg' },
  { key: 'hero.literacy', label: 'Literacy & Learning', page: 'Home', fallback: '/images/imgt5.jpeg' },
  { key: 'hero.wash', label: 'WASH & Water', page: 'Home', fallback: '/images/imgt1.jpeg' },
  { key: 'hero.youth', label: 'Youth Mentoring', page: 'Home', fallback: '/images/imgt3.jpeg' },
  { key: 'hero.livelihoods', label: 'Livelihoods / Caregiver', page: 'Home', fallback: '/images/livelihoods.jpeg' },
  { key: 'hero.health', label: 'Health & Nutrition', page: 'Home', fallback: '/images/imgt4.jpeg' },
  { key: 'featuredProject.main', label: 'Featured Project — Main', page: 'Home', fallback: '/images/imgt6.jpeg' },
  { key: 'featuredProject.offset', label: 'Featured Project — Offset', page: 'Home', fallback: '/images/imgt8.jpeg' },
  { key: 'sponsor.main', label: 'Sponsor — Main Image', page: 'Home', fallback: '/images/safecare.jpeg' },
  { key: 'sponsor.offset', label: 'Sponsor — Offset Image', page: 'Home', fallback: '/images/imgt15.jpeg' },
  { key: 'news.wash', label: 'News — WASH Story Image', page: 'Home', fallback: '/images/imgt6.jpeg' },
  { key: 'news.livelihoods', label: 'News — Livelihoods Story Image', page: 'Home', fallback: '/images/livelihoods.jpeg' },
  { key: 'news.childProtection', label: 'News — Child Protection Story Image', page: 'Home', fallback: '/images/safecare.jpeg' },
  { key: 'programs.childCare', label: 'Child Care & Protection', page: 'Programs', fallback: '/images/safecare.jpeg' },
  { key: 'programs.education', label: 'Education', page: 'Programs', fallback: '/images/imgt5.jpeg' },
  { key: 'programs.health', label: 'Health & Medical Care', page: 'Programs', fallback: '/images/imgt4.jpeg' },
  { key: 'programs.community', label: 'Community Outreach', page: 'Programs', fallback: '/images/livelihoods.jpeg' },
  { key: 'programs.wash', label: 'WASH & Hygiene', page: 'Programs', fallback: '/images/imgt1.jpeg' },
  { key: 'projects.wash-sanitation-schools', label: 'Project — WASH & Sanitation', page: 'Projects', fallback: '/images/imgt1.jpeg' },
  { key: 'projects.community-learning-hub', label: 'Project — Community Learning Hub', page: 'Projects', fallback: '/images/imgt5.jpeg' },
  { key: 'projects.maternal-infant-health-outreach', label: 'Project — Maternal Health Outreach', page: 'Projects', fallback: '/images/imgt4.jpeg' },
  { key: 'projects.caregivers-agricultural-empowerment', label: 'Project — Agricultural Empowerment', page: 'Projects', fallback: '/images/livelihoods.jpeg' },
  { key: 'projects.gallery1', label: 'Project Gallery — 1', page: 'Projects', fallback: '/images/imgt6.jpeg' },
  { key: 'projects.gallery2', label: 'Project Gallery — 2', page: 'Projects', fallback: '/images/imgt3.jpeg' },
  { key: 'projects.gallery3', label: 'Project Gallery — 3', page: 'Projects', fallback: '/images/imgt10.jpeg' },
  { key: 'projects.gallery4', label: 'Project Gallery — 4', page: 'Projects', fallback: '/images/imgt12.jpeg' },
  { key: 'about.hero1', label: 'About — Story Image 1', page: 'About', fallback: '/images/imgt9.jpeg' },
  { key: 'about.hero2', label: 'About — Story Image 2', page: 'About', fallback: '/images/imgt10.jpeg' },
  { key: 'about.hero3', label: 'About — Story Image 3', page: 'About', fallback: '/images/imgt11.jpeg' },
  { key: 'sponsorChild.hero', label: 'Sponsor Child — Hero', page: 'Sponsor Child', fallback: '/images/safecare.jpeg' },
  { key: 'sponsorChild.manifesto', label: 'Sponsor Child — Manifesto', page: 'Sponsor Child', fallback: '/images/imgt13.jpeg' },
  { key: 'sponsorChild.education', label: 'Sponsor Child — Education', page: 'Sponsor Child', fallback: '/images/imgt5.jpeg' },
  { key: 'sponsorChild.food', label: 'Sponsor Child — Nutritious Food', page: 'Sponsor Child', fallback: '/images/livelihoods.jpeg' },
  { key: 'sponsorChild.healthcare', label: 'Sponsor Child — Healthcare', page: 'Sponsor Child', fallback: '/images/imgt4.jpeg' },
  { key: 'sponsorChild.protection', label: 'Sponsor Child — Protection', page: 'Sponsor Child', fallback: '/images/imgt10.jpeg' },
  { key: 'wash.main', label: 'WASH — Hero Grid Main', page: 'WASH', fallback: '/images/wash1.jpeg' },
  { key: 'wash.secondary', label: 'WASH — Hero Grid Secondary', page: 'WASH', fallback: '/images/wash3.jpeg' },
  { key: 'wash.tertiary', label: 'WASH — Hero Grid Tertiary', page: 'WASH', fallback: '/images/wash4.jpeg' },
  { key: 'wash.quaternary', label: 'WASH — Hero Grid Fourth', page: 'WASH', fallback: '/images/wash2.jpeg' },
  { key: 'wash.build', label: 'WASH — Build Section', page: 'WASH', fallback: '/images/wash5.jpeg' },
  { key: 'wash.fun.soap', label: 'WASH — Soap Making Card', page: 'WASH', fallback: '/images/wash1.jpeg' },
  { key: 'wash.fun.challenges', label: 'WASH — Challenges Card', page: 'WASH', fallback: '/images/wash2.jpeg' },
  { key: 'wash.fun.toiletArt', label: 'WASH — Toilet Art Card', page: 'WASH', fallback: '/images/wash3.jpeg' },
  { key: 'wash.fun.community', label: 'WASH — Sensitisation Card', page: 'WASH', fallback: '/images/wash5.jpeg' },
  { key: 'wash.hole.filtration', label: 'WASH — Filtration Card', page: 'WASH', fallback: '/images/wash4.jpeg' },
  { key: 'wash.hole.cover', label: 'WASH — Drop Hole Card', page: 'WASH', fallback: '/images/wash5.jpeg' },
];

const PAGE_GROUPS = ['All', 'Home', 'Header', 'Programs', 'Projects', 'About', 'Sponsor Child', 'WASH'];

export function AdminMediaPage() {
  const [tab, setTab] = useState<Tab>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('general');
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  // Media library state (persisted files, from Storage when available or Firestore)
  const [library, setLibrary] = useState<MediaFile[]>([]);
  const [videoLibrary, setVideoLibrary] = useState<MediaFile[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Page Media state
  const [mediaMap, setMediaMap] = useState<Map<string, string>>(new Map());
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [pageFilter, setPageFilter] = useState('All');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Videos state
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const loadMediaContent = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const items = await getAllMediaContent();
      const map = new Map<string, string>();
      for (const item of items) map.set(item.sectionKey, item.imageUrl);
      setMediaMap(map);
    } catch {
      setToast('Failed to load page media.');
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'pages') loadMediaContent();
  }, [tab, loadMediaContent]);

  const loadVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const urls = await getMediaVideos();
      setVideoUrls(urls);
    } catch {
      setToast('Failed to load videos.');
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  const loadLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const all = await listMediaFiles();
      setLibrary(all.filter((f) => f.kind === 'image'));
      setVideoLibrary(all.filter((f) => f.kind === 'video'));
    } catch {
      setToast('Failed to load the media library.');
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'upload' || tab === 'videos') loadLibrary();
  }, [tab, loadLibrary]);

  useEffect(() => {
    if (tab === 'videos') loadVideos();
  }, [tab, loadVideos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const path = getStoragePath(uploadCategory, filename);
      const entry = await uploadMediaFile(file, path, 'image');
      setLibrary((prev) => [entry, ...prev]);
      setToast('Image uploaded. Assign it to a page section in the Page Media tab.');
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error && err.message === 'IMAGE_TOO_LARGE' ? 'This image is too large to store. Try a smaller photo.' : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (file: MediaFile) => {
    try {
      await deleteMediaFile(file);
      setLibrary((prev) => prev.filter((f) => f.path !== file.path));
      setVideoLibrary((prev) => prev.filter((f) => f.path !== file.path));
      setToast('File deleted.');
    } catch (err) {
      console.error(err);
      setToast('Delete failed.');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const path = getVideoStoragePath('general', filename);
      const entry = await uploadMediaFile(file, path, 'video');
      setVideoLibrary((prev) => [entry, ...prev]);

      const next = videoUrls.includes(entry.url) ? videoUrls : [...videoUrls, entry.url];
      await setMediaVideos(next);
      setVideoUrls(next);
      setToast('Video uploaded and added to the website film reel.');
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error && err.message === 'VIDEO_TOO_LARGE' ? 'This video is too large to store without Firebase Storage. Use a short clip or enable Storage.' : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (videoFileRef.current) videoFileRef.current.value = '';
    }
  };

  const addSiteVideo = async (url: string) => {
    if (!url || videoUrls.includes(url)) return;
    setSaving(true);
    try {
      const next = [...videoUrls, url];
      await setMediaVideos(next);
      setVideoUrls(next);
      setToast('Video added to the site film reel.');
    } catch {
      setToast('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeSiteVideo = async (url: string) => {
    setSaving(true);
    try {
      const next = videoUrls.filter((u) => u !== url);
      await setMediaVideos(next);
      setVideoUrls(next);
      setToast('Video removed from the site film reel.');
    } catch {
      setToast('Failed to remove. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const assignImage = async (sectionKey: string, imageUrl: string) => {
    setSaving(true);
    try {
      await setMediaContent(sectionKey, imageUrl);
      setMediaMap((prev) => new Map(prev).set(sectionKey, imageUrl));
      setEditingKey(null);
      setToast('Image assigned to page section.');
    } catch {
      setToast('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = async (sectionKey: string) => {
    setSaving(true);
    try {
      await deleteMediaContent(sectionKey);
      setMediaMap((prev) => {
        const next = new Map(prev);
        next.delete(sectionKey);
        return next;
      });
      setEditingKey(null);
      setToast('Image removed from section. Using default.');
    } catch {
      setToast('Failed to remove. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredSections = PAGE_SECTIONS.filter(
    (s) => pageFilter === 'All' || s.page === pageFilter
  );

  const allUploadedUrls = library.map((f) => f.url);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial text-2xl text-[var(--c-ink)]">Media Library</h1>
        <p className="text-xs text-[var(--c-ink-soft)]">Upload images and videos and assign them to the website's page sections and film reel.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[var(--c-bg)] p-1 rounded-xl border border-[var(--c-line)]">
        <button
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'upload'
              ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
              : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Images
        </button>
        <button
          onClick={() => setTab('pages')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'pages'
              ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
              : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Page Media
        </button>
        <button
          onClick={() => setTab('videos')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'videos'
              ? 'bg-[var(--c-surface)] text-[var(--c-ink)] shadow-xs'
              : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Videos
        </button>
      </div>

      {/* UPLOAD TAB */}
      {tab === 'upload' && (
        <>
          <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-2">Storage Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] outline-none"
                >
                  <option value="general">General</option>
                  <option value="gallery">Gallery</option>
                  <option value="programs">Programs</option>
                  <option value="projects">Projects</option>
                  <option value="articles">Articles</option>
                  <option value="pages">Pages</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-2">Select Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2.5 rounded-xl border border-dashed border-[var(--c-ink)]/20 text-sm text-[var(--c-ink-soft)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#69B53F] file:text-white hover:file:bg-[#5aa134] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#69B53F]">
                <div className="w-4 h-4 border-2 border-[#69B53F]/30 border-t-[#69B53F] rounded-full animate-spin" />
                <span>Uploading to Firebase Storage...</span>
              </div>
            )}
          </div>

          {library.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--c-ink)]">Media Library ({library.length})</h3>
                <button
                  onClick={loadLibrary}
                  disabled={loadingLibrary}
                  className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors"
                  title="Refresh from Storage"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingLibrary ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {library.map((file) => (
                <div key={file.path} className="bg-[var(--c-surface)] p-4 rounded-2xl border border-[var(--c-line)] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--c-ink)]/5 overflow-hidden shrink-0">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--c-ink)] truncate">{file.name}</p>
                    <p className="text-[10px] text-[var(--c-ink-soft)]/60 font-mono truncate">{file.path}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => copyUrl(file.url)}
                      className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors">
                      {copied === file.url ? <Check className="w-4 h-4 text-[#69B53F]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(file)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)]">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-4 h-4 text-[var(--c-ink-soft)]/60" />
              <h3 className="text-sm font-bold text-[var(--c-ink)]">Storage Structure</h3>
            </div>
            <div className="text-xs text-[var(--c-ink-soft)] font-mono space-y-1">
              <div>images/gallery/</div>
              <div>images/programs/</div>
              <div>images/projects/</div>
              <div>images/articles/</div>
              <div>images/pages/</div>
              <div>images/general/</div>
            </div>
          </div>
        </>
      )}

      {/* PAGE MEDIA TAB */}
      {tab === 'pages' && (
        <>
          <div className="bg-[var(--c-surface)] p-4 rounded-2xl border border-[var(--c-line)] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--c-ink-soft)]">
                Assign uploaded images to specific page sections. Sections use the default image until reassigned.
              </p>
              <button
                onClick={loadMediaContent}
                disabled={loadingMedia}
                className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMedia ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PAGE_GROUPS.map((group) => (
                <button
                  key={group}
                  onClick={() => setPageFilter(group)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    pageFilter === group
                      ? 'bg-[#3B2F2F] text-white'
                      : 'bg-[var(--c-bg)] text-[var(--c-ink-soft)] border border-[var(--c-line)] hover:border-[var(--c-ink)]/30'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredSections.map((section) => {
              const assigned = mediaMap.get(section.key);
              const isEditing = editingKey === section.key;
              return (
                <div
                  key={section.key}
                  className="bg-[var(--c-surface)] p-4 rounded-2xl border border-[var(--c-line)] shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--c-ink)]/5 shrink-0 border border-[var(--c-line)]">
                      <img
                        src={assigned || section.fallback}
                        alt={section.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--c-ink)]">{section.label}</p>
                      <p className="text-[10px] text-[var(--c-ink-soft)]/60">
                        {section.page} · <span className="font-mono">{section.key}</span>
                      </p>
                      {assigned && (
                        <p className="text-[10px] text-[#69B53F] mt-0.5 font-medium">Custom image assigned</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingKey(isEditing ? null : section.key)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--c-bg)] border border-[var(--c-line)] hover:border-[var(--c-ink)]/30 text-[var(--c-ink-soft)] transition-colors"
                      >
                        {isEditing ? 'Cancel' : assigned ? 'Change' : 'Assign'}
                      </button>
                      {assigned && (
                        <button
                          onClick={() => removeImage(section.key)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          title="Remove custom image (revert to default)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image picker dropdown */}
                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-[var(--c-line)]">
                      <p className="text-[10px] font-semibold text-[var(--c-ink-soft)]/60 uppercase tracking-wider mb-2">
                        Select an image
                      </p>
                      {allUploadedUrls.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {allUploadedUrls.map((url, idx) => (
                            <button
                              key={url}
                              onClick={() => assignImage(section.key, url)}
                              disabled={saving}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                assigned === url ? 'border-[#69B53F] ring-2 ring-[#69B53F]/30' : 'border-transparent hover:border-[var(--c-ink)]/20'
                              }`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--c-ink-soft)]/60 py-4 text-center">
                          Upload images in the Upload tab first, then return here to assign them.
                        </p>
                      )}
                      <p className="text-[10px] text-[var(--c-ink-soft)]/50 mt-2">
                        Default: <span className="font-mono">{section.fallback}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIDEOS TAB */}
      {tab === 'videos' && (
        <>
          <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-2">Select Video</label>
                <input
                  ref={videoFileRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2.5 rounded-xl border border-dashed border-[var(--c-ink)]/20 text-sm text-[var(--c-ink-soft)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D35400] file:text-white hover:file:bg-[#b94a00] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-[10px] text-[var(--c-ink-soft)]/50 mt-2">
                  Uploaded videos are added to the website film reel automatically (stored in <span className="font-mono">videos/general/</span> when Storage is enabled, otherwise saved to the database).
                </p>
              </div>
            </div>
            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#D35400]">
                <div className="w-4 h-4 border-2 border-[#D35400]/30 border-t-[#D35400] rounded-full animate-spin" />
                <span>Uploading video to Firebase Storage...</span>
              </div>
            )}
          </div>

          {/* Videos currently on the site */}
          <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-line)] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[var(--c-ink-soft)]/60" />
                <h3 className="text-sm font-bold text-[var(--c-ink)]">Videos on the Site</h3>
              </div>
              <button
                onClick={loadVideos}
                disabled={loadingVideos}
                className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingVideos ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-[10px] text-[var(--c-ink-soft)]/50 mb-4">
              These play at the end of the site's film reel, after the built-in clips.
            </p>
            {videoUrls.length === 0 ? (
              <p className="text-xs text-[var(--c-ink-soft)]/60 py-4 text-center border border-dashed border-[var(--c-ink)]/15 rounded-xl">
                No custom videos added yet. Upload one above, then choose "Add to site".
              </p>
            ) : (
              <div className="space-y-2">
                {videoUrls.map((url, idx) => (
                  <div key={url} className="bg-[var(--c-bg)] p-3 rounded-xl border border-[var(--c-line)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 flex items-center justify-center">
                      <video src={url} muted playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--c-ink-soft)]/60 font-mono truncate">{url}</p>
                      <p className="text-[10px] text-[var(--c-ink-soft)]/50">Position in reel: #{videoUrls.length - idx}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => copyUrl(url)}
                        className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors">
                        {copied === url ? <Check className="w-4 h-4 text-[#69B53F]" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => removeSiteVideo(url)} disabled={saving}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Remove from site">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video library */}
          {videoLibrary.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--c-ink)]">Video Library ({videoLibrary.length})</h3>
                <button
                  onClick={loadLibrary}
                  disabled={loadingLibrary}
                  className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors"
                  title="Refresh from Storage"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingLibrary ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {videoLibrary.map((file) => (
                <div key={file.path} className="bg-[var(--c-surface)] p-4 rounded-2xl border border-[var(--c-line)] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black overflow-hidden shrink-0 flex items-center justify-center">
                    <video src={file.url} muted playsInline className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--c-ink)] truncate">{file.name}</p>
                    <p className="text-[10px] text-[var(--c-ink-soft)]/60 font-mono truncate">{file.path}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => copyUrl(file.url)}
                      className="p-2 rounded-lg text-[var(--c-ink-soft)]/60 hover:bg-[var(--c-ink)]/5 transition-colors">
                      {copied === file.url ? <Check className="w-4 h-4 text-[#69B53F]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => addSiteVideo(file.url)}
                      disabled={saving || videoUrls.includes(file.url)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        videoUrls.includes(file.url)
                          ? 'bg-[#69B53F]/15 text-[#3E7C20]'
                          : 'bg-[#69B53F] text-white hover:bg-[#5aa134]'
                      }`}
                    >
                      {videoUrls.includes(file.url) ? 'On Site' : 'Add to Site'}
                    </button>
                    <button onClick={() => handleDelete(file)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

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
