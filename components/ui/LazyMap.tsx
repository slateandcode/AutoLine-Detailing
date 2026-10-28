"use client";

import { useEffect, useRef, useState } from "react";

// The Google Maps embed only loads once the section is close, so it never touches first load.
export default function LazyMap({ query, title }: { query: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative size-full bg-surface">
      {show ? (
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.4)_brightness(0.9)]"
        />
      ) : (
        <span className="type-label absolute inset-0 grid place-items-center text-muted">Map loading</span>
      )}
    </div>
  );
}
