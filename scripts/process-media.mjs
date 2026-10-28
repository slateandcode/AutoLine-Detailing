// Media pipeline (ffmpeg, no credits).
// Usage: node scripts/process-media.mjs [frames|poster|loops|stills|manifest|all|export] [chapter numbers...]
// Uses assets/upscaled/chN.mp4 when present, otherwise assets/raw/clips/chN.mp4.
// "export" writes the exact cuts the site uses to assets/enhance/ for upscaling; it is not part of "all".
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const raw = join(root, "assets/raw");
const upscaled = join(root, "assets/upscaled");
const out = join(root, "public/media");

// trim: [start, end] in seconds of the source clip that the chapter uses; end null runs to the end.
// focusX / mobileFocusX: horizontal alignment (0 left, 1 right) for cover cropping.
// A [start, end] pair pans the crop across the chapter, for shots where the car drifts in frame.
// Clips 1, 3 and 4 open on their reference still, which pops against the generated frames after it,
// so they start at the first generated frame.
const FIRST_GENERATED = 0.04;
const chapters = [
  // Clip 1 is trimmed at 4s: a driver appears behind the windscreen after that. The front wheels read as steered from about 3s.
  // On phones the crop pans left with the push-in so the grille stays in shot.
  { n: 1, id: "arrival", trim: [FIRST_GENERATED, 4], fps: 20, focusX: 0.5, mobileFocusX: [0.55, 0.22] },
  { n: 2, id: "wrap", trim: null, fps: 15, focusX: 0.5, mobileFocusX: 0.5 },
  { n: 3, id: "protection", trim: [FIRST_GENERATED, null], fps: 15, focusX: 0.5, mobileFocusX: 0.45 },
  { n: 4, id: "starlight", trim: [FIRST_GENERATED, null], fps: 15, focusX: 0.5, mobileFocusX: 0.5 },
];

// Mild sharpening offsets the softness of stretching 720p across a full screen. Upscaled sources are left alone.
const SHARPEN = "unsharp=5:5:0.55:5:5:0";

// Service loops: 3 to 4 second cuts. speed < 1 slows a short cut down.
const loops = [
  // Each service shows one of the four cars: G-Class wrap, Urus PPF, Cullinan ceramic, G-Class cabin starlight,
  // Range Rover tint, G-Class bonnet detailing. The service clips start after Ray's pass-through first frame.
  { name: "wrap", ch: 2, start: 0.6, dur: 3.8 },
  { name: "ppf", clip: "urus", start: 1.0, dur: 3.8 },
  { name: "ceramic", clip: "cullinan", start: 1.0, dur: 3.8 },
  { name: "starlight", ch: 4, start: 1.2, dur: 3.8 },
  { name: "tint", clip: "rangerover", start: 1.0, dur: 3.8, crf: 24 }, // more camera movement, so a touch more compression keeps it under 1.5 MB
  { name: "detailing", ch: 3, start: 0.4, dur: 3.6 },
  // Fallback if a car clip is ever unusable: a slow push-in from the still that plays forward then back.
  // { name: "detailing", still: "cullinan", dur: 4 },
];

const stills = ["master", "2A", "2B", "3", "4A", "4B", "rangerover", "urus", "cullinan"];

const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const ensure = (dir) => mkdirSync(dir, { recursive: true });
const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;

const duration = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

function source(n) {
  const up = join(upscaled, `ch${n}.mp4`);
  if (existsSync(up)) return { file: up, width: 1600, upscaled: true };
  return { file: join(raw, "clips", `ch${n}.mp4`), width: 1280, upscaled: false };
}

// An upscale of an assets/enhance export is already cut, so the trim only applies when the source is full length.
function trimArgs(c, src) {
  if (!c.trim) return [];
  const [start, end] = c.trim;
  if (src.upscaled && duration(src.file) < duration(join(raw, "clips", `ch${c.n}.mp4`)) - 0.02) return [];
  return ["-ss", String(start), ...(end == null ? [] : ["-t", String(end - start)])];
}

const pictureFilter = (src) => `scale=${src.width}:-2${src.upscaled ? "" : `,${SHARPEN}`}`;

function frames(only) {
  for (const c of chapters) {
    if (only.length && !only.includes(c.n)) continue;
    const src = source(c.n);
    if (!existsSync(src.file)) {
      console.log(`ch${c.n}: no clip yet, skipped`);
      continue;
    }
    const dir = join(out, "frames", `ch${c.n}`);
    rmSync(dir, { recursive: true, force: true });
    ensure(dir);
    ff([...trimArgs(c, src), "-i", src.file, "-vf", `fps=${c.fps},${pictureFilter(src)}`, "-c:v", "libwebp", "-quality", "88", "-compression_level", "6", join(dir, "%03d.webp")]);
    const files = readdirSync(dir);
    const total = files.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
    console.log(`ch${c.n}: ${files.length} frames, ${(total / 1048576).toFixed(1)} MB`);
  }
}

