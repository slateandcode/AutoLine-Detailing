import { buildSheet } from "@/lib/content";

// Desktop: a small spec panel top right. Mobile: one slim row under the nav so it never sits on the car.
export default function BuildSheet() {
  return (
    <aside
      data-film-sheet
      aria-label="Build sheet"
      className="film-sheet film-motion-only absolute inset-x-4 top-16 z-10 border border-line bg-bg/80 px-3 py-2.5 md:inset-x-auto md:right-10 md:top-24 md:w-[264px] md:p-5"
    >
      <div className="type-label hidden items-baseline justify-between text-muted md:flex">
        <span>Build sheet</span>
        <span className="tabular">G 500</span>
      </div>
      <ol className="flex justify-between gap-2 md:mt-4 md:block md:space-y-2.5">
        {buildSheet.map((item, i) => (
          <li
            key={item.label}
            data-sheet-item
            data-done-at={item.doneAt}
            className="group flex items-center gap-2 text-[13px] text-muted transition-colors duration-300 data-[done=true]:text-ink md:gap-3 md:text-sm"
          >
            <span className="relative grid size-3.5 shrink-0 place-items-center border border-line-strong transition-colors duration-300 group-data-[done=true]:border-accent group-data-[done=true]:bg-accent md:size-4">
              <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5 text-bg">
                <path
                  d="M2 6.4 4.7 9 10 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="[stroke-dasharray:12] [stroke-dashoffset:12] transition-[stroke-dashoffset] duration-500 group-data-[done=true]:[stroke-dashoffset:0]"
                />
              </svg>
            </span>
            <span className="tabular hidden w-5 text-[11px] text-muted md:inline">{String(i + 1).padStart(2, "0")}</span>
            <span className="md:flex-1">{item.label}</span>
            <span className="hidden text-xs text-muted md:inline">{item.spec}</span>
          </li>
        ))}
      </ol>
      <div className="mt-2.5 h-px bg-line md:mt-5">
        <div data-sheet-progress className="h-px origin-left scale-x-0 bg-accent" />
      </div>
      <div className="type-label tabular mt-2 hidden justify-between text-muted md:flex">
        <span data-sheet-count>0 / {buildSheet.length}</span>
        <span>Job 0417</span>
      </div>
    </aside>
  );
}
