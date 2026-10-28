import { work } from "@/lib/content";
import { cutoutSrc } from "@/lib/cutouts";
import SectionHeader from "@/components/ui/SectionHeader";

// The one light section: brochure spreads. A cut-out car over an oversized outlined word, with a spec strip beside it.
// Each spread's ghost word, car and copy position in together (PositionIn), the car from its own side.
// PLACEHOLDER: generated cars, not real jobs (see content.ts).
export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="cv-section relative z-[2] overflow-clip bg-paper py-28 text-paper-ink md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader tone="light" id="work-title" title="Recent builds." intro="What came in, what we did and how long it took." />

        <ul className="mt-6 md:mt-10">
          {work.map((item, i) => {
            const img = cutoutSrc(item.cutout);
            const flip = i % 2 === 1;
            return (
              <li
                key={item.car}
                data-placeholder="gallery"
                data-in-group
                className="relative grid grid-cols-12 items-center gap-x-6 gap-y-6 border-b border-paper-line py-14 last:border-b-0 md:py-20"
              >
                <p
                  data-in={flip ? "right" : "left"}
                  aria-hidden="true"
                  className={`type-display pointer-events-none absolute top-4 select-none whitespace-nowrap text-[clamp(5.5rem,19vw,19rem)] leading-none text-paper-ink/[0.07] md:top-8 ${
                    flip ? "right-0" : "left-0"
                  }`}
                >
                  {item.ghost}
                </p>

                <div data-in={flip ? "car-right" : "car-left"} className={`relative col-span-12 md:col-span-8 ${flip ? "md:order-2 md:col-start-5" : ""}`}>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[6%] bottom-[-3%] h-[16%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(14_15_17/0.42),rgb(14_15_17/0.12)_60%,transparent)]"
                  />
                  <img
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes="(min-width: 768px) 62vw, 100vw"
                    alt={item.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                    className="relative mx-auto w-full max-w-[860px]"
                  />
                </div>

                <div data-in={flip ? "left" : "right"} className={`relative col-span-12 md:col-span-4 ${flip ? "md:order-1" : ""}`}>
                  <h3 className="type-display text-[clamp(2.25rem,3.6vw,3.5rem)] text-paper-ink">{item.car}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-paper-ink/75">{item.detail}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-x-4 border-t border-paper-line pt-5">
                    <div>
                      <dt className="text-xs text-paper-muted">Service</dt>
                      <dd className="mt-1 text-sm leading-snug">{item.service}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-paper-muted">Finish</dt>
                      <dd className="mt-1 text-sm leading-snug">{item.finish}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-paper-muted">In the studio</dt>
                      <dd className="type-display tabular mt-1 text-2xl">{item.time}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
