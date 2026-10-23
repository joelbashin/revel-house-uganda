import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Article } from '../../types';
import { BlankImage } from '../common/BlankImage';
import { SectionHeading } from '../common/SectionHeading';
import { useMedia } from '../../context/MediaContext';
import { resolveCategoryImage } from '../../utils/categoryImage';

gsap.registerPlugin(ScrollTrigger);

interface RecentNewsProps {
  articles: Article[];
  onNavigate: (path: string) => void;
}

export const RecentNews: React.FC<RecentNewsProps> = ({ articles, onNavigate }) => {
  const { getImage } = useMedia();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header: left heading from left, right button from right slowly as you scroll down; disappear slowly to left and right as you scroll up
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.news-header-anim',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      headerTl
        .fromTo(
          '.news-header-left',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.news-header-right',
          { opacity: 0, x: 140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // Story cards: left card from left, right card from right, center card from bottom; come in slowly as you scroll down, go out slowly as you scroll up
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#news-cards-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });
      cardsTl
        .fromTo(
          '.news-card-p1',
          { opacity: 0, x: -140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.news-card-p2',
          { opacity: 0, y: 70, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.news-card-p3',
          { opacity: 0, x: 140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = articles.slice(0, 3);

  const categoryImages: Record<string, string> = {
    'WASH & Hygiene': getImage('news.wash', '/images/imgt6.jpeg'),
    'Community Livelihoods': getImage('news.livelihoods', '/images/livelihoods.jpeg'),
    'Child Protection': getImage('news.childProtection', '/images/safecare.jpeg'),
  };

  return (
    <section
      ref={sectionRef}
      id="news-section"
      className="py-16 md:py-24 bg-transparent border-0 border-none overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HEADER */}
        <div className="news-header-anim flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <SectionHeading
            eyebrow="NEWS & COMMUNITY STORIES"
            title="Perspectives from the grassroots."
            subtitle="Authentic reflections, program milestones, and field updates written by community coordinators and partners."
            className="mb-0 news-header-left"
          />

          <button
            id="view-all-news-btn"
            onClick={() => onNavigate('/news')}
            className="news-header-right inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69B53F] hover:text-[#5aa134] transition-colors shrink-0 group self-start md:self-end pb-2"
          >
            <span>All Articles & Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-COLUMN STORY GRID */}
        <div id="news-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((art, idx) => (
            <article
              key={art.id}
              id={`story-card-${art.slug}`}
              onClick={() => onNavigate(`/news/${art.slug}`)}
              className={`news-card-anim tilt-3d ${
                idx === 0 ? 'news-card-p1' : idx === 1 ? 'news-card-p2' : 'news-card-p3'
              } group bg-[var(--c-surface)] rounded-[26px] p-6 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 shadow-xs hover:shadow-md transition-all duration-500 flex flex-col justify-between cursor-pointer`}
            >
              <div>
                {/* FIELD PHOTO FRAME */}
                <div className="mb-5 overflow-hidden rounded-[18px]">
                  <BlankImage
                    aspectRatio="aspect-[16/10]"
                    rounded="rounded-[18px]"
                    tone={idx === 0 ? 'sage' : idx === 1 ? 'stone' : 'clay'}
                    src={resolveCategoryImage(art.category, categoryImages, 'Community Livelihoods')}
                    label={`Field photograph for article: ${art.title}`}
                  >
                    <div className="text-center p-3">
                      <span className="text-[10px] uppercase font-semibold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                        Field Dispatch
                      </span>
                      <span className="text-xs font-editorial text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {art.category}
                      </span>
                    </div>
                  </BlankImage>
                </div>

                {/* METADATA: CATEGORY & DATE */}
                <div className="flex items-center justify-between text-[11px] text-[var(--c-ink)]/60 mb-2.5">
                  <span className="font-semibold uppercase tracking-wider text-[#69B53F]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[var(--c-ink)]/40" />
                    <span>{art.publishedDate}</span>
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="font-editorial text-xl sm:text-2xl text-[var(--c-ink)] leading-snug group-hover:text-[#69B53F] transition-colors line-clamp-2">
                  {art.title}
                </h3>

                {/* EXCERPT */}
                <p className="mt-3 text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              {/* FOOTER */}
              <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs font-medium">
                <span className="text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors flex items-center gap-1.5">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[var(--c-ink)]/40 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
