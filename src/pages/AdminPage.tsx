import React, { useState } from 'react';
import {
  FolderKanban,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Inbox,
  Heart,
  Users,
  Handshake,
  RotateCcw,
  Check,
  Shield,
  Eye,
} from 'lucide-react';
import { Program, Project, Article, ImpactStat, OrganizationSettings } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';

interface AdminPageProps {
  programs: Program[];
  projects: Project[];
  articles: Article[];
  impactStats: ImpactStat[];
  settings: OrganizationSettings;
  onResetCMS: () => void;
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  programs,
  projects,
  articles,
  impactStats,
  settings,
  onResetCMS,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'programs' | 'projects' | 'articles' | 'stats' | 'submissions' | 'settings'>('programs');

  // Load submissions from localStorage
  const getSubmissions = () => {
    try {
      const contacts = JSON.parse(localStorage.getItem('revel_contact_submissions') || '[]');
      const volunteers = JSON.parse(localStorage.getItem('revel_volunteer_submissions') || '[]');
      const partners = JSON.parse(localStorage.getItem('revel_partner_submissions') || '[]');
      const donations = JSON.parse(localStorage.getItem('revel_donations') || '[]');
      return { contacts, volunteers, partners, donations };
    } catch {
      return { contacts: [], volunteers: [], partners: [], donations: [] };
    }
  };

  const { contacts, volunteers, partners, donations } = getSubmissions();

