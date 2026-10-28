import data from "@/public/media/cutouts.json";

// Transparent car cut-outs made by scripts/process-media.mjs (cutouts task), trimmed to the car's bounds.
export type CutoutName = "g500" | "rangerover" | "urus" | "cullinan";

export const cutouts = data as Record<CutoutName, { width: number; height: number }>;

export const cutoutSrc = (name: CutoutName) => ({
  src: `/media/cutouts/${name}-full.webp`,
  srcSet: `/media/cutouts/${name}-640.webp 640w, /media/cutouts/${name}-full.webp ${cutouts[name].width}w`,
  width: cutouts[name].width,
  height: cutouts[name].height,
});
