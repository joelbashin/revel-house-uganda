import React, { useState, useEffect, useCallback } from 'react';
import { getGalleryItems } from '../services/galleryItemsService';
import { GalleryItem } from '../types/gallery';
import { GalleryItemCard } from '../components/gallery/GalleryItemCard';
import { Lightbox } from '../components/gallery/Lightbox';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getGalleryItems();
        setItems(data);
      } catch {
        console.error('Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);

  const filteredItems =
    filter === 'all' ? items : items.filter((i) => i.category === filter);

  const openLightbox = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevItem = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  }, [filteredItems.length]);

  const nextItem = useCallback(() => {
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  }, [filteredItems.length]);

  return (
    <div className="min-h-screen pt-24 pb-16 md:pt-28 bg-[var(--c-bg)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Surface container */}
        <div
          className="bg-[var(--c-surface)] rounded-[20px] overflow-hidden border border-[var(--c-line)]"
        >
          {/* Intro Section */}
          <div className="px-6 sm:px-10 md:px-16 pt-12 md:pt-16 pb-8 md:pb-10">
            {/* Pill */}
            <div className="mb-6">
              <span className="inline-block px-3.5 py-[7px] rounded-full text-[11px] font-medium tracking-wide bg-[var(--c-soft)] text-[var(--c-ink-soft)]">
                Our Stories
              </span>
            </div>

            {/* Title + Description row */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
              <h1
                className="font-editorial text-[var(--c-ink)]"
                style={{
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 400,
                  letterSpacing: '-0.045em',
                  lineHeight: 0.95,
                }}
              >
                Photo Gallery
              </h1>
            </div>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="px-6 sm:px-10 md:px-16 pb-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filter === 'all'
                      ? 'bg-[var(--c-ink)] text-[var(--c-surface)]'
                      : 'bg-[var(--c-soft)] text-[var(--c-ink-soft)] hover:bg-[var(--c-soft-2)]'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                      filter === cat
                        ? 'bg-[var(--c-ink)] text-[var(--c-surface)]'
                        : 'bg-[var(--c-soft)] text-[var(--c-ink-soft)] hover:bg-[var(--c-soft-2)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="px-4 sm:px-6 md:px-10 pb-10 md:pb-14">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[7px]">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[14px] animate-pulse bg-[var(--c-soft)]"
                    style={{
                      height: i % 3 === 0 ? '320px' : i % 3 === 1 ? '240px' : '280px',
                    }}
                  />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[var(--c-ink-soft)]/50 text-sm">
                  {filter === 'all'
                    ? 'No gallery items yet. Upload images and videos from the admin panel.'
                    : `No items in the "${filter}" category.`}
                </p>
              </div>
            ) : (
              <div className="editorial-gallery">
                {filteredItems.map((item, idx) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onClick={() => openLightbox(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={prevItem}
        onNext={nextItem}
      />
    </div>
  );
};
