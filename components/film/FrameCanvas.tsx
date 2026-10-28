"use client";

import { useEffect, useRef } from "react";
import { focusAt, FrameLoader, manifest, MOBILE_QUERY, MOBILE_RECT } from "@/lib/frames";
import { filmState, subscribeFilm } from "@/lib/film-store";

const idle = (fn: () => void, timeout: number) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout }) : setTimeout(fn, 1200);

export default function FrameCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mobile = window.matchMedia(MOBILE_QUERY);
    let raf = 0;
    let drawn: HTMLImageElement | null = null;
    let cleared = true;
    // The poster is a small AVIF tuned for LCP. Once its lights-on flicker ends, the canvas fades in
    // the full-quality first frame over it.
    let posterSettled = false;

    const loader = new FrameLoader((chapter, index) => {
      // A frame closer to the one we want just arrived.
      if (chapter === filmState.chapter && Math.abs(index - filmState.frame) <= 8) schedule(true);
    });

    function draw(force: boolean) {
      raf = 0;
      if (!canvas || !ctx) return;
      const { chapter, frame } = filmState;
      // At the very top, leave the poster alone until its lights-on effect has finished.
      if (chapter === 0 && frame === 0 && !posterSettled) {
        if (!cleared) ctx.clearRect(0, 0, canvas.width, canvas.height);
        cleared = true;
        drawn = null;
        return;
      }
      const img = loader.get(chapter, frame);
      if (!img || (img === drawn && !force)) return;

      const W = canvas.width;
      const H = canvas.height;
      const rect = mobile.matches
        ? { x: 0, y: H * MOBILE_RECT.top, w: W, h: H * MOBILE_RECT.height }
        : { x: 0, y: 0, w: W, h: H };
      const c = manifest.chapters[chapter];
      // The pan follows the motion curve, so it moves steadily with the scroll like the picture does.
      const along = c.curve?.[frame] ?? frame / Math.max(1, c.frames - 1);
      const fx = focusAt(mobile.matches ? c.mobileFocusX : c.focusX, along);
      const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = rect.x + (rect.w - dw) * fx;
      const dy = rect.y + (rect.h - dh) * 0.5;

      if (mobile.matches) ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
      drawn = img;
      cleared = false;
      canvas.style.opacity = "1";
    }

    function schedule(force = false) {
      if (raf) return;
      raf = requestAnimationFrame(() => draw(force));
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx!.imageSmoothingQuality = "high";
      drawn = null;
      cleared = true;
      schedule(true);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    mobile.addEventListener("change", resize);
    const unsubscribe = subscribeFilm(() => {
      if (filmState.halfwayCh1) loadRest();
      schedule();
    });

    // Chapter 1 starts once the poster has landed, so frames never compete with LCP.
    // Chapters 2 to 4 follow on idle, or as soon as chapter 1 is half scrolled.
    let restStarted = false;
    function loadRest() {
      if (restStarted) return;
      restStarted = true;
      void (async () => {
        for (let c = 1; c < manifest.chapters.length; c++) await loader.load(c, 4);
      })();
    }
    // On Save-Data or a slow connection, wait for the scroll trigger instead of pulling ~14 MB on idle.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const frugal = !!conn && (conn.saveData === true || /2g|3g/.test(conn.effectiveType ?? ""));
    const poster = document.getElementById("poster") as HTMLImageElement | null;
    const settle = () => {
      posterSettled = true;
      schedule(true);
    };
    const startCh1 = () => {
      void loader.load(0, 6);
      if (!frugal) idle(loadRest, 4000);
      const flicker = poster?.getAnimations().find((a) => a.playState === "running");
      if (flicker) flicker.finished.then(settle, settle);
      else settle();
    };
    if (!poster || (poster.complete && poster.naturalWidth)) startCh1();
    else {
      poster.addEventListener("load", startCh1, { once: true });
      poster.addEventListener("error", startCh1, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mobile.removeEventListener("change", resize);
      unsubscribe();
      poster?.removeEventListener("load", startCh1);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="film-motion-only absolute inset-0 size-full opacity-0 transition-opacity duration-700"
    />
  );
}
