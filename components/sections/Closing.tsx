import { closing } from "@/lib/content";
import { CallCta, QuoteCta } from "@/components/ui/Cta";

// The one loud moment after the film: a full-bleed still and a caption in the film's type, leading into the form.
// On scroll the still settles from a push-in and the caption sweeps across like the film's (PositionIn).
export default function Closing() {
  return (
    <section aria-labelledby="closing-title" className="cv-section relative z-[2] overflow-clip bg-bg">
      <div className="relative h-[82svh] min-h-[540px] md:h-[88vh]">
        <img
          src={`/media/stills/${closing.still}-1088.webp`}
          srcSet={`/media/stills/${closing.still}-640.webp 640w, /media/stills/${closing.still}-1088.webp 1088w`}
          sizes="100vw"
          alt=""
          width={1088}
          height={608}
          loading="lazy"
          decoding="async"
          data-in="zoom"
          className="absolute inset-0 size-full object-cover object-[62%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_8_10/0.97)_0%,rgb(7_8_10/0.6)_38%,rgb(7_8_10/0.15)_70%,rgb(7_8_10/0.5)_100%)]"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1440px] px-4 pb-14 md:px-10 md:pb-20">
            <h2 id="closing-title" data-in="left" className="type-caption text-[clamp(3.75rem,12vw,12rem)] text-ink">
              {closing.caption}
            </h2>
            <p data-in="rise" data-in-delay={250} className="mt-5 max-w-lg text-lg leading-relaxed text-ink/85">
              {closing.line}
            </p>
            <div data-in="rise" data-in-delay={350} className="mt-8 flex flex-wrap gap-3">
              <QuoteCta location="closing">Get a quote</QuoteCta>
              <CallCta location="closing">Call the studio</CallCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
