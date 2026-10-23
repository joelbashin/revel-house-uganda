import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { Article } from '../types';
import { BlankImage } from '../components/common/BlankImage';

gsap.registerPlugin(ScrollTrigger);

interface NewsPageProps {
  articles: Article[];
  onNavigate: (path: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ articles, onNavigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const categories = ['ALL', 'WASH & Hygiene', 'Community Livelihoods', 'Child Protection'];

  const filtered = articles.filter((art) => {
    const matchesCat = selectedCat === 'ALL' || art.category === selectedCat;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero header and controls
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.news-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl
        .fromTo(
          '.news-hero-text',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.news-controls-row',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 },
          0.2
        );

      // 2. Stories cards grid
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
          '.news-card-col-0',
          { opacity: 0, x: -120, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.news-card-col-1',
          { opacity: 0, y: 65, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.news-card-col-2',
          { opacity: 0, x: 120, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );
    }, pageRef);

    return () => ctx.revert();
  }, [selectedCat, searchTerm]);

  return (
    <div id="news-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* HEADER */}
        <div className="news-hero-section max-w-3xl mb-12">
          <div className="news-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                DISPATCHES & STORIES
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Stories of community resilience and transformation.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              First-hand reflections from project sites, community dialogues, and program field teams across Uganda.
            </p>
          </div>
        </div>

        {/* CONTROLS: SEARCH & CATEGORIES */}
        <div className="news-controls-row flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-12 pb-6 border-b border-[var(--c-ink)]/8">
          
          {/* CATEGORIES */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-[#111111] text-white'
                    : 'bg-[var(--c-surface)] text-[var(--c-ink)]/70 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30'
                }`}
              >
                {cat === 'ALL' ? 'All Stories' : cat}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[var(--c-ink)]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/12 text-xs text-[var(--c-ink)] placeholder:text-[var(--c-ink)]/40 focus:outline-hidden focus:border-[#69B53F]"
            />
          </div>

        </div>

        {/* ARTICLES GRID */}
        {filtered.length === 0 ? (
          <div className="bg-[var(--c-surface)] rounded-3xl p-12 text-center border border-[var(--c-ink)]/8 max-w-md mx-auto">
            <p className="text-sm text-[var(--c-ink)]/70">No stories match your criteria.</p>
            <button
              onClick={() => { setSelectedCat('ALL'); setSearchTerm(''); }}
              className="mt-4 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div id="news-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((art, idx) => {
              const colClass = `news-card-col-${idx % 3}`;
              return (
                <article
                  key={art.id}
                  onClick={() => onNavigate(`/news/${art.slug}`)}
                  className={`group ${colClass} bg-[var(--c-surface)] rounded-[26px] p-6 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer`}
                >
                  <div>
                    {/* BLANK IMAGE CONTAINER (Per user directive: Where there are images, leave them blank) */}
                    <div className="mb-5 overflow-hidden rounded-[18px]">
                      <BlankImage
                        aspectRatio="aspect-[16/10]"
                        rounded="rounded-[18px]"
                        tone={idx % 3 === 0 ? 'sage' : idx % 3 === 1 ? 'stone' : 'clay'}
                        label={`Blank visual container for article: ${art.title}`}
                      >
                        <div className="text-center p-3">
                          <span className="text-[10px] uppercase font-semibold text-[var(--c-ink)]/50 block">
                            Field Story
                          </span>
                          <span className="font-editorial text-sm text-[var(--c-ink)]/80">
                            {art.category}
                          </span>
                        </div>
                      </BlankImage>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--c-ink)]/60 mb-2.5">
                      <span className="font-semibold uppercase tracking-wider text-[#69B53F]">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--c-ink)]/40" />
                        <span>{art.publishedDate}</span>
                      </div>
                    </div>

                    <h3 className="font-editorial text-xl sm:text-2xl text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors flex items-center gap-1.5">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[var(--c-ink)]/40 flex items-center gap-1 text-[11px] font-normal">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
