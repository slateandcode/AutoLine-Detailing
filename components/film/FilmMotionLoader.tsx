"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// GSAP, ScrollTrigger and Lenis arrive in their own chunk after hydration, outside the initial JS budget.
const FilmMotion = dynamic(() => import("./FilmMotion"), { ssr: false });

export default function FilmMotionLoader() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return enabled ? <FilmMotion /> : null;
}
