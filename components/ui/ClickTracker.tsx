"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/track";

// One delegated listener for every server-rendered CTA marked with data-track.
export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      track(el.dataset.track as TrackEvent, {
        location: el.dataset.trackLocation,
        service: el.dataset.trackService,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
