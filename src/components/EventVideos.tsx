'use client';

import { ChevronLeft, ChevronRight, Instagram, Play, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import type { EventsMessages } from '@/i18n/messages/events';
import type { EventVideo } from '@/lib/event-videos';

const INSTAGRAM_URL = 'https://www.instagram.com/or_hakerem/';

const ARROW_CLASS =
  'tap-reset flex h-11 w-11 items-center justify-center rounded-full transition disabled:opacity-30';

interface EventVideosProps {
  videos: readonly EventVideo[];
  t: EventsMessages['videos'];
}

/** Visitors who asked for less motion or less data only get the posters. */
function canAutoplayPreviews(): boolean {
  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } };

  return (
    !connection?.saveData && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface VideoCardProps {
  video: EventVideo;
  playAria: string;
  paused: boolean;
  onOpen: () => void;
}

function VideoCard({ video, playAria, paused, onOpen }: VideoCardProps) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Sticky: once loaded the preview stays mounted, so scrolling back is instant.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || !canAutoplayPreviews()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setIsLoaded(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(preview);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || !isLoaded) return;

    if (isVisible && !paused) {
      preview.play().catch(() => {
        // Autoplay was prevented, the poster stays visible
      });
    } else {
      preview.pause();
    }
  }, [isLoaded, isVisible, paused]);

  return (
    <li className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3rem)/4)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${playAria} – ${video.name}`}
        className="tap-reset group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black/80 text-start"
      >
        <video
          ref={previewRef}
          src={isLoaded ? video.previewPath : undefined}
          poster={video.thumbnailPath}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white">
          <span className="font-head text-base font-semibold leading-snug">{video.name}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-white/35">
            <Play className="h-4 w-4 fill-current" aria-hidden />
          </span>
        </span>
      </button>
    </li>
  );
}

export default function EventVideos({ videos, t }: EventVideosProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Posters are background-loaded eagerly by browsers, so cards only mount
  // once the visitor gets near the section.
  const [isNear, setIsNear] = useState(false);
  const isOpen = openIndex !== null;
  const openVideo = isOpen ? videos[openIndex] : null;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    const originalOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (videos.length === 0) return null;

  // 1 = towards the next card, whichever way the page reads.
  const scrollCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const reading = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollBy({ left: direction * reading * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  const step = (delta: 1 | -1) => {
    setOpenIndex((index) =>
      index === null ? null : (index + delta + videos.length) % videos.length,
    );
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    // The arrow keys seek while the native player controls have the focus.
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    step((event.key === 'ArrowRight') !== isRtl ? 1 : -1);
  };

  return (
    <section
      ref={sectionRef}
      id="event-videos"
      className="mb-10 md:mb-20"
      data-animate="fade-up"
    >
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-tertiary font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
          {t.kicker}
        </span>
        <h2 className="font-head text-2xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
          {t.heading}
        </h2>
        <p className="mt-3 md:mt-6 text-black/80 text-sm md:text-xl leading-relaxed max-w-3xl mx-auto">
          {t.body}
        </p>
      </div>

      {/* Bleeds to the screen edges on phones so the next card peeks in */}
      <ul
        ref={trackRef}
        className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mt-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {videos.map((video, index) =>
          isNear ? (
            <VideoCard
              key={video.slug}
              video={video}
              playAria={t.playAria}
              paused={isOpen}
              onOpen={() => setOpenIndex(index)}
            />
          ) : (
            <li
              key={video.slug}
              aria-hidden
              className="w-[72%] shrink-0 sm:w-[42%] lg:w-[calc((100%-3rem)/4)]"
            >
              <div className="aspect-[9/16] rounded-2xl bg-black/10" />
            </li>
          ),
        )}
      </ul>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollCards(-1)}
          aria-label={t.previousAria}
          className={`${ARROW_CLASS} hidden border border-primary/20 text-black hover:bg-white/60 sm:flex`}
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
        </button>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-black/80 underline-offset-4 hover:underline"
        >
          <Instagram className="h-4 w-4" aria-hidden />
          {t.instagramCta}
        </a>
        <button
          type="button"
          onClick={() => scrollCards(1)}
          aria-label={t.nextAria}
          className={`${ARROW_CLASS} hidden border border-primary/20 text-black hover:bg-white/60 sm:flex`}
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={openVideo?.name}
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleDialogKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenIndex(null);
        }}
        className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        {openVideo ? (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-3 p-4">
            <div className="pointer-events-auto flex w-full max-w-[calc((100dvh-9rem)*9/16)] items-center justify-between gap-3 text-white">
              <p className="font-head text-lg font-semibold">{openVideo.name}</p>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label={t.closeAria}
                className={`${ARROW_CLASS} shrink-0 bg-white/15 hover:bg-white/30`}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <video
              key={openVideo.slug}
              src={openVideo.contentPath}
              poster={openVideo.thumbnailPath}
              controls
              autoPlay
              loop
              playsInline
              className="pointer-events-auto aspect-[9/16] max-h-[calc(100dvh-9rem)] max-w-full rounded-2xl bg-black"
            />
            <div className="pointer-events-auto flex gap-4 text-white">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.previousAria}
                className={`${ARROW_CLASS} bg-white/15 hover:bg-white/30`}
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.nextAria}
                className={`${ARROW_CLASS} bg-white/15 hover:bg-white/30`}
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
