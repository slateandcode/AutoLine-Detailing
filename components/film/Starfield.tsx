"use client";

import { useEffect, useRef } from "react";
import { filmState, subscribeFilm } from "@/lib/film-store";

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; warm: boolean; bright: boolean };

// Seeded so the field looks the same on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(count: number): Star[] {
  const rand = mulberry32(417);
  return Array.from({ length: count }, (_, i) => {
    const bright = i % 37 === 0;
    return {
      x: rand(),
      y: rand(),
      r: bright ? 1.4 + rand() * 0.8 : 0.5 + rand() * rand() * 1.1,
      a: bright ? 0.95 : 0.35 + rand() * 0.55,
      speed: 0.3 + rand() * 1.1,
      phase: rand() * Math.PI * 2,
      warm: rand() < 0.45,
      bright,
    };
  });
}

// Fixed behind the page. Fades in as chapter 4 ends and stays as the Statement's background.
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const stars = makeStars(300);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let inView = false;
    let w = 0;
    let h = 0;
    let dpr = 1;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    }

    function paint(now: number) {
      const t = now / 1000;
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = reduced ? 1 : 0.6 + 0.4 * Math.sin(t * s.speed + s.phase);
        const alpha = s.a * twinkle;
        const x = s.x * w;
        const y = s.y * h;
        if (s.bright) {
          const g = ctx!.createRadialGradient(x, y, 0, x, y, s.r * 6);
          g.addColorStop(0, `rgba(255,244,222,${alpha * 0.55})`);
          g.addColorStop(1, "rgba(255,244,222,0)");
          ctx!.fillStyle = g;
          ctx!.fillRect(x - s.r * 6, y - s.r * 6, s.r * 12, s.r * 12);
        }
        ctx!.fillStyle = s.warm ? `rgba(255,232,196,${alpha})` : `rgba(226,236,255,${alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop(now: number) {
      paint(now);
      raf = requestAnimationFrame(loop);
    }

    function sync() {
      const opacity = reduced ? 1 : filmState.stars;
      canvas!.style.opacity = String(opacity);
      const run = !reduced && inView && opacity > 0;
      if (run && !raf) raf = requestAnimationFrame(loop);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    // Only animate while the end of the film or the Statement is on screen.
    const watched = [document.getElementById("statement"), document.getElementById("film")].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      inView = visible.size > 0;
      sync();
    });
    watched.forEach((el) => io.observe(el));

    size();
    window.addEventListener("resize", size);
    const unsubscribe = subscribeFilm(sync);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      unsubscribe();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-[100lvh] w-full opacity-0"
    />
  );
}
