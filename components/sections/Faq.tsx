import { faqs, site, telLink } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import { QuoteCta } from "@/components/ui/Cta";

// Native details/summary: keyboard and screen reader support with no JS.
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader id="faq-title" title="Straight answers." />
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-24">
          <aside data-in="rise" className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="max-w-xs text-lg leading-relaxed text-ink">Not covered here? Ask the people who will do the work.</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <QuoteCta location="faq" size="sm">
                  Contact us
                </QuoteCta>
                <a href={telLink} data-track="call_click" data-track-location="faq" className="tabular text-sm text-ink/80 hover:text-accent">
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
          <ul data-in-group className="col-span-12 border-b border-line lg:col-span-8">
            {faqs.map((f, i) => (
              <li key={f.q} data-in="wipe" data-in-delay={i * 80} className="border-t border-line">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg text-ink transition-colors hover:text-accent md:text-xl">
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="faq-plus relative size-4 shrink-0 transition-transform duration-300">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 leading-relaxed text-ink/75">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
