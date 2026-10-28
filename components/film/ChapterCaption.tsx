type Props = { index: number; total: number; label: string; caption: string; line: string };

// Real text, server-rendered. The motion layer slides each line up through its mask.
export default function ChapterCaption({ index, total, label, caption, line }: Props) {
  const n = (v: number) => String(v).padStart(2, "0");
  return (
    <div
      data-caption={index}
      className="film-caption film-motion-only pointer-events-none absolute inset-x-0 bottom-0 z-10"
    >
      {/* Mobile: clears the sticky Call / Get a quote bar (56px) that is showing by the time captions appear. */}
      <div className="mx-auto max-w-[1440px] px-4 pb-[calc(56px+1.5rem+env(safe-area-inset-bottom))] md:px-10 md:pb-14">
        <span className="block overflow-hidden">
          <span data-reveal className="type-label tabular block text-accent">
            {n(index + 1)} / {n(total)} &nbsp;{label}
          </span>
        </span>
        <span className="mt-3 block overflow-hidden pr-[0.12em] pb-[0.06em]">
          <span data-reveal className="type-caption block text-[clamp(3rem,9vw,9.5rem)] text-ink text-balance md:max-w-[16ch]">
            {caption}
          </span>
        </span>
        <span className="mt-4 block overflow-hidden">
          <span data-reveal className="block max-w-md text-[15px] text-ink/85 md:text-lg">
            {line}
          </span>
        </span>
      </div>
    </div>
  );
}
