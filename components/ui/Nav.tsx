"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { QuoteCta } from "./Cta";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-bg/95" : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip the film
      </a>
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:h-16 md:px-10">
        <a href="#film" className="type-caption text-xl tracking-wide text-ink md:text-2xl">
          {site.name}
        </a>
        <ul className="hidden items-center gap-9 text-sm text-ink/80 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <QuoteCta location="nav" size="sm" variant={solid ? "solid" : "outline"}>
          Contact
        </QuoteCta>
      </nav>
    </header>
  );
}
