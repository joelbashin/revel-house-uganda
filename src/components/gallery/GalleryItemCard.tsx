import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { GalleryItem as GalleryItemType } from '../../types/gallery';

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: () => void;
  index: number;
}

export const GalleryItemCard: React.FC<GalleryItemProps> = ({ item, onClick, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '40px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title || item.alt}`}
      className="gallery-grid-item group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#69B53F] focus-visible:ring-offset-2 rounded-[14px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: prefersReducedMotion
          ? 'opacity 0.2s ease'
          : 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${Math.min(index * 60, 300)}ms`,
      }}
    >
      <div className="relative overflow-hidden rounded-[14px] bg-[var(--c-soft)]">
        {item.type === 'video' ? (
          <>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            ) : (
              <video
                src={item.src}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/60 transition-colors">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        )}
      </div>
    </div>
  );
};
