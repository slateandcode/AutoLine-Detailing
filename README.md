# Car studio demo (Slate & Code)

Cinematic landing page for AutoLine, a fictional car styling studio in Van Nuys, Los Angeles. Four scroll-driven film chapters of one G-Class, then a conversion page built for Google Ads.

## Run it

```bash
npm install
npm run dev        # http://localhost:9492
npm run build && npm run start
```

Ad variants: `/?s=starlight`, `wrap`, `ppf`, `ceramic`, `tint`, `detailing`. Anything else falls back to the default copy.

Environment (see `.env.example`):

- `NEXT_PUBLIC_GTM_ID`: GTM only loads when this is set.
- `NEXT_PUBLIC_SITE_URL`: used for metadata and JSON-LD.

## Where things live

- `lib/content.ts`: all copy, prices, contact details, chapters and the `?s=` variants. The studio name is `site.name`.
- `lib/fonts.ts`: the only font definitions (Archivo 75/800 and Inter Tight, self-hosted subsets in `lib/fonts/`).
- `lib/frames.ts`: frame manifest, loader and mobile crop band. `public/media/manifest.json` holds frame counts.
- `lib/track.ts`: `track(event, data)` pushes to `window.dataLayer`.
- `components/film/`: the pinned film (canvas scrub, captions, build sheet, starfield).
- `components/sections/`: everything after the film.
- `components/ui/PositionIn.tsx`: the entrance motion used after the film (from the Figma G 500 spread). Sections opt in with `data-in` attributes; the presets, timing and curve are documented at the top of the file.
- `app/api/lead/route.ts`: booking form endpoint (logs only, TODO for email or CRM).
- `CREDITS.md`: Pixara credit ledger.

## Media pipeline

Originals are in `assets/raw/` (gitignored). To rebuild frames, poster, loops, stills and the manifest:

```bash
npm run media
```

Car cut-outs (transparent PNGs from Pixara's background remover) live in `assets/raw/cutouts/`. `npm run media` trims them to the car and writes `public/media/cutouts/*.webp` plus `public/media/cutouts.json`. They're used by the service map, the Work spreads and the process tiles. The service map pins are set in `serviceMap` in `lib/content.ts`, as fractions of the G 500 cut-out.

### Enhancing the clips

1. `assets/enhance/ch1.mp4` to `ch4.mp4` are the exact cuts the site uses: no audio, 1280x720, 24fps. Chapter 1 is already trimmed to 4s (near-lossless re-encode), and chapters 2 to 4 are untouched stream copies. Regenerate them with `node scripts/process-media.mjs export`.
2. Enhance or upscale them in any tool. Keep the length, start point and 16:9 framing. Frame interpolation (higher fps) is fine.
3. Save the results as `assets/upscaled/ch1.mp4` to `ch4.mp4`. You can do one chapter or all of them.
4. Run `npm run media`. Each upscaled chapter replaces the raw one: frames go to 1600 wide, and the poster and service loops are rebuilt from it.
5. `npm run build` and check the scroll.

Chapter 1 runs 0.04s to 4s of clip 1 (see CREDITS.md). Clips 1, 3 and 4 skip their first frame, which is the reference still passed straight through and pops against the generated frames. If you change a trim, the per-chapter settings are at the top of `scripts/process-media.mjs`: `trim`, `fps`, and `focusX` / `mobileFocusX`. A `[start, end]` focus pans the phone crop across the chapter.

### How the scroll is timed

`npm run media` writes a motion curve for each chapter into the manifest, measured as SSIM between neighbouring frames. Scrolling follows that curve instead of clock time, so every bit of scroll moves the picture by a similar amount. Clip 1's camera starts slow and then accelerates; without the curve the scroll crawls and then lunges. Frames from the raw 720p clips get mild sharpening; upscaled sources don't.
