import { site } from "@/lib/content";

const links = [
  { href: "#services", label: "Services" },
  { href: "#starlight", label: "Starlight" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#booking", label: "Book" },
];

export default function Footer() {
  return (
    <footer className="relative z-[2] overflow-x-clip border-t border-line bg-bg pb-28 pt-16 md:pb-14">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-4 md:px-10">
        <div data-in="wipe" className="col-span-12 md:col-span-5">
          <p className="type-caption text-5xl text-ink md:text-6xl">{site.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Wraps, PPF, ceramic coating, window tint and starlight headliners. {site.address.area}, {site.address.city}.
          </p>
        </div>
        <nav aria-label="Footer" data-in="rise" data-in-delay={120} className="col-span-6 md:col-span-3 md:col-start-7">
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink/80 hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-in="rise" data-in-delay={200} className="col-span-6 space-y-2 text-sm md:col-span-3">
          <a href={`tel:${site.phoneE164}`} data-track="call_click" data-track-location="footer" className="tabular block text-ink/80 hover:text-accent">
            {site.phoneDisplay}
          </a>
          {site.hours.map((h) => (
            <p key={h.label} className="text-muted">
              {h.label}: {h.display}
            </p>
          ))}
        </div>
        <div className="col-span-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
          <span>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Website by Slate &amp; Code</span>
        </div>
      </div>
    </footer>
  );
}
