import manifestJson from "@/public/media/manifest.json";

// A single value, or [start, end] to pan the crop across the chapter.
export type Focus = number | [number, number];

export type ChapterFrames = {
  id: string;
  frames: number;
  fps: number;
  focusX: Focus;
  mobileFocusX: Focus;
  // Where each frame sits along the chapter (0 to 1), by amount of visual change. See motionCurve in scripts/process-media.mjs.
  curve?: number[];
};

export type FrameManifest = { width: number; height: number; chapters: ChapterFrames[] };

export const manifest = manifestJson as FrameManifest;

// Frame to show at a point in the chapter (0 to 1). With a motion curve, equal scroll gives equal visual change.
export function frameAt(chapter: number, t: number) {
  const c = manifest.chapters[chapter];
  const last = Math.max(0, c.frames - 1);
  const curve = c.curve;
  if (!curve || curve.length !== c.frames) return Math.round(t * last);
  let lo = 0;
  let hi = last;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (curve[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  return lo > 0 && t - curve[lo - 1] < curve[lo] - t ? lo - 1 : lo;
}

// Focus at a point in the chapter, 0 (first frame) to 1 (last frame).
export function focusAt(focus: Focus, t: number) {
  return typeof focus === "number" ? focus : focus[0] + (focus[1] - focus[0]) * t;
}

export const frameSrc = (chapter: number, index: number) =>
  `/media/frames/ch${chapter + 1}/${String(index + 1).padStart(3, "0")}.webp`;

// On tall screens the frame sits in a band near the top so more of the car stays in shot.
// Keep in sync with .film-frame-rect in Film.tsx.
export const MOBILE_QUERY = "(max-aspect-ratio: 4/5)";
export const MOBILE_RECT = { top: 0.07, height: 0.66 };

// Coarse to fine: every 8th frame first, so an early scrub already has something close to show.
function loadOrder(n: number) {
  const seen = new Uint8Array(n);
  const order: number[] = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < n; i += step) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  if (n && !seen[n - 1]) order.push(n - 1);
  return order;
}

export class FrameLoader {
  private images: (HTMLImageElement | null)[][];
  private started = new Set<number>();
  constructor(private onLoad: (chapter: number, index: number) => void) {
    this.images = manifest.chapters.map((c) => new Array(c.frames).fill(null));
  }

  load(chapter: number, concurrency = 6): Promise<void> {
    if (this.started.has(chapter) || !manifest.chapters[chapter]) return Promise.resolve();
    this.started.add(chapter);
    const queue = loadOrder(manifest.chapters[chapter].frames);
    const next = (): Promise<void> => {
      const index = queue.shift();
      if (index === undefined) return Promise.resolve();
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(chapter, index);
      return img
        .decode()
        .then(() => {
          this.images[chapter][index] = img;
          this.onLoad(chapter, index);
        })
        .catch(() => undefined)
        .then(next);
    };
    return Promise.all(Array.from({ length: concurrency }, next)).then(() => undefined);
  }

  // Exact frame if loaded, otherwise the nearest loaded neighbour in the same chapter.
  get(chapter: number, index: number): HTMLImageElement | null {
    const list = this.images[chapter];
    if (!list) return null;
    if (list[index]) return list[index];
    for (let d = 1; d < list.length; d++) {
      if (list[index - d]) return list[index - d];
      if (list[index + d]) return list[index + d];
    }
    return null;
  }
}
