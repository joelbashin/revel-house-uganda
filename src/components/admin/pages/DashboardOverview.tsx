import React, { useEffect, useState } from 'react';
import { FolderKanban, FolderOpen, FileText, Image, BarChart3, TrendingUp, Database, Check } from 'lucide-react';
import { getPrograms } from '../../../services/programsService';
import { getProjects } from '../../../services/projectsService';
import { getArticles } from '../../../services/articlesService';
import { getStats } from '../../../services/statsService';
import { getGalleryPhotos } from '../../../services/galleryService';
import { seedCmsData, isCmsEmpty, MigrationResult } from '../../../services/migrate';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="font-editorial text-3xl text-[var(--c-ink)]">{value}</span>
      </div>
      <p className="text-xs font-medium text-[var(--c-ink-soft)]">{label}</p>
    </div>
  );
}

export function DashboardOverview({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [counts, setCounts] = useState({ programs: 0, projects: 0, articles: 0, stats: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<MigrationResult | null>(null);
  const [seedError, setSeedError] = useState('');
  const [empty, setEmpty] = useState(false);

  const load = async () => {
    try {
      const [progs, projs, arts, stats, gallery, cmsEmpty] = await Promise.all([
        getPrograms(),
        getProjects(),
        getArticles(),
        getStats(),
        getGalleryPhotos(),
        isCmsEmpty(),
      ]);
      setCounts({
        programs: progs.length,
        projects: projs.length,
        articles: arts.length,
        stats: stats.length,
        gallery: gallery.length,
      });
      setEmpty(cmsEmpty);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError('');
    try {
      const result = await seedCmsData();
      setSeedResult(result);
      setEmpty(false);
      await load();
    } catch (err) {
      setSeedError(err instanceof Error ? err.message : 'Migration failed. Check Firestore rules and try again.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-line)] animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-1">Dashboard</h1>
        <p className="text-xs text-[var(--c-ink-soft)]">Overview of all CMS content and database records.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FolderKanban} label="Programs" value={counts.programs} color="bg-[#69B53F]" />
        <StatCard icon={FolderOpen} label="Projects" value={counts.projects} color="bg-[#D35400]" />
        <StatCard icon={FileText} label="Articles" value={counts.articles} color="bg-[#B36B00]" />
        <StatCard icon={BarChart3} label="Statistics" value={counts.stats} color="bg-[#8B1E1E]" />
        <StatCard icon={Image} label="Gallery Photos" value={counts.gallery} color="bg-[#556B2F]" />
      </div>

      {(empty || seedResult || seedError) && (
        <div className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#69B53F]" />
            <h2 className="text-sm font-bold text-[var(--c-ink)]">Import Website Content</h2>
          </div>
          {empty && !seedResult && (
            <p className="text-xs text-[var(--c-ink-soft)]">
              Firestore is empty. Import the existing programs, projects, articles, statistics, gallery, and site settings from the website.
            </p>
          )}
          {seedResult && (
            <div className="flex items-center gap-2 text-xs text-[#69B53F]">
              <Check className="w-4 h-4" />
              <span>
                Imported {seedResult.programs} programs, {seedResult.projects} projects, {seedResult.articles} articles, {seedResult.stats} stats, and {seedResult.gallery} gallery photos.
              </span>
            </div>
          )}
          {seedError && <p className="text-xs text-red-600">{seedError}</p>}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D35400] to-[#F4A300] text-white text-xs font-semibold hover:from-[#F4A300] hover:to-[#D35400] transition-all disabled:opacity-50 shadow-md"
          >
            {seeding ? 'Importing...' : seedResult ? 'Re-import Content' : 'Import Existing Content'}
          </button>
        </div>
      )}

      <div className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-line)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#69B53F]" />
          <h2 className="text-sm font-bold text-[var(--c-ink)]">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Manage Programs', path: '/admin/programs', color: 'hover:border-[#69B53F]' },
            { label: 'Manage Projects', path: '/admin/projects', color: 'hover:border-[#D35400]' },
            { label: 'Manage Articles', path: '/admin/articles', color: 'hover:border-[#B36B00]' },
            { label: 'Manage Gallery', path: '/admin/gallery', color: 'hover:border-[#556B2F]' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`p-4 rounded-xl border border-[var(--c-line)] text-left text-xs font-semibold text-[var(--c-ink-soft)] hover:text-[var(--c-ink)] transition-colors ${item.color} hover:shadow-sm`}
            >
              {item.label} →
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
