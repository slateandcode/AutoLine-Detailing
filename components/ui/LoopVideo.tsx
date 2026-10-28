"use client";

import { useEffect, useRef, useState } from "react";

// Lazy service loop: sources and poster attach near the viewport, playback runs only while visible.
export default function LoopVideo({ name, className = "" }: { name: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    const playIo = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (reduced) return;
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 },
    );
    nearIo.observe(v);
    playIo.observe(v);
    return () => {
      nearIo.disconnect();
      playIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!near || !v) return;
    v.load();
    if (visible.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.play().catch(() => undefined);
    }
  }, [near]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      poster={near ? `/media/loops/${name}.webp` : undefined}
      className={`size-full object-cover ${className}`}
    >
      {near && (
        <>
          {/* VP9 comes out 25 to 50% smaller than H.264 at matching quality, so browsers that can play it take it first. */}
          <source src={`/media/loops/${name}.webm`} type="video/webm" />
          <source src={`/media/loops/${name}.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  );
}
