import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { loadMediaVideos } from '../../services/mediaVideosService';

const LOCAL_VIDEOS = Object.values(
  import.meta.glob('/videos/videos of revel/*.mp4', {
    query: '?url',
    import: 'default',
    eager: true,
  })
) as string[];

interface CardHandle {
  video: HTMLVideoElement | null;
  state: -1 | 0 | 1;
  hovered: boolean;
  played: boolean;
}

interface StepAnim {
  from: number;
  to: number;
  t0: number;
  dur: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const CARD_SIZES = 'w-[120px] h-[138px] sm:w-[140px] sm:h-[162px] lg:w-[162px] lg:h-[186px]';
const CARD_MARGINS = '-ml-[60px] -mt-[69px] sm:-ml-[70px] sm:-mt-[81px] lg:-ml-[81px] lg:-mt-[93px]';

interface VideoTrackProps {
  videos: string[];
}

const VideoTrack: React.FC<VideoTrackProps> = ({ videos }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [modalVideoSrc, setModalVideoSrc] = useState<string | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const handles = useRef<CardHandle[]>(
    videos.map(() => ({
      video: null,
      state: -1 as const,
      hovered: false,
      played: false,
    }))
  ).current;

  const posRef = useRef(0);
  const velRef = useRef(0);
  const animRef = useRef<StepAnim | null>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const settledRef = useRef(true);
  const wasDraggingRef = useRef(false);
  const cfgRef = useRef({
    cardW: 162,
    slotScale: 1,
    pxPerSlot: 90,
    perspective: 1000,
  });

  useEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      const cardW = first?.offsetWidth ?? 162;
      const isMobile = window.innerWidth < 768;
      cfgRef.current = {
        cardW,
        slotScale: cardW / 162,
        pxPerSlot: (90 * cardW) / 162,
        perspective: isMobile ? 850 : 1000,
      };
      if (trackRef.current) {
        trackRef.current.style.perspective = `${cfgRef.current.perspective}px`;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const step = useCallback((dir: number) => {
    animRef.current = {
      from: posRef.current,
      to: Math.round(posRef.current) + dir,
      t0: performance.now(),
      dur: 520,
    };
    velRef.current = 0;
    settledRef.current = false;
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (wasDraggingRef.current) return;
    const t = e.target as HTMLElement;
    const cardEl = t.closest('[data-index]') as HTMLElement | null;
    if (!cardEl) return;
    const idx = Number(cardEl.dataset.index);
    if (idx < 0 || idx >= videos.length) return;
    // Open the video in a modal
    setModalVideoSrc(videos[idx]);
  }, [videos]);

  const closeModal = useCallback(() => {
    const v = modalVideoRef.current;
    if (v) {
      v.pause();
    }
    setModalVideoSrc(null);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalVideoSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalVideoSrc, closeModal]);

  useEffect(() => {
    if (videos.length === 0) return;
    const root = sectionRef.current;
    if (!root) return;

    const N = videos.length;
    const wrap = (v: number) => ((((v % N) + N) % N + N / 2) % N) - N / 2;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      velRef.current = clamp(velRef.current + -delta * 0.0022, -0.5, 0.5);
      settledRef.current = false;
    };
    root.addEventListener('wheel', onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button')) return;
      draggingRef.current = true;
      wasDraggingRef.current = false;
      startXRef.current = e.clientX;
      startPosRef.current = posRef.current;
      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
      velRef.current = 0;
      animRef.current = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const dt = now - lastTRef.current;
      const pxMoved = e.clientX - lastXRef.current;
      if (Math.abs(e.clientX - startXRef.current) > 4) {
        wasDraggingRef.current = true;
        // Capture pointer only AFTER a real drag begins so simple clicks
        // still fire a normal click event (pointer capture suppresses it).
        if (!root.hasPointerCapture(e.pointerId)) {
          try {
            root.setPointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
        }
      }
      const dSlots = -(e.clientX - startXRef.current) / cfgRef.current.pxPerSlot;
      if (dt > 0 && pxMoved !== 0) {
        velRef.current = clamp(
          (-pxMoved / cfgRef.current.pxPerSlot / dt) * 16.67,
          -0.5,
          0.5
        );
      }
      lastXRef.current = e.clientX;
      lastTRef.current = now;
      posRef.current = startPosRef.current + dSlots;
    };

    const onPointerUp = (e: PointerEvent) => {
      draggingRef.current = false;
      if (root.hasPointerCapture(e.pointerId)) {
        root.releasePointerCapture(e.pointerId);
      }
      if (Math.abs(velRef.current) > 0.0005) {
        settledRef.current = false;
      }
    };

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);

    let raf = 0;
    const tick = (now: number) => {
      const cfg = cfgRef.current;

      if (!draggingRef.current) {
        const anim = animRef.current;
        if (anim) {
          const t = clamp((now - anim.t0) / anim.dur, 0, 1);
          posRef.current = anim.from + (anim.to - anim.from) * easeOutCubic(t);
          if (t >= 1) {
            posRef.current = anim.to;
            animRef.current = null;
            settledRef.current = true;
          }
        } else if (Math.abs(velRef.current) > 0.0006) {
          posRef.current += velRef.current;
          velRef.current *= 0.9;
        } else if (!settledRef.current) {
          const near = Math.round(posRef.current);
          if (Math.abs(posRef.current - near) < 0.002) {
            posRef.current = near;
            settledRef.current = true;
          } else {
            posRef.current += (near - posRef.current) * 0.12;
            velRef.current = 0;
          }
        }
      }

      for (let i = 0; i < N; i++) {
        const d = wrap(i - posRef.current);
        const absD = Math.abs(d);

        const sign = d < 0 ? -1 : 1;
        const s = clamp(absD, 0, 3);
        const k = cfg.slotScale;

        const x = sign * (-7.5 * s * s + 97.5 * s) * k;
        const y = -(2.5 * s * s + 2.5 * s) * k;
        const z = (5 * s * s - 55 * s + 50) * k;
        const rot = -sign * Math.min(9, 3 * s + 1);
        let sx = 1 - 0.08 * s;
        let sy = 1 - 0.07 * s;

        const hovered = handles[i]?.hovered;
        if (hovered) {
          sx *= 1.02;
          sy *= 1.02;
        }

        const opacity =
          absD > 2.3 ? Math.max(0, (2.6 - absD) * 1.5) : 1 - 0.05 * absD;
        const zIndex = Math.max(
          absD > 2.3 ? -1 : 0,
          Math.round(12 - 5 * absD)
        );

        const el = cardRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rot.toFixed(2)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
          el.style.opacity = Math.max(0, opacity).toFixed(3);
          el.style.zIndex = String(zIndex);
          el.style.filter = hovered ? 'brightness(1.04)' : 'none';
          el.style.visibility = absD > 2.6 ? 'hidden' : 'visible';
        }

        const handle = handles[i];
        if (!handle) continue;

        const want: -1 | 0 | 1 = absD <= 2.15 ? 1 : absD <= 2.6 ? 0 : -1;
        if (want !== handle.state) {
          handle.state = want;
          const v = handle.video;
          if (!v) continue;
          if (want === 1) {
            if (!handle.played) {
              v.src = videos[i];
              v.preload = 'auto';
              v.load();
              handle.played = true;
            }
            const p = v.play();
            if (p)
              p.catch(() => {
                v.muted = true;
                setTimeout(() => v.play().catch(() => {}), 250);
              });
          } else if (want === 0) {
            if (!handle.played) {
              v.src = videos[i];
              v.preload = 'metadata';
              v.load();
              handle.played = true;
            }
            v.pause();
          } else {
            v.pause();
            v.removeAttribute('src');
            v.load();
            handle.played = false;
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerUp);
    };
  }, [handles, videos]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'clamp(320px, 46vw, 430px)', touchAction: 'none' }}
      aria-label="Portfolio card gallery, drag or scroll to explore"
      onClick={handleCardClick}
    >
      <div
        ref={trackRef}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {videos.map((src, i) => (
          <div
            key={`card-${i}-${src}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-index={i}
            className={`video-card absolute top-1/2 left-1/2 rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.10)] ${CARD_SIZES} ${CARD_MARGINS}`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity, filter',
            }}
            onPointerEnter={() => {
              handles[i].hovered = true;
            }}
            onPointerLeave={() => {
              handles[i].hovered = false;
            }}
          >
            <video
              ref={(el) => {
                handles[i].video = el;
              }}
              muted
              loop
              playsInline
              preload="none"
              className="block w-full h-full object-cover rounded-[inherit] bg-[#111111] cursor-pointer pointer-events-auto"
              disablePictureInPicture
              controlsList="nodownload noremoteplayback noplaybackrate"
              aria-label={`Portfolio video ${i + 1}, click to play or pause`}
            />
            {/* Play overlay icon */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-[inherit] pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 'clamp(28px, 22%, 42px)',
                  height: 'clamp(28px, 22%, 42px)',
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  transition: 'background 0.25s ease, transform 0.2s ease',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
              >
                <Play size={14} strokeWidth={2.5} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-bg)] border border-black/25 text-[var(--c-ink)] transition-colors duration-200 hover:border-black/60 hover:bg-black/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          aria-label="Previous card"
        >
          <ChevronLeft size={11} strokeWidth={1.75} className="-ml-px" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-bg)] border border-black/25 text-[var(--c-ink)] transition-colors duration-200 hover:border-black/60 hover:bg-black/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          aria-label="Next card"
        >
          <ChevronRight size={11} strokeWidth={1.75} className="-mr-px" />
        </button>
      </div>

      {/* Full-screen video modal */}
      {modalVideoSrc && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 99999,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              zIndex: 100000,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
            }}
            aria-label="Close video"
          >
            <X size={20} strokeWidth={2} color="#fff" />
          </button>

          {/* Video player */}
          <video
            ref={modalVideoRef}
            src={modalVideoSrc}
            controls
            autoPlay
            playsInline
            className="rounded-xl shadow-2xl"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              width: 'auto',
              height: 'auto',
              outline: 'none',
              background: '#000',
            }}
            aria-label="Video player"
          />
        </div>,
        document.body
      )}

      {/* Keyframe animation for modal */}
      {modalVideoSrc && createPortal(
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>,
        document.head
      )}
    </div>
  );
};

export const VideoCarousel: React.FC = () => {
  const [remoteVideos, setRemoteVideos] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadMediaVideos().then((urls) => {
      if (!cancelled) setRemoteVideos(urls);
    });
    return () => { cancelled = true; };
  }, []);

  const videos = [...LOCAL_VIDEOS, ...remoteVideos];

  if (videos.length === 0) {
    return null;
  }

  return <VideoTrack key={`${videos.length}-${videos[videos.length - 1] || 'none'}`} videos={videos} />;
};