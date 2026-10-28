import { processSteps, site, telLink } from "@/lib/content";
import { cutoutSrc, type CutoutName } from "@/lib/cutouts";
import SectionHeader from "@/components/ui/SectionHeader";
import { QuoteCta } from "@/components/ui/Cta";

type Step = (typeof processSteps)[number];

// A tile mosaic: mixed sizes and fills, big outlined step numbers, cars breaking out of their tiles.
// Tiles scale up one after another along each row, and the cars grow out of them (PositionIn).
export default function Process() {
  const [consult, quote, build, handover] = processSteps;
  return (
    <section id="process" aria-labelledby="process-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader
          id="process-title"
          title="Four steps, no surprises."
          intro="From the first photos to the walkaround under the lights."
        />
        <div className="mt-16 grid grid-cols-1 gap-3 md:mt-24 md:grid-cols-12 md:gap-4">
          <Tile step={consult} car="rangerover" layout="side" className="bg-accent text-bg md:col-span-12 lg:col-span-7" outline="rgb(7 8 10 / 0.3)" muted="text-bg/75" />
          <Tile step={quote} delay={90} className="bg-surface text-ink md:col-span-6 lg:col-span-5" outline="rgb(237 235 230 / 0.16)" muted="text-ink/70" />
          <Tile step={build} car="urus" layout="below" className="border border-line-strong text-ink md:col-span-6 lg:col-span-4" outline="rgb(237 235 230 / 0.16)" muted="text-ink/70" />
          <Tile step={handover} delay={90} className="bg-[#1a1d22] text-ink md:col-span-6 lg:col-span-4" outline="rgb(237 235 230 / 0.16)" muted="text-ink/70" />
          <div data-in="scale" data-in-delay={180} className="flex flex-col justify-between gap-10 bg-surface p-7 md:col-span-6 md:p-9 lg:col-span-4">
            <p className="max-w-[16rem] text-lg leading-relaxed text-ink">Start step one today. A few photos is enough for a quote.</p>
            <div>
              <a href={telLink} data-track="call_click" data-track-location="process" className="type-display tabular block text-3xl text-ink hover:text-accent md:text-4xl">
                {site.phoneDisplay}
              </a>
              <div className="mt-5">
                <QuoteCta location="process" size="sm">
                  Get a quote
                </QuoteCta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({
  step,
  className,
  outline,
  muted,
  car,
  layout,
  delay = 0,
}: {
  step: Step;
  className: string;
  outline: string;
  muted: string;
  car?: CutoutName;
  layout?: "side" | "below";
  delay?: number;
}) {
  const img = car ? cutoutSrc(car) : null;
  const side = layout === "side";
  return (
    <article data-in="scale" data-in-delay={delay} className={`relative flex flex-col p-7 md:p-9 ${side ? "md:flex-row md:items-end md:gap-6" : ""} ${className}`}>
      <div className={`relative ${side ? "md:w-[40%] md:shrink-0 md:self-start" : ""}`}>
        <p aria-hidden="true" className="type-display text-outline tabular text-[5.5rem] leading-none md:text-[7rem]" style={{ "--outline": outline } as React.CSSProperties}>
          {step.n}
        </p>
        <div className="mt-6 max-w-sm">
          <p className={`text-sm ${muted}`}>{step.when}</p>
          <h3 className="type-display mt-2 text-4xl md:text-5xl">
            <span className="sr-only">Step {Number(step.n)}: </span>
            {step.title}
          </h3>
          <p className={`mt-3 leading-relaxed ${muted}`}>{step.text}</p>
        </div>
      </div>
      {img && (
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(min-width: 1024px) 34vw, 90vw"
          alt=""
          data-in="grow"
          data-in-delay={delay + 150}
          width={img.width}
          height={img.height}
          loading="lazy"
          decoding="async"
          className={`pointer-events-none relative z-10 mt-8 w-full max-w-none drop-shadow-[0_24px_28px_rgb(0_0_0/0.45)] ${
            side ? "md:-mb-16 md:-mr-14 md:mt-0 md:w-[66%]" : "md:-mb-12 md:-mr-12 md:mt-auto md:w-[calc(100%+3rem)] md:pt-10"
          }`}
        />
      )}
    </article>
  );
}