  return (
    <div id="admin-cms-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[var(--c-ink)]/8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-mono uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3 text-[#69B53F]" />
              <span>EDITORIAL CMS & AUDIT PORTAL</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--c-ink)]">
              Operational Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 mt-1">
              Internal console for managing verified programs, field projects, articles, and public submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset all CMS local changes back to baseline seed data?')) {
                  onResetCMS();
                  window.location.reload();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--c-soft)] text-xs font-semibold text-[var(--c-ink)]/80 hover:bg-[#111111] hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed Data</span>
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#69B53F] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[var(--c-ink)]/8 scrollbar-none">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'programs'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Programs ({programs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#69B53F]" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'articles'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'stats'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Impact Metrics ({impactStats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'submissions'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>
              Submissions ({contacts.length + volunteers.length + partners.length + donations.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#111111] text-white'
                : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Settings & Legal</span>
          </button>
        </div>

        {/* TAB 1: PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              All Active Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map((prog) => (
                <div key={prog.id} className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-semibold text-[#69B53F]">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.status} />
                    </div>
                    <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">{prog.title}</h4>
                    <p className="text-xs text-[var(--c-ink)]/70 line-clamp-2 mb-3">{prog.description}</p>
                    <div className="text-[11px] text-[var(--c-ink)]/60">
                      <strong>Objectives:</strong> {prog.objectives.length} active pillars
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--c-ink)]/8 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--c-ink)]/40">Slug: {prog.slug}</span>
                    <button
                      onClick={() => onNavigate(`/programs/${prog.slug}`)}
                      className="text-xs font-semibold text-[#69B53F] hover:underline"
                    >
                      View Live Entry →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              All Field Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#69B53F]">{proj.location}</span>
                    <StatusBadge status={proj.status} />
                  </div>
                  <h4 className="font-editorial text-xl text-[var(--c-ink)]">{proj.title}</h4>
                  <p className="text-xs text-[var(--c-ink)]/70 line-clamp-2">{proj.summary}</p>
                  
                  <div className="p-3 bg-[var(--c-bg)] rounded-xl border border-[var(--c-ink)]/6">
                    <ProgressBar percentage={proj.progressPercentage} color="green" />
                    {proj.fundingGoal && (
                      <div className="flex justify-between text-[11px] mt-2 font-mono text-[var(--c-ink)]/60">
                        <span>${proj.amountRaised?.toLocaleString()}</span>
                        <span>Goal: ${proj.fundingGoal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-[var(--c-ink)]/40">Slug: {proj.slug}</span>
                    <button
                      onClick={() => onNavigate(`/projects/${proj.slug}`)}
                      className="font-semibold text-[#69B53F] hover:underline"
                    >
                      View Project →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              Field Dispatches & Articles
            </h3>
            <div className="space-y-3">
              {articles.map((art) => (
                <div key={art.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-ink)]/8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase text-[#69B53F]">{art.category}</span>
                      <span className="text-[10px] text-[var(--c-ink)]/40">· {art.publishedDate}</span>
                    </div>
                    <h4 className="font-editorial text-lg text-[var(--c-ink)]">{art.title}</h4>
                    <span className="text-xs text-[var(--c-ink)]/60">By {art.author} ({art.authorRole})</span>
                  </div>
                  <button
                    onClick={() => onNavigate(`/news/${art.slug}`)}
                    className="px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#69B53F] transition-colors shrink-0"
                  >
                    Read Article
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IMPACT STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-2">
              Verified Impact Metrics & Baseline Logs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {impactStats.map((stat) => (
                <div key={stat.id} className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-ink)]/8 shadow-xs space-y-2">
                  <div className="font-editorial text-3xl text-[var(--c-ink)]">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <h4 className="text-xs font-semibold text-[var(--c-ink)]">{stat.label}</h4>
                  <p className="text-[11px] text-[var(--c-ink)]/60 leading-relaxed">{stat.description}</p>
                  <div className="pt-2 border-t border-[var(--c-ink)]/8 text-[10px] text-[var(--c-ink)]/50">
                    <div><strong>Source:</strong> {stat.source}</div>
                    <div><strong>Verified:</strong> {stat.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-8">
            {/* DONATIONS */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-[#69B53F] fill-current" />
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                  Recorded Donations ({donations.length})
                </h4>
              </div>
              {donations.length === 0 ? (
                <p className="text-xs text-[var(--c-ink)]/50 bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8">No donations logged yet. Test a donation via the /donate page.</p>
              ) : (
                <div className="space-y-2">
                  {donations.map((d: any, idx: number) => (
                    <div key={idx} className="bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[var(--c-ink)]">${d.amount} USD</strong> ({d.frequency}) · {d.designation}
                        <div className="text-[var(--c-ink)]/60 text-[11px]">{d.donorName} ({d.donorEmail}) · {d.paymentMethod}</div>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--c-ink)]/50">{d.transactionRef}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VOLUNTEER INQUIRIES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[#69B53F]" />
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                  Volunteer Inquiries ({volunteers.length})
                </h4>
              </div>
              {volunteers.length === 0 ? (
                <p className="text-xs text-[var(--c-ink)]/50 bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8">No volunteer applications logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {volunteers.map((v: any, idx: number) => (
                    <div key={idx} className="bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-[var(--c-ink)]">
                        <span>{v.fullName} ({v.email})</span>
                        <span className="text-[#69B53F] font-normal">{v.areaOfInterest}</span>
                      </div>
                      <p className="text-[var(--c-ink)]/70 text-[11px]">{v.skills || 'No skills note provided'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PARTNER INQUIRIES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="w-4 h-4 text-[#69B53F]" />
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                  Partnership Inquiries ({partners.length})
                </h4>
              </div>
              {partners.length === 0 ? (
                <p className="text-xs text-[var(--c-ink)]/50 bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8">No partner inquiries logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {partners.map((p: any, idx: number) => (
                    <div key={idx} className="bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-[var(--c-ink)]">
                        <span>{p.organizationName} - {p.contactPerson} ({p.email})</span>
                        <span className="text-[#69B53F] font-normal">{p.partnerType}</span>
                      </div>
                      <p className="text-[var(--c-ink)]/70 text-[11px]">{p.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CONTACT MESSAGES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Inbox className="w-4 h-4 text-[#69B53F]" />
                <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                  Contact Messages ({contacts.length})
                </h4>
              </div>
              {contacts.length === 0 ? (
                <p className="text-xs text-[var(--c-ink)]/50 bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8">No contact messages logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {contacts.map((c: any, idx: number) => (
                    <div key={idx} className="bg-[var(--c-surface)] p-4 rounded-xl border border-[var(--c-ink)]/8 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-[var(--c-ink)]">
                        <span>{c.name} ({c.email})</span>
                        <span className="text-[#69B53F] font-normal">{c.subject}</span>
                      </div>
                      <p className="text-[var(--c-ink)]/70 text-[11px]">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-[var(--c-surface)] p-8 rounded-[28px] border border-[var(--c-ink)]/8 shadow-xs max-w-2xl space-y-6">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Organization Registry & Legal Metadata
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-[var(--c-ink)]/60 mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  readOnly
                  value={settings.orgName}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/10 text-xs font-medium text-[var(--c-ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--c-ink)]/60 mb-1">Operating Country & Field Address</label>
                <input
                  type="text"
                  readOnly
                  value={settings.address}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/10 text-xs font-medium text-[var(--c-ink)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--c-ink)]/60 mb-1">Official Contact Email</label>
                  <input
                    type="text"
                    readOnly
                    value={settings.contactEmail}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/10 text-xs font-medium text-[var(--c-ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--c-ink)]/60 mb-1">Official Telephone</label>
                  <input
                    type="text"
                    readOnly
                    value={settings.contactPhone}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/10 text-xs font-medium text-[var(--c-ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--c-ink)]/60 mb-1">Safeguarding Focal Lead</label>
                <input
                  type="text"
                  readOnly
                  value={`${settings.safeguardingLead} (${settings.safeguardingEmail})`}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--c-bg)] border border-[var(--c-ink)]/10 text-xs font-medium text-[var(--c-ink)]"
                />
              </div>

              <div className="pt-4 border-t border-[var(--c-ink)]/8 text-[11px] text-[var(--c-ink)]/60 leading-relaxed">
                All records adhere strictly to Ugandan Non-Governmental Organisations Act regulations and child safeguarding protocols.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
