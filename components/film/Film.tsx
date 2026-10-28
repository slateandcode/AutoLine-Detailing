import { preload } from "react-dom";
import { chapters, site, trust, type Variant } from "@/lib/content";
import { focusAt, manifest } from "@/lib/frames";
import { CallCta, QuoteCta } from "@/components/ui/Cta";
import ChapterCaption from "./ChapterCaption";
import BuildSheet from "./BuildSheet";
import FrameCanvas from "./FrameCanvas";
import FilmMotionLoader from "./FilmMotionLoader";

// Runs inline during HTML parse: brings the poster up from dark once it has loaded. Never holds back paint.
const lightsOn = `(function(){var i=document.getElementById('poster');if(!i)return;var go=function(){i.classList.add('is-lit')};if(i.complete&&i.naturalWidth)go();else{i.addEventListener('load',go);i.addEventListener('error',go)}})();`;

const ch1 = manifest.chapters[0];

export default function Film({ variant }: { variant: Variant }) {
  preload("/media/poster-ch1.avif", { as: "image", fetchPriority: "high", type: "image/avif" });

  return (
    <section id="film" aria-label="The build: one G-Class, four chapters" className="relative z-[1]">
      <noscript>
        <style>{`.film-track{height:auto!important}.film-motion-only{display:none!important}.film-static{display:block!important}.poster-img{filter:none!important}`}</style>
      </noscript>

      <div data-film-track className="film-track relative h-[400svh] md:h-[500vh]">
        {/* Leaves the viewport once the hero has faded; the mobile call bar watches it. */}
        <div id="hero-sentinel" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[45svh]" />

        <div className="film-sticky sticky top-0 h-[100svh] w-full overflow-hidden">
          <div data-film-stage className="absolute inset-0">
            <div
              className="film-frame-rect absolute inset-0 overflow-hidden"
              style={{ "--fx": `${focusAt(ch1.focusX, 0) * 100}%`, "--fx-m": `${focusAt(ch1.mobileFocusX, 0) * 100}%` } as React.CSSProperties}
            >
              <picture>
                <source srcSet="/media/poster-ch1.avif" type="image/avif" />
                <img
                  id="poster"
                  src="/media/poster-ch1.webp"
                  alt=""
                  width={manifest.width}
                  height={manifest.height}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  suppressHydrationWarning
                  className="poster-img size-full object-cover"
                />
              </picture>
              <script dangerouslySetInnerHTML={{ __html: lightsOn }} />
            </div>
            <FrameCanvas />
            <div aria-hidden="true" className="film-frame-rect film-rect-fade pointer-events-none absolute inset-0" />
            <div data-film-dip aria-hidden="true" className="film-motion-only absolute inset-0 bg-black opacity-0" />
          </div>

          {/* Scrims keep the overlay text at AA contrast over bright reflections. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(7_8_10/0.96)_0%,rgb(7_8_10/0.7)_28%,rgb(7_8_10/0)_52%)] md:bg-[linear-gradient(to_top,rgb(7_8_10/0.92)_0%,rgb(7_8_10/0.55)_30%,rgb(7_8_10/0)_58%)]"
          />
          <div
            data-film-hero-scrim
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 md:bg-[linear-gradient(to_right,rgb(7_8_10/0.7)_0%,rgb(7_8_10/0.28)_40%,rgb(7_8_10/0)_62%)]"
          />

          <div data-film-hero className="absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-10 md:pb-14">
              <div className="col-span-12 md:col-span-9 lg:col-span-7">
                <p className="type-label text-accent">
                  {site.address.area}, {site.address.city}
                </p>
                <h1 className="type-caption mt-3 text-[clamp(2.4rem,7vw,6.25rem)] text-ink text-balance md:mt-4">{variant.h1}</h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/85 md:mt-5 md:text-lg">{variant.sub}</p>
                <div id="hero-ctas" className="mt-6 flex gap-2.5 md:mt-7 md:gap-3">
                  <QuoteCta location="hero" service={variant.highlight ?? undefined} className="max-md:px-5">
                    {variant.cta}
                  </QuoteCta>
                  <CallCta location="hero" className="max-md:px-5">
                    <span>
                      Call<span className="hidden md:inline"> the studio</span>
                    </span>
                  </CallCta>
                </div>
                <dl className="mt-8 grid max-w-md grid-cols-3 border-t border-line pt-4 md:mt-10">
                  {trust.map((t) => (
                    <div key={t.label} className="border-l border-line pl-3 first:border-l-0 first:pl-0">
                      <dt className="sr-only">{t.label}</dt>
                      <dd className="type-display tabular text-2xl text-ink md:text-3xl">{t.value}</dd>
                      <dd aria-hidden="true" className="mt-1 text-xs text-muted">{t.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {chapters.map((c, i) => (
            <ChapterCaption key={c.id} index={i} total={chapters.length} label={c.label} caption={c.caption} line={c.line} />
          ))}

          <BuildSheet />
        </div>
      </div>

      {/* Reduced motion and no-JS: the four chapters as stills, no pinning. */}
      <div className="film-static relative bg-bg">
        <ol className="mx-auto grid max-w-[1440px] gap-16 px-4 py-24 md:px-10">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <figure>
                <img
                  src={`/media/stills/${c.still}-1088.webp`}
                  srcSet={`/media/stills/${c.still}-640.webp 640w, /media/stills/${c.still}-1088.webp 1088w`}
                  sizes="(min-width: 1440px) 1360px, 100vw"
                  alt={c.alt}
                  width={1088}
                  height={608}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
                <figcaption className="mt-6">
                  <span className="type-label tabular text-muted">
                    {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} {c.label}
                  </span>
                  <span className="type-caption mt-2 block text-5xl md:text-7xl">{c.caption}</span>
                  <span className="mt-3 block text-ink/80">{c.line}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <FilmMotionLoader />
    </section>
  );
}
