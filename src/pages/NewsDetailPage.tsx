import React from 'react';
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight, Heart, Share2 } from 'lucide-react';
import { Article, Project } from '../types';
import { BlankImage } from '../components/common/BlankImage';

interface NewsDetailPageProps {
  article: Article;
  allArticles: Article[];
  allProjects: Project[];
  onNavigate: (path: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({
  article,
  allArticles,
  allProjects,
  onNavigate,
}) => {
  const relatedProject = allProjects.find(p => p.slug === article.relatedProjectSlug);
  const otherArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div id="news-detail-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        
        {/* BACK NAVIGATION */}
        <button
          onClick={() => onNavigate('/news')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--c-ink)]/70 hover:text-[var(--c-ink)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stories</span>
        </button>

        {/* ARTICLE HEADER */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-soft)] text-xs font-semibold uppercase tracking-wider text-[#69B53F]">
            <span>{article.category}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[var(--c-ink)] tracking-tight leading-[1.08]">
            {article.title}
          </h1>

          {/* AUTHOR & DATE METADATA */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--c-ink)]/60 pt-2 border-b border-[var(--c-ink)]/8 pb-6">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#69B53F]" />
              <span className="font-medium text-[var(--c-ink)]">{article.author}</span>
              <span>({article.authorRole})</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedDate}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* FEATURED BLANK IMAGE FRAME (Intentionally blank per user directive) */}
        <div className="mb-10 overflow-hidden rounded-[28px] shadow-sm">
          <BlankImage
            aspectRatio="aspect-[16/9]"
            rounded="rounded-[28px]"
            tone="sage"
            label={`Featured visual container for ${article.title}`}
          >
            <div className="text-center p-6">
              <span className="text-xs uppercase font-semibold text-[#3E7C20] block mb-1">
                Visual Documentation Frame
              </span>
              <span className="font-editorial text-lg text-[var(--c-ink)]/80 max-w-md block">
                {article.title}
              </span>
            </div>
          </BlankImage>
        </div>

        {/* EXCERPT CALLOUT */}
        <div className="p-6 rounded-2xl bg-[var(--c-soft)]/50 border-l-4 border-[#69B53F] mb-8 text-base text-[var(--c-ink)]/85 font-medium leading-relaxed italic">
          &ldquo;{article.excerpt}&rdquo;
        </div>

        {/* BODY CONTENT */}
        <div className="space-y-6 text-base sm:text-lg text-[var(--c-ink)]/80 leading-relaxed font-light mb-12">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* TAGS */}
        <div className="pt-6 border-t border-[var(--c-ink)]/8 flex flex-wrap items-center gap-2 mb-12">
          <Tag className="w-3.5 h-3.5 text-[var(--c-ink)]/40 mr-1" />
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-[var(--c-soft)]/60 text-xs text-[var(--c-ink)]/70 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* RELATED PROJECT CARD IF APPLICABLE */}
        {relatedProject && (
          <div className="mb-12 p-6 rounded-[24px] bg-[var(--c-surface)] border border-[var(--c-ink)]/8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#69B53F] block mb-1">
                Related Project
              </span>
              <h4 className="font-editorial text-xl text-[var(--c-ink)]">
                {relatedProject.title}
              </h4>
              <p className="text-xs text-[var(--c-ink)]/60 mt-1">
                {relatedProject.location} · {relatedProject.status}
              </p>
            </div>
            <button
              onClick={() => onNavigate(`/projects/${relatedProject.slug}`)}
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold whitespace-nowrap hover:bg-[#69B53F] transition-colors shrink-0"
            >
              View Project Case
            </button>
          </div>
        )}

        {/* SUPPORT CALLOUT */}
        <div className="bg-[#111111] text-white rounded-[28px] p-8 text-center space-y-4 mb-16">
          <h3 className="font-editorial text-2xl sm:text-3xl text-white">
            Help write the next chapter of impact.
          </h3>
          <p className="text-xs sm:text-sm text-[#EDEBE2]/75 max-w-lg mx-auto">
            Your recurring or one-time gift enables us to deepen our grassroots education, child protection, and clean water interventions.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/donate')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Support Revel House Uganda</span>
            </button>
          </div>
        </div>

        {/* OTHER RECENT STORIES */}
        {otherArticles.length > 0 && (
          <div className="border-t border-[var(--c-ink)]/8 pt-12">
            <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-6">
              More Stories from the Field
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((other) => (
                <div
                  key={other.id}
                  onClick={() => onNavigate(`/news/${other.slug}`)}
                  className="bg-[var(--c-surface)] p-6 rounded-2xl border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 transition-colors cursor-pointer group shadow-xs"
                >
                  <span className="text-[10px] uppercase font-semibold text-[#69B53F] block mb-1">
                    {other.category}
                  </span>
                  <h4 className="font-editorial text-lg text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors mb-2 line-clamp-2">
                    {other.title}
                  </h4>
                  <span className="text-xs font-semibold text-[var(--c-ink)] flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};