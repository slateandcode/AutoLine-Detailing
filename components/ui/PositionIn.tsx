"use client";

import { useEffect } from "react";

// The site's entrances. All share the curve from the G 500 spread in Figma (node 3:13) and play once, when the part
// scrolls into view; the motions differ so sections don't all move alike. Markup opts in with attributes:
//   data-in="left" | "right"           slide in from just past that screen edge (the Figma spread)
//   data-in="car-left" | "car-right"   the same, growing from 9%, like the cut-out cars
//   data-in="grow"                     grow from 9% in place (a car riding in on a tile)
//   data-in="rise"                     come up through its own bottom edge (text)
//   data-in="wipe"                     reveal left to right
//   data-in="scale"                    grow in from 82% while fading up (tiles, big numbers)
//   data-in="zoom"                     settle from 118% (a full-bleed still inside a clipped section)
//   data-in="line"                     draw from the left (hairlines)
//   data-in="pop"                      grow from nothing (pins)
//   data-in-delay="90"                 stagger, in ms
//   data-in-group                      on a container: everything inside starts together when it enters
// Parts nested in a moving part start with it. Until then each part is parked invisible but in place, so layout, focus
// and observers see it where it will land. A unit fires ENTRANCE_END when it has landed.
export const ENTRANCE_ID = "position-in";
export const ENTRANCE_END = "positionin:end";
const DURATION = 1113; // 55.65% of the 2s Figma loop; the rest of that loop is a hold
const DURATIONS: Partial<Record<Kind, number>> = { rise: 950, scale: 950, zoom: 1800 };
const EASE = "cubic-bezier(0.42, 0, 0, 1)";
const GAP = 24; // how far past the screen edge a part starts
const CAR = 0.09;

type Kind = "left" | "right" | "car-left" | "car-right" | "grow" | "rise" | "wipe" | "scale" | "zoom" | "line" | "pop";

// The clip window stays on the resting box (plus room for overhanging glyphs) while the part moves up into it.
const RISE: Keyframe[] = [
  { transform: "translateY(115%)", clipPath: "inset(-130% -10% 100% -10%)" },
  { transform: "translateY(0)", clipPath: "inset(-15% -10% -15% -10%)" },
];
const FIXED: Partial<Record<Kind, Keyframe[]>> = {
  grow: [{ transform: `scale(${CAR})` }, { transform: "scale(1)" }],
  rise: RISE,
  wipe: [{ clipPath: "inset(-10% 110% -10% -10%)" }, { clipPath: "inset(-10% -10% -10% -10%)" }],
  scale: [{ transform: "scale(0.82)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
  zoom: [{ transform: "scale(1.18)" }, { transform: "scale(1)" }],
  line: [{ transform: "scaleX(0)", transformOrigin: "0 50%" }, { transform: "scaleX(1)", transformOrigin: "0 50%" }],
  pop: [{ transform: "scale(0)" }, { transform: "scale(1)" }],
};

// Start and end poses. Slides are worked out from the part's resting box so they start just off screen.
function keyframes(kind: Kind, r: DOMRect): Keyframe[] {
  const fixed = FIXED[kind];
  if (fixed) return fixed;
  const vw = window.innerWidth;
  const cx = r.left + r.width / 2;
  const car = kind === "car-left" || kind === "car-right";
  const fromLeft = kind === "left" || kind === "car-left";
  const half = (r.width * (car ? CAR : 1)) / 2;
  const dx = fromLeft ? -(cx + half + GAP) : vw - cx + half + GAP;
  return [{ transform: `translateX(${dx}px) scale(${car ? CAR : 1})` }, { transform: "translateX(0) scale(1)" }];
}

export default function PositionIn() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A unit is a group, or a top-level part plus the parts nested in it.
    const units = new Map<Element, HTMLElement[]>();
    for (const el of document.querySelectorAll<HTMLElement>("[data-in]")) {
      let root: Element | null = el.closest("[data-in-group]");
      if (!root) {
        root = el;
        for (let p = el.parentElement?.closest("[data-in]"); p; p = p.parentElement?.closest("[data-in]")) root = p;
      }
      units.set(root, [...(units.get(root) ?? []), el]);
    }

    const parked = new Map<Element, Animation[]>();
    units.forEach((parts, root) => {
      const anims = parts.map((el) => el.animate({ opacity: [0, 0] }, { duration: 1, fill: "forwards" }));
      anims.forEach((a) => (a.id = ENTRANCE_ID));
      parked.set(root, anims);
    });

    function land(root: Element) {
      const parts = units.get(root)!;
      parked.get(root)?.forEach((a) => a.cancel());
      const rects = parts.map((el) => el.getBoundingClientRect());
      const anims = parts.map((el, i) => {
        const kind = el.dataset.in as Kind;
        const a = el.animate(keyframes(kind, rects[i]), {
          duration: DURATIONS[kind] ?? DURATION,
          delay: Number(el.dataset.inDelay) || 0,
          easing: EASE,
          fill: "backwards",
        });
        a.id = ENTRANCE_ID;
        return a;
      });
      Promise.all(anims.map((a) => a.finished)).then(
        () => root.dispatchEvent(new Event(ENTRANCE_END, { bubbles: true })),
        () => {},
      );
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) land(e.target);
          // Already scrolled past when the page loaded (restored scroll): leave it where it is.
          else if (e.boundingClientRect.bottom < 0) parked.get(e.target)?.forEach((a) => a.cancel());
          else continue;
          parked.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    units.forEach((_, root) => io.observe(root));

    return () => {
      io.disconnect();
      parked.forEach((anims) => anims.forEach((a) => a.cancel()));
    };
  }, []);

  return null;
}
