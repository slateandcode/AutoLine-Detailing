"use client";

import { useEffect, useState } from "react";
import { quoteHref, telLink } from "@/lib/content";

// Mobile only: Call and Get a quote pinned to the bottom once the hero CTAs have scrolled away.
export default function MobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out-expo md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <a
        href={telLink}
        tabIndex={show ? 0 : -1}
        data-track="call_click"
        data-track-location="mobile_bar"
        className="flex h-14 items-center justify-center bg-bg text-sm font-medium text-ink"
      >
        Call
      </a>
      <a
        href={quoteHref}
        tabIndex={show ? 0 : -1}
        data-track="quote_click"
        data-track-location="mobile_bar"
        className="flex h-14 items-center justify-center bg-accent text-sm font-medium text-bg"
      >
        Get a quote
      </a>
    </div>
  );
}