// Same first frame as ch1/001.webp, so the canvas takes over without a shift. Unsharpened on purpose:
// sharpening adds ~25% to the AVIF, which is the LCP image, and the sharpened frame fades in over it after load.
function poster() {
  const src = source(1);
  const input = [...trimArgs(chapters[0], src), "-i", src.file, "-frames:v", "1"];
  const scale = `scale=${src.width}:-2`;
  ensure(out);
  const avif = join(out, "poster-ch1.avif");
  const webp = join(out, "poster-ch1.webp");
  ff([...input, "-vf", `${scale},format=yuv420p`, "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "40", "-cpu-used", "4", avif]);
  ff([...input, "-vf", scale, "-c:v", "libwebp", "-quality", "85", webp]);
  console.log(`poster: avif ${kb(avif)}, webp ${kb(webp)}`);
}

function loopCuts(only) {
  const dir = join(out, "loops");
  ensure(dir);
  for (const l of loops) {
    if (only.length && !only.includes(l.ch)) continue;
    let input;
    let vf;
    if (l.still) {
      const png = join(raw, `${l.still}.png`);
      if (!existsSync(png)) continue;
      // Half the loop pushes in 3.5%, the other half is the same frames reversed. Upscaling first keeps zoompan from jittering.
      const half = Math.round((l.dur / 2) * 24);
      input = ["-loop", "1", "-framerate", "24", "-t", String(l.dur / 2), "-i", png];
      vf = `scale=2560:-2,zoompan=z='1+0.035*on/${half - 1}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p`;
    } else if (l.clip) {
      // A service-only clip (not a film chapter), e.g. assets/raw/clips/cullinan.mp4, or its upscale if present.
      const up = join(upscaled, `${l.clip}.mp4`);
      const file = existsSync(up) ? up : join(raw, "clips", `${l.clip}.mp4`);
      if (!existsSync(file)) {
        console.log(`${l.name}: ${l.clip}.mp4 missing, skipped`);
        continue;
      }
      vf = "scale=1280:-2,format=yuv420p";
      input = ["-ss", String(l.start), "-t", String(l.dur), "-i", file];
    } else {
      const src = source(l.ch);
      if (!existsSync(src.file)) {
        console.log(`${l.name}: ch${l.ch} missing, skipped`);
        continue;
      }
      const filters = [];
      if (l.speed) filters.push(`setpts=PTS/${l.speed}`);
      if (l.mirror) filters.push("hflip");
      filters.push("scale=1280:-2", "format=yuv420p");
      vf = filters.join(",");
      input = ["-ss", String(l.start), "-t", String(l.dur), "-i", src.file];
    }
    const mp4 = join(dir, `${l.name}.mp4`);
    const webm = join(dir, `${l.name}.webm`);
    const jpg = join(dir, `${l.name}.webp`);
    ff([...input, "-an", "-vf", vf, "-c:v", "libx264", "-crf", String(l.crf ?? 20), "-preset", "slow", "-tune", "film", "-profile:v", "high", "-movflags", "+faststart", mp4]);
    ff([...input, "-an", "-vf", vf, "-c:v", "libvpx-vp9", "-crf", String((l.crf ?? 20) + 10), "-b:v", "0", "-deadline", "good", "-cpu-used", "2", "-row-mt", "1", webm]);
    ff([...input, "-frames:v", "1", "-vf", vf.replace("scale=1280:-2", "scale=960:-2"), "-c:v", "libwebp", "-quality", "85", jpg]);
    console.log(`${l.name}: mp4 ${kb(mp4)}, webm ${kb(webm)}, poster ${kb(jpg)}`);
  }
}

function stillImages() {
  const dir = join(out, "stills");
  ensure(dir);
  for (const s of stills) {
    const png = join(raw, `${s}.png`);
    if (!existsSync(png)) continue;
    for (const w of [1088, 640]) {
      const f = join(dir, `${s}-${w}.webp`);
      ff(["-i", png, "-vf", `scale=${w}:-2`, "-c:v", "libwebp", "-quality", "88", f]);
    }
    console.log(`still ${s}: ${kb(join(dir, `${s}-1088.webp`))}`);
  }
}

// Scroll position to frame follows how much the picture changes, not clock time, so a camera that eases in
// does not crawl and then lunge. Change between neighbouring frames is measured as 1 - SSIM.
// curve[i] is where frame i sits along the chapter (0 to 1): 90% visual change, 10% time, so near-static
// stretches still get a little scroll.
function motionCurve(dir, fps, count) {
  if (count < 2) return undefined;
  const seq = ["-framerate", String(fps), "-i", join(dir, "%03d.webp")];
  const r = spawnSync(
    "ffmpeg",
    ["-hide_banner", ...seq, ...seq, "-filter_complex", "[1:v]trim=start_frame=1,setpts=PTS-STARTPTS[b];[0:v][b]ssim=stats_file=-", "-f", "null", "-"],
    { encoding: "utf8" },
  );
  // ffmpeg repeats the shorter input's last frame, so there is one extra comparison at the end to drop.
  const steps = [...r.stdout.matchAll(/All:([0-9.]+)/g)].map((m) => Math.max(0, 1 - Number(m[1]))).slice(0, count - 1);
  if (steps.length !== count - 1) return undefined;
  const total = steps.reduce((a, b) => a + b, 0);
  let acc = 0;
  const cum = [0, ...steps.map((s) => (acc += s))];
  return cum.map((v, i) => Number((0.9 * (total ? v / total : i / (count - 1)) + 0.1 * (i / (count - 1))).toFixed(4)));
}

function manifest() {
  const list = chapters.map((c) => {
    const dir = join(out, "frames", `ch${c.n}`);
    const count = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".webp")).length : 0;
    const curve = count ? motionCurve(dir, c.fps, count) : undefined;
    return { id: c.id, frames: count, fps: c.fps, focusX: c.focusX, mobileFocusX: c.mobileFocusX, curve };
  });
  const width = existsSync(join(upscaled, "ch1.mp4")) ? 1600 : 1280;
  const data = { width, height: Math.round((width * 9) / 16), chapters: list };
  writeFileSync(join(out, "manifest.json"), JSON.stringify(data, null, 2) + "\n");
  console.log("manifest:", list.map((c) => `${c.id} ${c.frames}`).join(", "));
}

