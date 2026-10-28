"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice, serviceMap, services, type ServiceId } from "@/lib/content";
import { cutoutSrc } from "@/lib/cutouts";
import LoopVideo from "@/components/ui/LoopVideo";
import { QuoteCta } from "@/components/ui/Cta";
import SectionHeader from "@/components/ui/SectionHeader";
import { ENTRANCE_END, ENTRANCE_ID } from "@/components/ui/PositionIn";

const car = cutoutSrc("g500");
const pad = (n: number) => String(n).padStart(2, "0");

// Every service pinned to the part of the finished G 500 it covers. Pick a pin or a tab to open that service;
// on large screens a hairline runs from the pin to its details, like a spec callout.
// On scroll the word wipes on, the car drives in growing, the pins pop on as it lands and the details and price tabs
// rise in (PositionIn).
export default function ServiceMap({ initial }: { initial: ServiceId | null }) {
  const [active, setActive] = useState<ServiceId>(initial ?? "wrap");
  const [line, setLine] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pins = useRef<Partial<Record<ServiceId, HTMLButtonElement | null>>>({});
  const tabs = useRef<Partial<Record<ServiceId, HTMLButtonElement | null>>>({});
  const index = services.findIndex((s) => s.id === active);
  const current = services[index];
  const map = serviceMap[active];

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const wrap = wrapRef.current;
      const pin = pins.current[active];
      const panel = panelRef.current;
      // No callout while the stage is still parked or sliding in; it is drawn when the entrance lands.
      const entering = wrap?.getAnimations({ subtree: true }).some((a) => a.id === ENTRANCE_ID);
      if (!wrap || !pin || !panel || !wide.matches || entering) return setLine(null);
      const w = wrap.getBoundingClientRect();
      const p = pin.getBoundingClientRect();
      const t = panel.getBoundingClientRect();
      const x1 = p.left + p.width / 2 - w.left;
      const y1 = p.top + p.height / 2 - w.top;
      const x3 = t.left - w.left - 16;
      const y3 = t.top - w.top + 10;
      const x2 = Math.max(x1 + 24, x3 - 56);
      setLine(`M${x1},${y1} L${x2},${y3} L${x3},${y3}`);
    };
    measure();
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(measure);
    if (wrap) ro.observe(wrap);
    wrap?.addEventListener(ENTRANCE_END, measure);
    wide.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      wrap?.removeEventListener(ENTRANCE_END, measure);
      wide.removeEventListener("change", measure);
    };
  }, [active]);

  function onTabKey(e: React.KeyboardEvent) {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = services[(index + step + services.length) % services.length].id;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="services" aria-labelledby="services-title" className="cv-section relative z-[2] overflow-clip bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader
          id="services-title"
          title="Everything we do, on one car."
          intro="Pick a point on the G 500 to see what we fit there, what it costs and how long it takes."
        />

        <div ref={wrapRef} className="relative mt-12 md:mt-16">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden size-full overflow-visible lg:block">
            {line && <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
          </svg>

          <div data-in-group className="grid grid-cols-12 gap-x-6 gap-y-12 lg:items-center">
            {/* Stage: outlined word behind, spotlit floor, the car and its pins */}
            <div className="relative col-span-12 py-10 lg:col-span-8 lg:py-16">
              <p
                key={map.ghost}
                data-in="wipe"
                aria-hidden="true"
                className="swap-in type-display text-outline pointer-events-none absolute inset-x-0 top-0 select-none whitespace-nowrap text-center text-[clamp(4.5rem,15vw,14rem)] leading-none [--outline:rgb(237_235_230/0.22)] lg:-top-2"
              >
                {map.ghost}
              </p>
              <div
                aria-hidden="true"
                className="absolute inset-x-[2%] bottom-[2%] h-[34%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(237_235_230/0.13),rgb(237_235_230/0.04)_55%,transparent)]"
              />
              <div data-in="car-left" className="relative mx-auto w-[94%]" style={{ aspectRatio: `${car.width} / ${car.height}` }}>
                <img
                  src={car.src}
                  srcSet={car.srcSet}
                  sizes="(min-width: 1024px) 60vw, 94vw"
                  alt="The finished G 500 in satin black, side view"
                  width={car.width}
                  height={car.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-contain"
                />
                {services.map((s, i) => {
                  const on = s.id === active;
                  const m = serviceMap[s.id];
                  return (
                    <button
                      key={s.id}
                      ref={(el) => {
                        pins.current[s.id] = el;
                      }}
                      type="button"
                      data-in="pop"
                      data-in-delay={600 + i * 80}
                      aria-label={`${s.name}, ${m.part.toLowerCase()}`}
                      aria-pressed={on}
                      onClick={() => setActive(s.id)}
                      className="group absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center"
                      style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-1 rounded-full border transition-colors ${on ? "border-accent" : "border-ink/45 group-hover:border-ink"}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`tabular relative grid size-6 place-items-center rounded-full text-[11px] font-medium transition-colors ${
                          on ? "bg-accent text-bg" : "bg-bg/80 text-ink group-hover:bg-ink group-hover:text-bg"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details for the picked service. All six are in the page; the rest are hidden. */}
            <div ref={panelRef} data-in="rise" data-in-delay={300} className="col-span-12 lg:col-span-4">
              {services.map((s, i) => {
                const on = s.id === active;
                return (
                  <div key={s.id} id={`service-panel-${s.id}`} role="tabpanel" aria-labelledby={`service-tab-${s.id}`} hidden={!on} className={on ? "swap-in" : undefined}>
                    <p className="flex items-baseline gap-3 text-sm text-muted">
                      <span className="tabular text-accent">{pad(i + 1)}</span>
                      {serviceMap[s.id].part}
                      {s.id === initial && <span className="ml-auto text-accent">From your search</span>}
                    </p>
                    <h3 className="type-display mt-3 text-[clamp(2.5rem,4vw,3.75rem)] text-ink">{s.name}</h3>
                    <p className="mt-4 leading-relaxed text-ink/75">
                      {s.lines[0]} {s.lines[1]}
                    </p>
                    <div className="relative mt-6 aspect-[16/10] overflow-hidden bg-surface">
                      <LoopVideo name={s.loop} />
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-line pt-5">
                      <div>
                        <dt className="text-sm text-muted">From</dt>
                        <dd className="type-display tabular mt-1 text-3xl text-ink">{formatPrice(s.from)}</dd>
                        <dd className="text-sm text-muted">{s.priceNote}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">In the studio</dt>
                        <dd className="mt-1 text-lg text-ink">{s.time}</dd>
                      </div>
                    </dl>
                    <div className="mt-6">
                      <QuoteCta location="service_map" service={s.id} size="sm" ariaLabel={`Get a quote for ${s.name.toLowerCase()}`}>
                        Get a quote
                      </QuoteCta>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The same six as tabs, with starting prices: the price guide. */}
          <div
            id="pricing"
            role="tablist"
            aria-label="Services and starting prices"
            onKeyDown={onTabKey}
            className="mt-14 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:mt-16 lg:grid-cols-6"
          >
            {services.map((s, i) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[s.id] = el;
                  }}
                  id={`service-tab-${s.id}`}
                  type="button"
                  role="tab"
                  data-in="rise"
                  data-in-delay={i * 70}
                  aria-selected={on}
                  aria-controls={`service-panel-${s.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  className={`relative border-b border-line py-5 pr-4 text-left transition-colors lg:border-b-0 ${
                    on ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span aria-hidden="true" className={`absolute inset-x-0 -top-px h-px ${on ? "bg-accent" : "bg-transparent"}`} />
                  <span className="tabular block text-xs text-accent">{pad(i + 1)}</span>
                  <span className="mt-2 block text-[15px]">{s.name}</span>
                  <span className="type-display tabular mt-1 block text-xl">
                    <span className="sr-only">from </span>
                    {formatPrice(s.from)}
                  </span>
                </button>
              );
            })}
          </div>
          <p data-in="rise" className="mt-6 text-sm text-muted">Starting prices for a mid-size car. Every job gets a fixed quote in writing first.</p>
        </div>
      </div>
    </section>
  );
}
