import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  Heart,
  Expand,
} from 'lucide-react';
import {
  sponsorshipPhotos,
  galleryCategories,
  ORGANIZATION_NAME,
  ORGANIZATION_COUNTRY,
  GalleryPhoto,
} from '../../data/sponsorshipGallery';

interface SponsorGalleryProps {
  onNavigate: (path: string) => void;
}

interface CardHandle {
  img: HTMLImageElement | null;
  hovered: boolean;
  srcRequested: boolean;
  loaded: boolean;
}

interface StepAnim {
  from: number;
  to: number;
  t0: number;
  dur: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const N = sponsorshipPhotos.length;
const ASPECT: Record<GalleryPhoto['ratio'], number> = {
  landscape: 1080 / 810,
  portrait: 810 / 1080,
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export const SponsorGallery: React.FC<SponsorGalleryProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handles = useRef<CardHandle[]>(
    sponsorshipPhotos.map(() => ({
      img: null,
      hovered: false,
      srcRequested: false,
      loaded: false,
    }))
  ).current;

  const posRef = useRef(0);
  const velRef = useRef(0);
  const animRef = useRef<StepAnim | null>(null);
  const draggingRef = useRef(false);
  const wasDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const settledRef = useRef(true);
  const activeRef = useRef(0);
  const cfgRef = useRef({ cardW: 400, pxPerSlot: 248, perspective: 1500 });

  const [cardW, setCardW] = useState(400);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  /* ---------- measurement ---------- */
  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const winW = window.innerWidth;
      const stageH = section.clientHeight;
      const stageW = section.clientWidth;
      const activeMaxH = stageH * 0.78;

      let desired: number;
      if (winW < 768) {
        desired = Math.min(stageW * 0.82, 380);
      } else if (winW < 1024) {
        desired = Math.min(stageW * 0.55, 440);
      } else {
        desired = Math.min(stageW * 0.4, 540);
      }
      const w = Math.round(Math.min(desired, activeMaxH / 1.334));
      cfgRef.current = {
        cardW: w,
        pxPerSlot: w * 0.62,
        perspective: 1500,
      };
      setCardW(w);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ---------- clock ---------- */
  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  /* ---------- intersection → enable wheel/keyboard only when visible ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e) setInView(e.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* ---------- preloading neighbours ---------- */
  const preload = useCallback((idx: number) => {
    for (const offset of [-1, 1]) {
      const j = idx + offset;
      if (j < 0 || j >= N) continue;
      const img = new Image();
      img.src = sponsorshipPhotos[j].image;
    }
  }, []);

  /* ---------- step by one ---------- */
  const step = useCallback((dir: number) => {
    const target = clamp(Math.round(posRef.current) + dir, 0, N - 1);
    animRef.current = {
      from: posRef.current,
      to: target,
      t0: performance.now(),
      dur: 540,
    };
    velRef.current = 0;
    settledRef.current = false;
  }, []);

  /* ---------- physics loop ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      velRef.current = clamp(
        velRef.current + -delta * 0.0013,
        -0.85,
        0.85
      );
      settledRef.current = false;
      animRef.current = null;
    };
    stage.addEventListener('wheel', onWheel, { passive: false });

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
      if (e.pointerType === 'mouse') {
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const dt = now - lastTRef.current;
      const pxMoved = e.clientX - lastXRef.current;
      if (Math.abs(e.clientX - startXRef.current) > 4) {
        wasDraggingRef.current = true;
      }
      const dSlots = -(e.clientX - startXRef.current) / cfgRef.current.pxPerSlot;
      if (dt > 0 && pxMoved !== 0) {
        velRef.current = clamp(
          (-pxMoved / cfgRef.current.pxPerSlot / dt) * 16.67,
          -0.85,
          0.85
        );
      }
      lastXRef.current = e.clientX;
      lastTRef.current = now;
      posRef.current = clamp(startPosRef.current + dSlots, 0, N - 1);
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      if (Math.abs(velRef.current) > 0.0005) {
        settledRef.current = false;
      }
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);

    let raf = 0;
    const tick = (now: number) => {
      const cfg = cfgRef.current;

      /* --- position integration --- */
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
          posRef.current = clamp(posRef.current + velRef.current, 0, N - 1);
          velRef.current *= 0.9;
          if (posRef.current <= 0 || posRef.current >= N - 1) {
            velRef.current *= 0.5;
          }
        } else if (!settledRef.current) {
          const near = clamp(Math.round(posRef.current), 0, N - 1);
          if (Math.abs(posRef.current - near) < 0.002) {
            posRef.current = near;
            settledRef.current = true;
          } else {
            posRef.current += (near - posRef.current) * 0.12;
            velRef.current = 0;
          }
        }
      }

      /* --- active index + preload --- */
      const near = clamp(Math.round(posRef.current), 0, N - 1);
      if (near !== activeRef.current) {
        activeRef.current = near;
        preload(near);
        setActiveIndex(near);
      }

      /* --- card transforms --- */
      for (let i = 0; i < N; i++) {
        const d = i - posRef.current;
        const absD = Math.abs(d);
        const el = cardRefs.current[i];
        const handle = handles[i];

        if (!el) continue;
        if (absD > 3.4) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';

        const sign = d < 0 ? -1 : 1;
        const s = absD;
        const base = (((i % 3) - 1) * 0.7);

        const x =
          sign * cfg.pxPerSlot * (0.42 * s * s + 0.58 * s);
        const y = -(10 * s + 5 * s * s);
        const z = -(6 * s);
        const rot = -sign * Math.min(3.4, 1 + 0.8 * s) + base;

        let scale = 1 - 0.16 * s - 0.02 * s * s;
        const isFocused = absD < 0.55;
        if (isFocused && handle.hovered) {
          scale *= 1.03;
        }

        const opacity = clamp(1 - 0.26 * s, 0, 1);
        const zIndex = Math.round(30 - 8 * s);

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(4);
        el.style.zIndex = String(zIndex);
        el.setAttribute('data-focus', isFocused ? '1' : '0');
        el.style.cursor = isFocused ? 'pointer' : 'grab';
        if (isFocused && handle.hovered) {
          el.style.boxShadow =
            '0 18px 46px rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.10)';
        } else {
          el.style.boxShadow =
            `0 ${(3 + s * 3).toFixed(0)}px ${(10 + s * 8).toFixed(0)}px rgba(0,0,0,${(0.05 + s * 0.02).toFixed(3)})`;
        }

        /* --- progressive load when approaching the focus --- */
        if (!handle.srcRequested && absD < 2.6) {
          handle.srcRequested = true;
          if (handle.img) {
            handle.img.src = sponsorshipPhotos[i].image;
            handle.img.onload = () => {
              handle.loaded = true;
              handle.img!.classList.add('gallery-img-loaded');
            };
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerUp);
    };
  }, [handles, preload]);

  /* ---------- card click (open on focused) ---------- */
  const handleCardClick = useCallback(
    (idx: number) => {
      if (wasDraggingRef.current) return;
      const focused = Math.round(posRef.current);
      if (idx === focused) {
        setLightboxIndex(idx);
        posRef.current = idx;
        settledRef.current = true;
      } else {
        animRef.current = {
          from: posRef.current,
          to: idx,
          t0: performance.now(),
          dur: 540,
        };
        velRef.current = 0;
        settledRef.current = false;
      }
    },
    []
  );

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') {
          if (lightboxIndex < N - 1) {
            const next = lightboxIndex + 1;
            setLightboxIndex(next);
            posRef.current = next;
            preload(next);
          }
        }
        if (e.key === 'ArrowLeft') {
          if (lightboxIndex > 0) {
            const prev = lightboxIndex - 1;
            setLightboxIndex(prev);
            posRef.current = prev;
            preload(prev);
          }
        }
        return;
      }
      if (!inView) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, lightboxIndex, step, preload]);

  /* ---------- lightbox swipe ---------- */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const box = lightboxRef.current;
    if (!box) return;

    let sx = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      dragging = true;
      sx = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      const img = box.querySelector('.lb-stage');
      if (img) (img as HTMLElement).style.transform = `translate3d(${dx}px,0,0)`;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - sx;
      const img = box.querySelector('.lb-stage');
      if (img) (img as HTMLElement).style.transform = '';
      if (dx < -70 && lightboxIndex < N - 1) {
        const next = lightboxIndex + 1;
        setLightboxIndex(next);
        posRef.current = next;
        preload(next);
      } else if (dx > 70 && lightboxIndex > 0) {
        const prev = lightboxIndex - 1;
        setLightboxIndex(prev);
        posRef.current = prev;
        preload(prev);
      }
    };

    box.style.touchAction = 'pan-y';
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    return () => {
      box.removeEventListener('pointerdown', down);
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
    };
  }, [lightboxIndex, preload]);

  /* ---------- save picture ---------- */
  const savePicture = useCallback(async (photo: GalleryPhoto) => {
    try {
      await navigator.clipboard.writeText(photo.image);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }, []);

  const active = sponsorshipPhotos[activeIndex];
  const activeTime = `${pad2(clock.getHours())}:${pad2(clock.getMinutes())}:${pad2(clock.getSeconds())}`;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden gallery-root"
      aria-label={`Sponsorship photographic archive of ${N} photographs — drag, scroll, or use arrow keys to explore`}
    >
      {/* -------- top status bar -------- */}
      <div className="relative z-20 flex items-end justify-between opacity-70 px-5 sm:px-8 md:px-12">
        <div className="space-y-1">
          <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-[var(--c-ink)]/70">
            {ORGANIZATION_NAME} · {ORGANIZATION_COUNTRY}
          </p>
          <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-[var(--c-ink)]/45">
            Field Archive — {active.date}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-sans tabular-nums tracking-[0.18em] text-[var(--c-ink)]/70">
            {activeTime}
            <span className="text-[var(--c-ink)]/35">  every : second</span>
          </p>
          <p className="text-[10px] font-sans tabular-nums tracking-[0.18em] text-[var(--c-ink)]/45">
            {String(activeIndex + 1).padStart(2, '0')} — {String(N).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* -------- stage -------- */}
      <div
        ref={stageRef}
        className="relative"
        style={{
          height: 'clamp(470px, 76vh, 700px)',
          touchAction: 'pan-y',
        }}
      >
        {sponsorshipPhotos.map((photo, i) => {
          const h = Math.round(cardW / ASPECT[photo.ratio]);
          return (
            <div
              key={photo.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-i={i}
              className="gallery-card absolute select-none rounded-[7px]"
              style={{
                width: cardW,
                height: h,
                left: '50%',
                top: '50%',
                marginLeft: -cardW / 2,
                marginTop: -h / 2,
                willChange: 'transform, opacity',
                background: '#FBF8F1',
                border: '1px solid rgba(17,17,21,0.15)',
                padding: 7,
                backfaceVisibility: 'hidden',
              }}
              onPointerEnter={() => {
                handles[i].hovered = true;
              }}
              onPointerLeave={() => {
                handles[i].hovered = false;
              }}
              onClick={() => handleCardClick(i)}
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-[4px]"
                style={{ background: 'var(--c-soft)' }}
              >
              <img
                ref={(el) => {
                  handles[i].img = el;
                }}
                alt={`${photo.title} — ${photo.location} (${photo.category})`}
                decoding="async"
                className="gallery-img pointer-events-none block w-full h-full object-cover"
                style={{ opacity: 0 }}
              />
              {/* soft editorial scrim */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                aria-hidden="true"
              />
              {/* archival registration marks */}
              <span
                className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-white/70"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-white/70"
                aria-hidden="true"
              />
              {/* archive index */}
              <span className="gallery-index pointer-events-none absolute top-2 left-2 text-[9px] font-sans font-semibold uppercase tracking-[0.22em] text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* open affordance */}
              <span className="gallery-open-hint pointer-events-none absolute top-2 right-2 inline-flex items-center gap-1 rounded-[3px] bg-black/50 px-1.5 py-0.5 text-[8px] font-sans font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-[2px]">
                <Expand size={9} /> open
              </span>
              {/* active caption plate */}
              <div
                className="gallery-cap pointer-events-none absolute inset-x-0 bottom-0 px-2.5 pt-7 pb-2 bg-gradient-to-t from-black/75 via-black/40 to-transparent"
                aria-hidden="true"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] shrink-0" />
                  <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.24em] text-white/85">
                    {photo.category}
                  </span>
                </div>
                <p
                  className="font-editorial text-white leading-[1.1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                  style={{ fontSize: `clamp(12px, ${cardW * 0.055}px, 22px)` }}
                >
                  {photo.title}
                </p>
                <div className="mt-1 text-[8px] font-sans font-medium uppercase tracking-[0.2em] text-white/70">
                  {photo.location} — {photo.date}
                </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* -------- right side archive index (desktop only) -------- */}
      <div className="hidden xl:block absolute right-6 top-1/2 -translate-y-1/2 z-20 text-right space-y-2">
        <p className="text-[9px] font-sans uppercase tracking-[0.24em] text-[var(--c-ink)]/40">
          Archive — all {N}
        </p>
        {galleryCategories.map((cat) => (
          <p
            key={cat.name}
            className={`text-[9px] font-sans uppercase tracking-[0.22em] ${
              cat.name === active.category
                ? 'text-[#69B53F]'
                : 'text-[var(--c-ink)]/45'
            }`}
          >
            {cat.name} <span className="opacity-60">{cat.count}</span>
          </p>
        ))}
      </div>

      {/* -------- metadata + controls ------ */}
      <div className="relative z-10 mt-6 px-5 sm:px-8 md:px-12 pb-12">
        <div className="max-w-[1240px] mx-auto">
          <div key={active.id} className="gallery-fade-up flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">
            <div className="lg:flex-1 min-w-0">
              <p className="text-[10px] font-sans uppercase tracking-[0.24em] text-[var(--c-ink)]/50 mb-2">
                {active.category} — {active.date}
              </p>
              <h3 className="font-editorial text-2xl sm:text-[28px] leading-[1.15] text-[var(--c-ink)]">
                {active.title}
              </h3>
              <p className="mt-2 text-[11px] sm:text-xs text-[var(--c-ink)]/60 leading-relaxed max-w-[560px]">
                {active.description}
              </p>
              <p className="mt-3 text-[10px] font-sans uppercase tracking-[0.22em] text-[var(--c-ink)]/45">
                {active.location} — {active.credit}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-4">
              <button
                type="button"
                onClick={() => (active.link ? onNavigate(active.link) : undefined)}
                className="gallery-link inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--c-ink)]/70 hover:text-[#69B53F] transition-colors py-1"
                aria-label={`Read more about ${active.title}`}
              >
                Read more <ArrowUpRight size={12} />
              </button>
              <button
                type="button"
                onClick={() => savePicture(active)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors py-1 ${
                  saved ? 'text-[#69B53F]' : 'text-[var(--c-ink)]/70 hover:text-[#E85B3F]'
                }`}
                aria-label="Save this picture"
              >
                <Heart size={11} className={saved ? 'fill-current' : ''} />
                {saved ? 'Saved' : 'Save this picture'}
              </button>
            </div>
          </div>

          {/* divider + controls */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="h-px flex-1 bg-[var(--c-ink)]/12" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={activeIndex === 0}
                className="gallery-ctrl flex items-center justify-center w-8 h-8 rounded-full border border-[var(--c-ink)]/15 text-[var(--c-ink)] transition-all duration-300 hover:border-[var(--c-ink)]/50 hover:bg-[var(--c-ink)] hover:text-[var(--c-bg)] disabled:opacity-25 disabled:pointer-events-none"
                aria-label="Previous photograph"
              >
                <ChevronLeft size={14} strokeWidth={1.6} />
              </button>
              <span className="w-12 text-center text-[10px] font-sans tabular-nums tracking-[0.2em] text-[var(--c-ink)]/55">
                {String(activeIndex + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={activeIndex === N - 1}
                className="gallery-ctrl flex items-center justify-center w-8 h-8 rounded-full border border-[var(--c-ink)]/15 text-[var(--c-ink)] transition-all duration-300 hover:border-[var(--c-ink)]/50 hover:bg-[var(--c-ink)] hover:text-[var(--c-bg)] disabled:opacity-25 disabled:pointer-events-none"
                aria-label="Next photograph"
              >
                <ChevronRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>

          <p className="mt-5 text-[9px] font-sans uppercase tracking-[0.26em] text-[var(--c-ink)]/35">
            Scroll — drag — arrow keys &nbsp;·&nbsp; click to open photograph
          </p>
        </div>
      </div>

      {/* -------- lightbox -------- */}
      {lightboxIndex !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[90] bg-[#0B0C0E]/97 backdrop-blur-[6px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={sponsorshipPhotos[lightboxIndex].title}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 sm:px-8 py-5">
            <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-white/55">
              {sponsorshipPhotos[lightboxIndex].category}{' '}
              <span className="text-white/30">—</span>{' '}
              {sponsorshipPhotos[lightboxIndex].date}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-sans tabular-nums tracking-[0.2em] text-white/55">
                {String(lightboxIndex + 1).padStart(2, '0')}{' '}
                <span className="text-white/30">/</span>{' '}
                {String(N).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white transition-colors"
                aria-label="Close photograph view"
              >
                <X size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>

          <div className="h-full flex flex-col items-center justify-center px-5 sm:px-12">
            <div className="lb-stage max-h-[58vh] w-auto max-w-full transition-transform duration-300 ease-out drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <img
                src={sponsorshipPhotos[lightboxIndex].image}
                alt={`${sponsorshipPhotos[lightboxIndex].title} — ${sponsorshipPhotos[lightboxIndex].location}`}
                decoding="async"
                className="gallery-fade-in max-h-[58vh] w-auto max-w-full object-contain rounded-[4px]"
                draggable={false}
              />
            </div>

            <div key={`lb-meta-${lightboxIndex}`} className="gallery-fade-up mt-7 text-center max-w-xl">
              <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                {sponsorshipPhotos[lightboxIndex].title}
              </h3>
              <p className="mt-2 text-[11px] font-sans uppercase tracking-[0.22em] text-white/50">
                {sponsorshipPhotos[lightboxIndex].location} —{' '}
                {sponsorshipPhotos[lightboxIndex].credit}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-white/65 leading-relaxed">
                {sponsorshipPhotos[lightboxIndex].description}
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (lightboxIndex > 0) {
                  const prev = lightboxIndex - 1;
                  setLightboxIndex(prev);
                  posRef.current = prev;
                  preload(prev);
                }
              }}
              disabled={lightboxIndex === 0}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
              aria-label="Previous photograph"
            >
              <ChevronLeft size={16} strokeWidth={1.6} />
            </button>
            <span className="text-[9px] font-sans uppercase tracking-[0.26em] text-white/35 hidden sm:block">
              drag / arrows to navigate — esc to close
            </span>
            <button
              type="button"
              onClick={() => {
                if (lightboxIndex < N - 1) {
                  const next = lightboxIndex + 1;
                  setLightboxIndex(next);
                  posRef.current = next;
                  preload(next);
                }
              }}
              disabled={lightboxIndex === N - 1}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
              aria-label="Next photograph"
            >
              <ChevronRight size={16} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};