// The exact cut each chapter uses, from the raw Pixara clip, without audio, ready for an upscaler.
// Trimmed clips are re-encoded near-losslessly (CRF 10) to cut on the exact frame; untrimmed ones are stream-copied.
// Upscaled files go back in as assets/upscaled/chN.mp4. trimArgs sees they are shorter than the raw clip
// and does not cut them again.
function exportForEnhance(only) {
  const dir = join(root, "assets/enhance");
  ensure(dir);
  for (const c of chapters) {
    if (only.length && !only.includes(c.n)) continue;
    const src = join(raw, "clips", `ch${c.n}.mp4`);
    if (!existsSync(src)) continue;
    const dest = join(dir, `ch${c.n}.mp4`);
    if (c.trim) {
      ff([...trimArgs(c, { upscaled: false }), "-i", src, "-an", "-c:v", "libx264", "-crf", "10", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dest]);
    } else {
      ff(["-i", src, "-an", "-c:v", "copy", "-movflags", "+faststart", dest]);
    }
    const span = c.trim ? `${c.trim[0]}s to ${c.trim[1] ?? "end"}` : "full clip";
    console.log(`export ch${c.n}: ${span}, ${duration(dest).toFixed(3)}s, ${kb(dest)}`);
  }
}

// Transparent car cut-outs (assets/raw/cutouts/*.png): trimmed to the car's bounds, encoded as WebP with alpha
// at full and 640 wide, with their sizes written to public/media/cutouts.json for width/height attributes.
function cutouts() {
  const srcDir = join(raw, "cutouts");
  if (!existsSync(srcDir)) return;
  const dir = join(out, "cutouts");
  ensure(dir);
  const sizes = {};
  for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".png"))) {
    const name = file.replace(/\.png$/, "");
    const png = join(srcDir, file);
    const probe = spawnSync("ffmpeg", ["-hide_banner", "-i", png, "-vf", "alphaextract,cropdetect=limit=16:round=2:reset=0:skip=0", "-f", "null", "-"], { encoding: "utf8" });
    const crops = [...probe.stderr.matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)];
    const [, w, h, x, y] = crops[crops.length - 1].map(Number);
    for (const width of [w, 640]) {
      const f = join(dir, `${name}-${width === w ? "full" : "640"}.webp`);
      ff(["-i", png, "-vf", `crop=${w}:${h}:${x}:${y},scale=${width}:-2,format=yuva420p`, "-c:v", "libwebp", "-quality", "88", f]);
    }
    sizes[name] = { width: w, height: h, crop: { x, y } };
    console.log(`cutout ${name}: ${w}x${h} at ${x},${y}, ${kb(join(dir, `${name}-full.webp`))}`);
  }
  writeFileSync(join(out, "cutouts.json"), JSON.stringify(sizes, null, 2) + "\n");
}

const [task = "all", ...rest] = process.argv.slice(2);
const only = rest.map(Number);
if (task === "frames" || task === "all") frames(only);
if (task === "poster" || task === "all") poster();
if (task === "loops" || task === "all") loopCuts(only);
if (task === "stills" || task === "all") stillImages();
if (task === "cutouts" || task === "all") cutouts();
if (task === "manifest" || task === "all") manifest();
if (task === "export") exportForEnhance(only);
