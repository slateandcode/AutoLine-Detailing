"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { frameAt, manifest } from "@/lib/frames";
import { setFilm } from "@/lib/film-store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Timeline across the pinned track, in chapter units (0 to 4):
//   hero fades over 0.04 to 0.32 of chapter 1, its caption follows
//   each cut dips to black for 3.5% either side
//   chapter 4 plays its frames over 78% of its length, then the stage fades into the starfield
const HERO_FADE = [0.04, 0.32] as const;
const DIP = 0.035;
const LAST_PLAY = 0.78;
const END_FADE = [0.74, 0.96] as const;

export default function FilmMotion() {
  useGSAP(() => {
    const root = document.getElementById("film");
    const track = root?.querySelector<HTMLElement>("[data-film-track]");
    if (!root || !track) return;

    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const q = gsap.utils.selector(root);
    const stage = q("[data-film-stage]")[0] as HTMLElement;
    const dip = q("[data-film-dip]")[0] as HTMLElement;
    const hero = q("[data-film-hero]")[0] as HTMLElement;
    const heroScrim = q("[data-film-hero-scrim]")[0] as HTMLElement;
    const sheet = q("[data-film-sheet]")[0] as HTMLElement;
    const bar = q("[data-sheet-progress]")[0] as HTMLElement;
    const count = q("[data-sheet-count]")[0] as HTMLElement;
    const items = q("[data-sheet-item]") as HTMLElement[];
    const captions = q("[data-caption]") as HTMLElement[];
    const n = manifest.chapters.length;

    gsap.set(captions, { autoAlpha: 1 });
    captions.forEach((c) => gsap.set(c.querySelectorAll("[data-reveal]"), { yPercent: 110, autoAlpha: 0 }));
    gsap.set(sheet, { autoAlpha: 0, y: -12 });

    let active = -1;
    function showCaption(next: number) {
      if (next === active) return;
      const prev = captions[active];
      if (prev) {
        gsap.to(prev.querySelectorAll("[data-reveal]"), {
          yPercent: -70,
          autoAlpha: 0,
          duration: 0.32,
          ease: "power2.in",
          stagger: 0.03,
          overwrite: true,
        });
      }
      const el = captions[next];
      if (el) {
        gsap.fromTo(
          el.querySelectorAll("[data-reveal]"),
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: prev ? 0.12 : 0, overwrite: true },
        );
      }
      active = next;
    }

    let sheetShown = false;
    function showSheet(show: boolean) {
      if (show === sheetShown) return;
      sheetShown = show;
      gsap.to(sheet, { autoAlpha: show ? 1 : 0, y: show ? 0 : -12, duration: show ? 0.6 : 0.3, ease: show ? "expo.out" : "power2.in", overwrite: true });
    }

    let doneCount = -1;
    function update(p: number) {
      const t = p * n;
      const ch = Math.min(n - 1, Math.floor(t));
      const local = t - ch;
      const last = ch === n - 1;

      const play = last ? clamp01(local / LAST_PLAY) : local;
      const frame = frameAt(ch, play);
      const fade = last ? clamp01((local - END_FADE[0]) / (END_FADE[1] - END_FADE[0])) : 0;
      setFilm({ chapter: ch, frame, stars: fade, halfwayCh1: t > 0.5 });

      stage.style.opacity = String(1 - fade);
      const dipIn = ch > 0 ? clamp01(1 - local / DIP) : 0;
      const dipOut = !last ? clamp01((local - (1 - DIP)) / DIP) : 0;
      dip.style.opacity = String(Math.max(dipIn, dipOut));

      const h = ch === 0 ? clamp01((local - HERO_FADE[0]) / (HERO_FADE[1] - HERO_FADE[0])) : 1;
      hero.style.opacity = String(1 - h);
      hero.style.transform = `translate3d(0, ${-h * 48}px, 0)`;
      hero.style.visibility = h >= 1 ? "hidden" : "visible";
      heroScrim.style.opacity = String(1 - h * 0.7);

      let want = -1;
      if (ch === 0) want = local > HERO_FADE[1] + 0.04 && local < 1 - DIP ? 0 : -1;
      else if (last) want = local > DIP + 0.02 && local < END_FADE[0] ? ch : -1;
      else want = local > DIP + 0.02 && local < 1 - DIP ? ch : -1;
      showCaption(want);

      showSheet(t > HERO_FADE[1] && fade < 0.5);
      bar.style.transform = `scaleX(${clamp01(t / (n - 1 + LAST_PLAY))})`;

      let done = 0;
      items.forEach((item) => {
        const at = Number(item.dataset.doneAt);
        const isDone = t >= at + (at === n - 1 ? LAST_PLAY : 0.9);
        item.dataset.done = String(isDone);
        if (isDone) done++;
      });
      if (done !== doneCount) {
        doneCount = done;
        count.textContent = `${done} / ${items.length}`;
      }
    }

    ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });

  return null;
}
