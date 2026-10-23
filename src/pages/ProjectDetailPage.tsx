import React from 'react';
import { ArrowLeft, MapPin, Heart, CheckCircle2, AlertCircle, Droplets, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { BlankImage } from '../components/common/BlankImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { SectionHeading } from '../components/common/SectionHeading';
import { useMedia } from '../context/MediaContext';

interface ProjectDetailPageProps {
  project: Project;
  allProjects: Project[];
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  allProjects,
  onNavigate,
}) => {
  const { getImage } = useMedia();
  const otherProjects = allProjects.filter(p => p.id !== project.id).slice(0, 2);

  const projectImages: Record<string, string> = {
    'wash-sanitation-schools': getImage('projects.wash-sanitation-schools', '/images/imgt1.jpeg'),
    'community-learning-hub': getImage('projects.community-learning-hub', '/images/imgt5.jpeg'),
    'maternal-infant-health-outreach': getImage('projects.maternal-infant-health-outreach', '/images/imgt4.jpeg'),
    'caregivers-agricultural-empowerment': getImage('projects.caregivers-agricultural-empowerment', '/images/livelihoods.jpeg'),
  };

  const galleryImages = [
    getImage('projects.gallery1', '/images/imgt6.jpeg'),
    getImage('projects.gallery2', '/images/imgt3.jpeg'),
    getImage('projects.gallery3', '/images/imgt10.jpeg'),
    getImage('projects.gallery4', '/images/imgt12.jpeg'),
  ];

  return (
    <div id="project-detail-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* BACK NAVIGATION */}
        <button
          onClick={() => onNavigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--c-ink)]/70 hover:text-[var(--c-ink)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </button>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <StatusBadge status={project.status} />
              <div className="flex items-center gap-1.5 text-xs text-[var(--c-ink)]/70 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#69B53F]" />
                <span>{project.location}</span>
              </div>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.06]">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--c-ink)]/80 leading-relaxed font-light">
              {project.summary}
            </p>

            {/* FUNDING PROGRESS BOX */}
            <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8 shadow-xs max-w-lg space-y-3">
              <ProgressBar percentage={project.progressPercentage} color="green" />

              {project.fundingGoal && project.amountRaised && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--c-ink)]/6">
                  <div>
                    <span className="text-[var(--c-ink)]/60 block text-[10px] uppercase font-semibold">
                      Committed to Date
                    </span>
                    <span className="font-editorial text-xl text-[var(--c-ink)]">
                      ${project.amountRaised.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--c-ink)]/60 block text-[10px] uppercase font-semibold">
                      Full Phase Budget
                    </span>
                    <span className="font-editorial text-xl text-[var(--c-ink)]/70">
                      ${project.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(`/donate?designation=${encodeURIComponent(project.title)}`)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Support This Project</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <BlankImage
              aspectRatio="aspect-[4/3]"
              rounded="rounded-[36px]"
              tone="sage"
              src={projectImages[project.slug] || '/images/imgt9.jpeg'}
              label={`Field photograph for ${project.title}`}
              className="shadow-md"
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white mx-auto mb-3 border border-white/20">
                  <Droplets className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block mb-1">
                  Verified Project Record
                </span>
                <span className="font-editorial text-xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] block">
                  {project.location}
                </span>
              </div>
            </BlankImage>
          </div>
        </div>

        {/* SECTION: PROBLEM & WHY IT MATTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-14 border-t border-[var(--c-ink)]/8">
          <div className="bg-[var(--c-surface)] p-8 rounded-[28px] border border-[var(--c-ink)]/8 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E85B3F]">
              <AlertCircle className="w-4 h-4" />
              <span>The Ground Challenge</span>
            </div>
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              The Problem We Face
            </h3>
            <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="bg-[var(--c-soft)]/60 p-8 rounded-[28px] border border-[var(--c-ink)]/8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69B53F]">
              <Sparkles className="w-4 h-4" />
              <span>Humanitarian Urgency</span>
            </div>
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Why It Matters
            </h3>
            <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
              {project.whyItMatters}
            </p>
          </div>
        </div>

        {/* DEDICATED WASH MULTI-PILLAR BREAKDOWN (IF WASH PROJECT) */}
        {project.isWASH && (
          <div className="py-16 border-t border-[var(--c-ink)]/8">
            <SectionHeading
              eyebrow="HOLISTIC WASH ARCHITECTURE"
              title="Our five-part response to school sanitation."
              subtitle="Sustainable health requires more than just a water tap—it demands an integrated approach to sanitation, handwashing, and adolescent dignity."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8">
                <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] font-bold text-xs mb-4">
                  01
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">Safe Drinking Water</h4>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                  Installation of 10,000L food-grade rainwater harvesting tanks fitted with first-flush diverters and biosand purification.
                </p>
              </div>

              <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8">
                <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] font-bold text-xs mb-4">
                  02
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">Dignified VIP Latrines</h4>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                  Ventilated Improved Pit (VIP) latrines with fly screens, odorless air circulation, and easily washable masonry surfaces.
                </p>
              </div>

              <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8">
                <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] font-bold text-xs mb-4">
                  03
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">Contactless Handwashing</h4>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                  Foot-pedal operated tippy-tap and cistern stations to eliminate cross-contamination at meal times and after latrine use.
                </p>
              </div>

              <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8">
                <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] font-bold text-xs mb-4">
                  04
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">Menstrual Hygiene Rooms</h4>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                  Dedicated private changing washrooms for adolescent girls with clean water, disposal bins, and dignity kit supplies.
                </p>
              </div>

              <div className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8">
                <span className="w-8 h-8 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#3E7C20] font-bold text-xs mb-4">
                  05
                </span>
                <h4 className="font-editorial text-xl text-[var(--c-ink)] mb-2">Student Health Clubs</h4>
                <p className="text-xs text-[var(--c-ink)]/70 leading-relaxed">
                  Student-led hygiene ambassadors trained on daily facility monitoring, soap making, and peer-to-peer habit reinforcement.
                </p>
              </div>

              <div className="bg-[#111111] text-white p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#69B53F] block mb-2">
                    Sustainability
                  </span>
                  <h4 className="font-editorial text-xl text-white mb-2">Community Maintenance</h4>
                  <p className="text-xs text-[#EDEBE2]/70 leading-relaxed">
                    Local artisans and school committees are trained in masonry repairs and filter maintenance, guaranteeing 10+ year longevity.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/donate')}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#69B53F] hover:underline"
                >
                  <span>Support WASH expansion →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OBJECTIVES & WHAT IS NEEDED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-16 border-t border-[var(--c-ink)]/8">
          <div className="lg:col-span-6 space-y-5">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Target Objectives & Activities
            </h3>
            <ul className="space-y-3">
              {project.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[var(--c-ink)]/80">
                  <CheckCircle2 className="w-4 h-4 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)]">
              Current Resource Needs
            </h3>
            <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed">
              We allocate all project funding with line-item specificity. The following items remain outstanding for this project cycle:
            </p>
            <div className="space-y-2.5">
              {project.whatIsNeeded.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-ink)]/8 text-xs sm:text-sm text-[var(--c-ink)]/80 flex items-start gap-2.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] shrink-0 mt-2" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIELD GALLERY */}
        <div className="py-16 border-t border-[var(--c-ink)]/8">
          <SectionHeading
            eyebrow="FIELD DOCUMENTATION"
            title="Project site & infrastructure frames."
            subtitle="Photographic documentation panels of active site zones."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BlankImage
              aspectRatio="aspect-square"
              rounded="rounded-2xl"
              tone="sage"
              src={galleryImages[0]}
              label="Catchment Site photograph"
            >
              <span className="text-[10px] text-white/90 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Catchment Site A</span>
            </BlankImage>
            <BlankImage
              aspectRatio="aspect-square"
              rounded="rounded-2xl"
              tone="clay"
              src={galleryImages[1]}
              label="Masonry works photograph"
            >
              <span className="text-[10px] text-white/90 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Masonry Works</span>
            </BlankImage>
            <BlankImage
              aspectRatio="aspect-square"
              rounded="rounded-2xl"
              tone="stone"
              src={galleryImages[2]}
              label="Filtration reservoir photograph"
            >
              <span className="text-[10px] text-white/90 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Filtration Reservoir</span>
            </BlankImage>
            <BlankImage
              aspectRatio="aspect-square"
              rounded="rounded-2xl"
              tone="cream"
              src={galleryImages[3]}
              label="Hygiene station photograph"
            >
              <span className="text-[10px] text-white/90 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Hygiene Station</span>
            </BlankImage>
          </div>
        </div>

        {/* FIELD UPDATES TIMELINE */}
        {project.updates.length > 0 && (
          <div className="py-16 border-t border-[var(--c-ink)]/8">
            <SectionHeading
              eyebrow="VERIFIED MILESTONES"
              title="Recent field updates."
              subtitle="Chronological logging of ground milestones and committee meetings."
            />

            <div className="space-y-4 max-w-3xl">
              {project.updates.map((upd, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-ink)]/8 shadow-xs flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--c-soft)] text-[11px] font-semibold text-[var(--c-ink)]/70 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{upd.date}</span>
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg text-[var(--c-ink)] mb-1">
                      {upd.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--c-ink)]/75 leading-relaxed">
                      {upd.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPORT CALLOUT */}
        <div className="mt-10 bg-[#111111] text-white rounded-[32px] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#69B53F]">
            CALL TO ACTION
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl">
            Help complete the {project.title}
          </h3>
          <p className="text-sm sm:text-base text-[#EDEBE2]/75 max-w-xl mx-auto">
            Your support delivers tangible materials to certified builders and school committees on the ground in Uganda.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate(`/donate?designation=${encodeURIComponent(project.title)}`)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate to This Project</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};