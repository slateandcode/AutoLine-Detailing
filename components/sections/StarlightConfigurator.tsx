"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { formatPrice, services } from "@/lib/content";
import { QuoteCta } from "@/components/ui/Cta";
import SectionHeader from "@/components/ui/SectionHeader";

const starlightFrom = formatPrice(services.find((s) => s.id === "starlight")!.from);

const colors = [
  { id: "white", label: "White", swatch: "#F4F1EA", tint: null, rgb: "244,241,234" },
  { id: "warm", label: "Warm", swatch: "#FFC98A", tint: "#FFD3A1", rgb: "255,206,150" },
  { id: "blue", label: "Blue", swatch: "#7FB6FF", tint: "#8CBFFF", rgb: "140,190,255" },
  { id: "purple", label: "Purple", swatch: "#B48CFF", tint: "#BE9BFF", rgb: "190,155,255" },
] as const;
type ColorId = (typeof colors)[number]["id"];

// The headliner in still 4B, as fractions of the frame. Stars and tint stay inside it.
const HEADLINER: [number, number][] = [
  [0.06, 0],
  [0.96, 0],
  [0.84, 0.68],
  [0.16, 0.68],
];
const clipPath = `polygon(${HEADLINER.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(", ")})`;

function insideHeadliner(x: number, y: number) {
  if (y < 0 || y > 0.68) return false;
  const t = y / 0.68;
  const left = 0.06 + (0.16 - 0.06) * t;
  const right = 0.96 + (0.84 - 0.96) * t;
  return x > left && x < right;
}

export default function StarlightConfigurator() {
  const [color, setColor] = useState<ColorId>("warm");
  const [shooting, setShooting] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ color, shooting });
  settings.current = { color, shooting };
  const repaint = useRef<((now: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const stars: { x: number; y: number; r: number; s: number; p: number }[] = [];
    while (stars.length < 170) {
      const x = rand();
      const y = rand() * 0.68;
      if (insideHeadliner(x, y)) stars.push({ x, y, r: 0.4 + rand() * rand() * 1.1, s: 0.6 + rand() * 1.6, p: rand() * 6.28 });
    }

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let shot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShot = 0;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    }

    function paint(now: number) {
      const t = now / 1000;
      const { color: id, shooting: on } = settings.current;
      const rgb = colors.find((c) => c.id === id)!.rgb;
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduced ? 0.8 : 0.35 + 0.65 * Math.abs(Math.sin(t * s.s + s.p));
        const x = s.x * w;
        const y = s.y * h;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, s.r * 3);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(0.3, `rgba(${rgb},${a * 0.45})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(x - s.r * 3, y - s.r * 3, s.r * 6, s.r * 6);
      }
      if (on && !reduced) {
        if (!shot && t > nextShot) {
          const fromLeft = rand() < 0.5;
          shot = { x: fromLeft ? 0.2 : 0.8, y: 0.08 + rand() * 0.25, vx: fromLeft ? 0.55 : -0.55, vy: 0.16, life: 0 };
          nextShot = t + 2.2 + rand() * 2.5;
        }
        if (shot) {
          shot.life += 1 / 60;
          const x = (shot.x + shot.vx * shot.life) * w;
          const y = (shot.y + shot.vy * shot.life) * h;
          const tail = 0.12;
          const tx = x - shot.vx * tail * w;
          const ty = y - shot.vy * tail * h;
          const fade = Math.sin(Math.min(1, shot.life / 0.9) * Math.PI);
          const grad = ctx!.createLinearGradient(tx, ty, x, y);
          grad.addColorStop(0, `rgba(${rgb},0)`);
          grad.addColorStop(1, `rgba(${rgb},${0.9 * fade})`);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.4;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(tx, ty);
          ctx!.lineTo(x, y);
          ctx!.stroke();
          if (shot.life > 0.9) shot = null;
        }
      }
    }

    function loop(now: number) {
      paint(now);
      raf = requestAnimationFrame(loop);
    }
    repaint.current = paint;

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !reduced;
      if (running && !raf) raf = requestAnimationFrame(loop);
      if (!running && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Repaint once on change, for when the loop is not running (reduced motion or off screen).
  useEffect(() => {
    repaint.current?.(performance.now());
  }, [color, shooting]);

  const current = colors.find((c) => c.id === color)!;
  const summary = `${current.label} stars, ${shooting ? "with" : "no"} shooting stars`;

  return (
    <section id="starlight" aria-labelledby="starlight-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader
          id="starlight-title"
          title="Build your roof before we do."
          intro="Pick a star color and decide on shooting stars. This is the same G-Class from the film, so you can see how it sits in a real cabin."
        />

        <div data-in-group className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-24">
          <div data-in="wipe" className="relative col-span-12 aspect-[1088/608] overflow-hidden bg-black lg:col-span-8">
            <img
              src="/media/stills/4B-1088.webp"
              srcSet="/media/stills/4B-640.webp 640w, /media/stills/4B-1088.webp 1088w"
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt="Starlight headliner in the G-Class cabin, shown in the color you pick"
              width={1088}
              height={608}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 mix-blend-multiply transition-[background-color,opacity] duration-500"
              style={{ clipPath, backgroundColor: current.tint ?? "#ffffff", opacity: current.tint ? 1 : 0 }}
            />
            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full mix-blend-screen" />
          </div>

          <div data-in="rise" data-in-delay={250} className="col-span-12 flex flex-col lg:col-span-4">
            <fieldset>
              <legend className="text-sm text-muted">Star color</legend>
              <div className="mt-5 flex gap-6" role="radiogroup" aria-label="Star color">
                {colors.map((c) => {
                  const selected = c.id === color;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setColor(c.id);
                        track("configurator_use", { option: "color", value: c.id });
                      }}
                      className={`group flex flex-col items-center gap-3 text-sm transition-colors ${selected ? "text-ink" : "text-muted hover:text-ink"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`grid size-11 place-items-center rounded-full border transition-colors ${
                          selected ? "border-accent" : "border-transparent group-hover:border-line-strong"
                        }`}
                      >
                        <span
                          className="size-8 rounded-full"
                          style={{ background: `radial-gradient(circle at 35% 35%, #fff 0%, ${c.swatch} 38%, #000 100%)`, boxShadow: `0 0 14px ${c.swatch}55` }}
                        />
                      </span>
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex items-center justify-between border-y border-line py-5">
              <span id="shooting-label" className="text-ink">
                Shooting stars
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={shooting}
                aria-labelledby="shooting-label"
                onClick={() => {
                  setShooting((v) => !v);
                  track("configurator_use", { option: "shooting_stars", value: !shooting });
                }}
                className={`relative h-7 w-12 rounded-full border transition-colors ${shooting ? "border-accent bg-accent" : "border-line-strong bg-surface"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200 ${
                    shooting ? "left-[1.45rem] bg-bg" : "left-1 bg-muted"
                  }`}
                />
              </button>
            </div>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Your build</dt>
                <dd className="text-ink" aria-live="polite">
                  {summary}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Fitted in</dt>
                <dd className="text-ink">About 2 days</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">From</dt>
                <dd className="type-display tabular text-xl text-ink">{starlightFrom}</dd>
              </div>
            </dl>

            <div className="mt-8 lg:mt-auto">
              <QuoteCta
                location="configurator"
                service="starlight"
                note={`Starlight headliner: ${summary.toLowerCase()}.`}
                className="w-full"
              >
                Get a quote for this build
              </QuoteCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
