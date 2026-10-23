import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { getGalleryItems } from '../../services/galleryItemsService';
import { GalleryItem } from '../../types/gallery';

interface GallerySnippetProps {
  onNavigate: (path: string) => void;
}

export const GallerySnippet: React.FC<GallerySnippetProps> = ({ onNavigate }) => {
  const [previewItems, setPreviewItems] = useState<GalleryItem[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const items = await getGalleryItems();
        setPreviewItems(items.slice(0, 4));
      } catch {
        // silently fail
      }
    }
    load();
  }, []);

  if (previewItems.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--c-soft)] text-[var(--c-ink-soft)] text-[11px] font-semibold tracking-wider uppercase mb-3">
              Our Stories
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--c-ink)]">
              Photo Gallery
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/gallery')}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-ink-soft)] hover:text-[var(--c-ink)] transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {previewItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('/gallery')}
              className="group cursor-pointer relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--c-soft)]"
            >
              {item.type === 'video' ? (
                item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
