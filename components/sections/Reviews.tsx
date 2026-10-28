import { reviews, reviewSummary, trust } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";

const rating = trust.find((t) => t.label === "Google rating")?.value;

export default function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader id="reviews-title" title="What customers say." />
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-24">
          <div data-in-group className="col-span-12 lg:col-span-4">
            <p data-in="scale" className="type-display tabular origin-bottom-left text-[clamp(6rem,14vw,11rem)] leading-[0.8] text-ink">
              {rating}
            </p>
            <p data-in="rise" data-in-delay={150} className="mt-5 text-ink/80">
              Google rating from {reviewSummary.count} reviews
            </p>
            <a
              data-in="rise"
              data-in-delay={230}
              href={reviewSummary.url}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
            >
              Read them on Google
            </a>
          </div>
          <ul className="col-span-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:col-span-8">
            {reviews.map((r, i) => (
              <li key={r.name} data-in="rise" data-in-delay={(i % 2) * 110} className="flex flex-col border-t border-line pt-6">
                <blockquote className="text-lg leading-relaxed text-ink">
                  <p>&ldquo;{r.text}&rdquo;</p>
                </blockquote>
                <p className="mt-auto pt-6 text-sm">
                  <span className="text-ink">{r.name}</span>
                  <span className="text-muted">, {r.car}. {r.service}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
