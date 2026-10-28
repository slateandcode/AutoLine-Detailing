# Pixara credit ledger

Project cap: **3,350**. Single job limit without asking: **500**.
Balance at project start (brief): 4,300. Balance read from Pixara on 2026-10-27 before any new job: **4,162** (10 lower than 4,300 minus the 128 master; spent outside this ledger).

| # | Date | Asset | What | Model | Settings | Credits | Status | Running total |
|---|---|---|---|---|---|---|---|---|
| 0 | before 2026-10-27 | asset-115207 | Master still: stock white G 500, front three-quarter, hex studio | GPT Image 2.5 | (pre-existing) | 128 | Approved | 128 |
| 1 | 2026-10-27 | asset-115213 (job 85392) | Still 2A: white G, full left side profile | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: master | 128 | Approved | 256 |
| 2 | 2026-10-27 | asset-115214 (job 85393) | Still 2B: same frame as 2A, satin black wrap | GPT Image 2.5 | high, 16:9, precision, png, 1 image, refs: 2A, master | 128 | Approved | 384 |
| 3 | 2026-10-27 | asset-115217 (job 85395) | Still 3: low macro across satin black bonnet, front left corner | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: 2B | 128 | Approved | 512 |
| 4 | 2026-10-27 | asset-115218 (job 85396) | Still 4A: cabin from rear seat, dash off, studio light through glass | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: master | 128 | Kept (Claude review, per user's go-ahead to proceed without per-asset reviews) | 640 |
| 5 | 2026-10-27 | asset-115223 (job 85399) | Still 4B: looking up at starlight headliner, cabin dark | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: 4A | 128 | Kept (Claude review) | 768 |
| 6 | 2026-10-27 | asset-115224 (job 85402) | Clip 1 ARRIVAL: push-in on the white G, start frame master | Luma Ray 3.2 | image-to-video, 720p, 5s, 16:9 | 300 | Kept, trimmed to 0 to 2.5s. After 2.5s the front wheels steer toward camera and a driver appears behind the windscreen near the end. No retry, to keep budget for the Gemini clips | 1,068 |
| 7 | 2026-10-27 | asset-115227 (job 85405) | Clip 2 WRAP: white to satin black, start 2A, end 2B | Gemini Omni Flash 1.1 | frame mode, 720p, 5s, 16:9 | 500 | Kept. Wrap sweeps rear to front with a clean edge, car and wheels stable. Audio stripped in processing | 1,568 |
| 8 | 2026-10-27 | asset-115228 (job 85407) | Clip 3 PROTECTION: water beading on satin bonnet, start still 3 | Gemini Omni Flash 1.1 | frame mode, 720p, 5s, 16:9 | 500 | Kept. Tight beads and rivulets, bonnet stable, camera slides right. Pour is a stream, not a sheet | 2,068 |
| 9 | 2026-10-27 | asset-115229 (job 85408) | Clip 4 STARLIGHT: tilt from dash to star roof, start 4A, end 4B | Gemini Omni Flash 1.1 | frame mode, 720p, 5s, 16:9 | 500 | Kept. One smooth tilt, studio light fades, stars fill the roof. The dash screens wake with illegible gauge graphics for about 1s mid-tilt | 2,568 |

**Final generation total: 2,568 of 3,350.** No retries used. 782 credits left under the cap.

Reconciled with Pixara on 2026-10-27: balance 4,162 before job 1, 1,722 after job 9. Spent this session 2,440 (5 stills at 128 + 300 + 3 x 500), plus the 128 master = 2,568.

### Gallery stills (reopened 2026-10-27: the user asked to add a Range Rover and 1 to 2 more cars to the gallery)

| # | Date | Asset | What | Model | Settings | Credits | Status | Running total |
|---|---|---|---|---|---|---|---|---|
| 10 | 2026-10-27 | asset-115264 (job 85448) | Range Rover, satin Nardo grey wrap, gloss black roof, same studio | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: master (studio) | 128 | Kept | 2,696 |
| 11 | 2026-10-27 | asset-115265 (job 85450) | Lamborghini Urus, matte PPF over green, rear three-quarter, same studio | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: master (studio) | 128 | Kept | 2,824 |
| 12 | 2026-10-27 | asset-115266 (job 85451) | Rolls-Royce Cullinan, gloss black after polish and ceramic, low front view, same studio | GPT Image 2.5 | high, 16:9, precision, png, 1 image, ref: master (studio) | 128 | Kept | 2,952 |

**Project total: 2,952 of 3,350.** 398 credits left under the cap. No retries used.

### Service loop clips (2026-10-27: the user raised the cap to 3,852 for three car clips)

Cap is now **3,852**. Three Luma Ray 3.2 clips at 300 each use it exactly, so there is no retry budget: a failed clip falls back to a free still-motion loop.

| # | Date | Asset | What | Model | Settings | Credits | Status | Running total |
|---|---|---|---|---|---|---|---|---|
| 13 | 2026-10-27 | asset-115274 (job 85458) | Ceramic loop: Cullinan, slow dolly right, hex lights gliding across the black paint | Luma Ray 3.2 | image-to-video, 720p, 5s, 16:9, start: Cullinan still | 300 | Kept. Car stable, cabin empty, wheels straight | 3,252 |
| 14 | 2026-10-27 | asset-115275 (job 85459) | PPF loop: Urus, slow low push-in on the matte green rear three-quarter | Luma Ray 3.2 | image-to-video, 720p, 5s, 16:9, start: Urus still | 300 | Kept. Steady push, body stable, matte finish holds | 3,552 |
| 15 | 2026-10-27 | asset-115276 (job 85460) | Tint loop: Range Rover, arc from front three-quarter to side, hex lines across the tinted glass | Luma Ray 3.2 | image-to-video, 720p, 5s, 16:9, start: Range Rover still | 300 | Kept. Car stable, cabin empty, wheels straight | 3,852 |

**Project total: 3,852 of 3,852 (raised cap).** Budget fully used, no retries.

### Car cut-outs for the redesign (2026-10-28: the user approved a small top-up for background removal)

Ideogram Background Remover, 10 credits each. Four cut-outs: the finished G-Class (2B), Range Rover, Urus and Cullinan. Planned spend 40, new cap **3,892**.

| # | Date | Asset | What | Model | Settings | Credits | Status | Running total |
|---|---|---|---|---|---|---|---|---|
| 16 | 2026-10-28 | asset-115444 (job 85653) | Cut-out: G-Class satin black side profile (from 2B) | Ideogram Background Remover | image in, transparent PNG out | 10 | Kept | 3,862 |
| 17 | 2026-10-28 | asset-115445 (job 85654) | Cut-out: Range Rover | Ideogram Background Remover | image in, transparent PNG out | 10 | Kept | 3,872 |
| 18 | 2026-10-28 | asset-115446 (job 85655) | Cut-out: Urus | Ideogram Background Remover | image in, transparent PNG out | 10 | Kept. A stray piece of the tool cart was erased locally | 3,882 |
| 19 | 2026-10-28 | asset-115447 (job 85656) | Cut-out: Cullinan | Ideogram Background Remover | image in, transparent PNG out | 10 | Kept | 3,892 |

**Project total: 3,892 of 3,892.**

**Earlier note, generation closed (2026-10-27, user decision):** no further generations are planned for this project. Clip 1's trim was later extended from 2.5s to 4s at the user's request. Up to 4s no driver is visible, but the front wheels read as steered from about 3s. No credits were spent on this change.

## Budget plan

| Item | Planned | Spent |
|---|---|---|
| Master still (done) | 128 | 128 |
| 5 more stills | 640 | 640 |
| Still retries, about 2 | 256 | 0 |
| Clip 1 (Ray 3.2) | 300 | 300 |
| Clips 2 to 4 (Gemini Omni) | 1,500 | 1,500 |
| Clip retry, 1 on Gemini | 500 | 0 |
| **Total** | **3,324** | **2,568** |

Remaining under cap: **782**
