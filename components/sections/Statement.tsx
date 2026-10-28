import { site, statement } from "@/lib/content";

// Sits on the code-drawn starfield that the film fades into, so it has no background of its own.
// The line and sub rise into place and the stats scale up one after another (PositionIn).
export default function Statement() {
  return (
    <section id="statement" aria-labelledby="statement-title" className="relative z-[1] py-36 md:py-52">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 px-4 md:px-10">
        <h2 id="statement-title" data-in="rise" className="type-display col-span-12 text-[clamp(2.6rem,6.2vw,6rem)] text-ink text-balance lg:col-span-10">
          {statement.text}
        </h2>
        <p data-in="rise" className="col-span-12 mt-10 max-w-xl text-lg leading-relaxed text-ink/75 md:col-span-6 md:mt-14">
          {statement.sub}
        </p>
        <dl className="col-span-12 mt-16 grid grid-cols-3 md:col-span-6 md:col-start-7 md:mt-14">
          {statement.stats.map((s, i) => (
            <div key={s.label} data-in="scale" data-in-delay={i * 110} className="border-l border-line-strong pl-4 md:pl-6">
              <dt className="sr-only">{s.label}</dt>
              <dd className="type-display tabular text-4xl text-ink md:text-6xl">{s.value}</dd>
              <dd aria-hidden="true" className="mt-2 text-xs leading-snug text-muted md:text-sm">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
        <p data-in="rise" className="col-span-12 mt-20 text-sm text-muted md:mt-28">
          {site.address.area}, {site.address.city}
        </p>
      </div>
    </section>
  );
}
