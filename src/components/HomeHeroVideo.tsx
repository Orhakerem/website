'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MOBILE_QUERY = '(max-width: 768px)';
const MOBILE_SRC = '/hero-1080.mp4';
const DESKTOP_SRC = '/hero.mp4';

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Home hero media. The poster is a real, responsive `next/image` (the LCP
 * element), and the video only starts downloading once the page has finished
 * loading — on mobile the mp4 otherwise competes with the poster for
 * bandwidth and pushes LCP out. The video fades in over the poster once it is
 * actually playing, so there is no visual jump.
 */
export default function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const w = window as IdleWindow;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      video.src = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_SRC : DESKTOP_SRC;
      video.play().catch(() => {
        // Autoplay refused (e.g. data saver): the poster simply stays.
      });
    };

    const schedule = () => {
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(start, { timeout: 2000 });
      } else {
        timeoutId = setTimeout(start, 200);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      window.removeEventListener('load', schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Image
        src="/hero-poster.webp"
        alt=""
        fill
        priority
        quality={60}
        sizes="100vw"
        className="hero-home-poster object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        className={`hero-home-video absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          playing ? 'hero-home-video--playing' : ''
        }`}
      />
    </>
  );
}
