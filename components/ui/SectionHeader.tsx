type Props = { id: string; title: string; intro?: string; tone?: "dark" | "light"; children?: React.ReactNode };

// Title left, intro set against it on the right, one hairline above. No eyebrow labels: the nav already names the sections.
// On scroll the hairline draws in and the title, then the intro, rise into place (PositionIn).
export default function SectionHeader({ id, title, intro, tone = "dark", children }: Props) {
  const light = tone === "light";
  return (
    <div data-in-group className="relative grid grid-cols-12 gap-x-6 gap-y-6 pt-8 md:pt-10">
      <span aria-hidden="true" data-in="line" className={`absolute inset-x-0 top-0 h-px ${light ? "bg-paper-line" : "bg-line"}`} />
      <h2
        id={id}
        data-in="rise"
        className={`type-display col-span-12 text-[clamp(2.75rem,6vw,5.5rem)] text-balance lg:col-span-7 ${light ? "text-paper-ink" : "text-ink"}`}
      >
        {title}
      </h2>
      {(intro || children) && (
        <div data-in="rise" data-in-delay={140} className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
          {intro && (
            <p className={`max-w-md text-[17px] leading-relaxed ${light ? "text-paper-ink/75" : "text-ink/75"}`}>{intro}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
