// All copy, prices, contact details and ?s= ad variants live here.
// Anything marked PLACEHOLDER must be replaced with the studio's real details before launch.

export const site = {
  name: "AutoLine", // Change the studio name here only.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:9492",
  phoneDisplay: "(818) 555-0142", // PLACEHOLDER: 555-01xx numbers are reserved for fiction
  phoneE164: "+18185550142", // PLACEHOLDER
  address: {
    street: "0000 Placeholder Ave", // PLACEHOLDER
    area: "Van Nuys",
    city: "Los Angeles",
    region: "CA",
    postal: "91406", // PLACEHOLDER
    country: "US",
  },
  geo: { lat: 34.1899, lng: -118.4514 }, // PLACEHOLDER: approximate pin for Van Nuys
  hours: [
    // PLACEHOLDER: confirm real opening hours
    { label: "Monday to Friday", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00", display: "8am to 6pm" },
    { label: "Saturday", days: ["Saturday"], opens: "09:00", closes: "15:00", display: "9am to 3pm" },
  ],
  priceRange: "$250 to $15,000", // PLACEHOLDER
  mapsQuery: "Van Nuys, Los Angeles, CA",
};

export const telLink = `tel:${site.phoneE164}`;

// Every "Get a quote" and "Contact" button goes to the booking form.
export const quoteHref = "#booking";

// PLACEHOLDER: replace with the real Google rating, job count and warranty terms.
export const trust = [
  { value: "4.9", label: "Google rating" },
  { value: "1,200+", label: "Cars done" },
  { value: "10 yr", label: "Film warranty" },
];

export type ServiceId = "starlight" | "wrap" | "ppf" | "ceramic" | "tint" | "detailing";

export type Service = {
  id: ServiceId;
  name: string;
  kicker: string;
  lines: [string, string];
  from: number; // USD. PLACEHOLDER prices, confirm with the studio
  priceNote: string;
  time: string; // PLACEHOLDER: typical time in the studio, confirm with the studio
  loop: string; // file stem in /media/loops
};

export const services: Service[] = [
  {
    id: "wrap",
    name: "Wraps",
    kicker: "Color change",
    lines: [
      "Satin, gloss, matte and color-shift film from 3M and Avery Dennison.",
      "Edges tucked, door jambs on request, and it peels off clean when you sell.",
    ],
    from: 4500,
    priceNote: "full car, sedan",
    time: "3 to 5 days",
    loop: "wrap",
  },
  {
    id: "ppf",
    name: "Paint protection film",
    kicker: "PPF",
    lines: [
      "Clear, self-healing film that takes the rock chips, road debris and car wash swirls.",
      "Full front or full body, gloss or matte, cut to your exact model.",
    ],
    from: 1800,
    priceNote: "full front",
    time: "1 to 2 days",
    loop: "ppf",
  },
  {
    id: "ceramic",
    name: "Ceramic coating",
    kicker: "Gloss and easy washing",
    lines: [
      "Machine polished first, then a multi-layer coating rated for California sun.",
      "Water beads, dust slides off, and the gloss stays for years, not weeks.",
    ],
    from: 900,
    priceNote: "single layer",
    time: "1 day",
    loop: "ceramic",
  },
  {
    id: "starlight",
    name: "Starlight headliners",
    kicker: "Fiber optic roof",
    lines: [
      "Hundreds of fiber optic stars, placed by hand into your own headliner.",
      "Pick the color and density, add shooting stars, control it from your phone.",
    ],
    from: 1900,
    priceNote: "up to 400 stars",
    time: "2 days",
    loop: "starlight",
  },
  {
    id: "tint",
    name: "Window tint",
    kicker: "Heat rejection",
    lines: [
      "Nano ceramic film that cuts the heat without turning the cabin into a cave.",
      "Within California legal limits, we'll advise on the day.",
    ],
    from: 350,
    priceNote: "sides and rear",
    time: "Same day",
    loop: "tint",
  },
  {
    id: "detailing",
    name: "Detailing",
    kicker: "Inside and out",
    lines: [
      "Hand wash, decontamination, machine polish and a full interior clean.",
      "Done indoors under proper lights, so nothing gets missed.",
    ],
    from: 250,
    priceNote: "full detail",
    time: "Same day",
    loop: "detailing",
  },
];

export const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

// Message match for Google Ads: ?s=<id> swaps the H1, subline, CTA and picked service on the server.
export type Variant = {
  h1: string;
  sub: string;
  cta: string;
  title: string;
  description: string;
  highlight: ServiceId | null;
};

export const defaultVariant: Variant = {
  h1: "Wraps, PPF and starlight roofs. Built in LA.",
  sub: "One closed studio for wraps, paint protection, ceramic, tint and starlight headliners. Fixed quotes, warranty on every job.",
  cta: "Get a quote",
  title: `Car Wraps, PPF and Starlight Headliners in Los Angeles | ${site.name}`,
  description:
    "Car wraps, PPF, ceramic coating, window tint and starlight headliners in Van Nuys, Los Angeles. Fixed quotes, warranty on every job.",
  highlight: null,
};

export const variants: Record<ServiceId, Variant> = {
  starlight: {
    h1: "Starlight headliners, fitted in Los Angeles.",
    sub: "Hand-placed fiber optic stars in your own roof. Choose the color and density, add shooting stars. Most cars are done in two days.",
    cta: "Get a starlight quote",
    title: `Starlight Headliners Los Angeles | ${site.name}`,
    description:
      "Fiber optic starlight headliners fitted by hand in Van Nuys, Los Angeles. Pick colors, star count and shooting stars. Get a fixed quote.",
    highlight: "starlight",
  },
  wrap: {
    h1: "Car wraps in Los Angeles. Any color, any finish.",
    sub: "Satin, gloss, matte and color-shift film from 3M and Avery Dennison. Edges tucked, door jambs on request, removable when you sell.",
    cta: "Get a wrap quote",
    title: `Car Wraps Los Angeles | Satin, Matte and Gloss | ${site.name}`,
    description:
      "Full and partial car wraps in Van Nuys, Los Angeles. 3M and Avery Dennison films in satin, matte, gloss and color-shift. Get a fixed quote.",
    highlight: "wrap",
  },
  ppf: {
    h1: "Paint protection film that takes the hit.",
    sub: "Self-healing PPF against rock chips, road debris and car wash swirls. Full front or full body, cut to your exact model.",
    cta: "Get a PPF quote",
    title: `PPF Los Angeles | Paint Protection Film | ${site.name}`,
    description:
      "Self-healing paint protection film in Van Nuys, Los Angeles. Full front or full body, gloss or matte, with film warranty. Get a fixed quote.",
    highlight: "ppf",
  },
  ceramic: {
    h1: "Ceramic coating that makes washing easy.",
    sub: "Machine polished first, then a multi-layer coating rated for California sun. Water beads, dust slides off, gloss stays.",
    cta: "Get a ceramic quote",
    title: `Ceramic Coating Los Angeles | ${site.name}`,
    description:
      "Ceramic coating with a full machine polish in Van Nuys, Los Angeles. Multi-layer protection rated for California sun. Get a fixed quote.",
    highlight: "ceramic",
  },
  tint: {
    h1: "Window tint that beats the California heat.",
    sub: "Nano ceramic film that rejects heat without going dark. Within California legal limits, we'll advise on the day.",
    cta: "Get a tint quote",
    title: `Window Tint Los Angeles | Nano Ceramic | ${site.name}`,
    description:
      "Nano ceramic window tint in Van Nuys, Los Angeles. Real heat rejection, within California legal limits. Get a fixed quote.",
    highlight: "tint",
  },
  detailing: {
    h1: "Detailing that gets it showroom clean.",
    sub: "Hand wash, decontamination, machine polish and a full interior clean. Done indoors under proper lights.",
    cta: "Book a detail",
    title: `Car Detailing Los Angeles | ${site.name}`,
    description:
      "Interior and exterior car detailing in Van Nuys, Los Angeles. Hand wash, machine polish, full interior clean. Book online.",
    highlight: "detailing",
  },
};

export function getVariant(s: string | string[] | undefined): Variant {
  const key = (Array.isArray(s) ? s[0] : s)?.toLowerCase();
  return key && key in variants ? variants[key as ServiceId] : defaultVariant;
}

// The film: four chapters of one G-Class being built.
export const chapters = [
  {
    id: "arrival",
    label: "Arrival",
    caption: "STRAIGHT OFF THE LOT.",
    line: "A stock G 500 rolls into the studio. Day one.",
    still: "master",
    alt: "A stock white Mercedes G-Class in a dark studio under a hexagonal LED ceiling",
  },
  {
    id: "wrap",
    label: "Wrap",
    caption: "NEW SKIN. SAME G.",
    line: "Satin black on every panel. Edges tucked, no seams on show.",
    still: "2B",
    alt: "The same G-Class in side profile, fully wrapped in satin black",
  },
  {
    id: "protection",
    label: "Protection",
    caption: "RAIN DOESN’T STICK.",
    line: "PPF on the front, ceramic over the lot. Water beads and rolls off.",
    still: "3",
    alt: "Close view across the satin black hood under studio lights",
  },
  {
    id: "starlight",
    label: "Starlight",
    caption: "LET IT SHINE FROM ABOVE.",
    line: "Hundreds of fiber optic stars, placed by hand.",
    still: "4B",
    alt: "The G-Class headliner filled with fiber optic stars",
  },
] as const;

// Build sheet: each item ticks when the chapter at `doneAt` (0-based) finishes.
export const buildSheet = [
  { label: "Wrap", spec: "Satin black", doneAt: 1 },
  { label: "PPF", spec: "Full front", doneAt: 2 },
  { label: "Ceramic", spec: "2 layers", doneAt: 2 },
  { label: "Starlight", spec: "600 stars", doneAt: 3 },
];

export const statement = {
  text: "One closed studio in Los Angeles. Wraps, film, coating, tint and starlight, all done in-house.",
  sub: "No subcontractors and no shared bays. The person who quotes your car is in the room while it is built.",
  // PLACEHOLDER stats
  stats: [
    { value: "1,200+", label: "Cars through the studio" },
    { value: "3", label: "Closed, dust-controlled bays" },
    { value: "2 days", label: "Typical starlight install" },
  ],
};

export const processSteps = [
  { n: "01", title: "Consult", when: "Day 0", text: "Send a few photos or drop by. We check the paint and talk through finishes with samples in hand." },
  { n: "02", title: "Quote", when: "Same day", text: "A fixed price in writing, with the film brand, warranty and a finish date. No surprises at pickup." },
  { n: "03", title: "Build", when: "1 to 6 days", text: "Your car stays inside our closed studio the whole time. We send progress photos as it comes together." },
  { n: "04", title: "Handover", when: "Pickup", text: "A walkaround under the studio lights, a care guide and your warranty card. Then it is yours." },
];

// Service map: where each service sits on the G 500 side view, as fractions of the trimmed cut-out (0 to 1).
// ghost is the oversized outlined word behind the car while that service is picked.
export const serviceMap: Record<ServiceId, { part: string; ghost: string; x: number; y: number }> = {
  wrap: { part: "Body panels", ghost: "WRAP", x: 0.6, y: 0.56 },
  ppf: { part: "Front end", ghost: "PPF", x: 0.13, y: 0.46 },
  ceramic: { part: "Paint", ghost: "CERAMIC", x: 0.87, y: 0.5 },
  starlight: { part: "Headliner", ghost: "STARLIGHT", x: 0.65, y: 0.04 },
  tint: { part: "Glass", ghost: "TINT", x: 0.44, y: 0.22 },
  detailing: { part: "Wheels and cabin", ghost: "DETAIL", x: 0.79, y: 0.8 },
};

// PLACEHOLDER: generated cars, not real jobs. Swap in the studio's own cut-out photos before launch.
export type WorkItem = {
  car: string;
  ghost: string;
  detail: string;
  service: string;
  finish: string;
  time: string;
  cutout: "g500" | "rangerover" | "urus" | "cullinan";
  alt: string;
};

export const work: WorkItem[] = [
  {
    car: "Mercedes G 500",
    ghost: "SATIN",
    detail: "Came in factory white. Left in satin black with PPF on the front, ceramic over the lot and a starlight roof.",
    service: "Wrap, PPF, ceramic, starlight",
    finish: "Satin black",
    time: "9 days",
    cutout: "g500",
    alt: "Mercedes G 500 wrapped in satin black, side view",
  },
  {
    car: "Range Rover",
    ghost: "NARDO",
    detail: "Full color change to Nardo gray in a satin finish, with the roof and wheels taken to gloss black.",
    service: "Wrap",
    finish: "Satin Nardo gray",
    time: "4 days",
    cutout: "rangerover",
    alt: "Range Rover wrapped in satin Nardo gray with a gloss black roof",
  },
  {
    car: "Lamborghini Urus",
    ghost: "MATTE",
    detail: "Every painted panel covered in matte PPF, so the factory green reads soft and stays chip free.",
    service: "Full body PPF",
    finish: "Matte film",
    time: "5 days",
    cutout: "urus",
    alt: "Lamborghini Urus in green with matte paint protection film, rear view",
  },
  {
    car: "Rolls-Royce Cullinan",
    ghost: "GLOSS",
    detail: "Two-stage machine polish to take out the swirls, then three layers of ceramic for depth.",
    service: "Polish and ceramic",
    finish: "Deep gloss",
    time: "3 days",
    cutout: "cullinan",
    alt: "Black Rolls-Royce Cullinan with a fresh ceramic coating",
  },
];

// Closing band before the booking form, in the film's caption style.
export const closing = {
  caption: "YOUR CAR NEXT.",
  line: "Tell us the car and the job, and get a fixed quote, usually within the hour.",
  still: "rangerover",
};

// PLACEHOLDER: reply time claims, confirm with the studio.
export const bookingSteps = [
  { title: "We reply", text: "We call or text you back, usually inside an hour while we're open." },
  { title: "You get a fixed quote", text: "Film brand, warranty and a finish date, in writing." },
  { title: "We book your bay", text: "Drop the car off in Van Nuys. We send photos while it's with us." },
];

// PLACEHOLDER: real Google review count and profile link.
export const reviewSummary = {
  count: "180+",
  url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.mapsQuery}`)}`,
};

export const reviews = [
  // PLACEHOLDER: replace with real Google reviews
  { name: "Marcus T.", car: "G 63", service: "Satin wrap and PPF", text: "Dropped it off white, picked it up satin black with PPF on the front. Edges are tucked so well you can't tell it's film. Finished a day early." },
  // PLACEHOLDER: replace with real Google reviews
  { name: "Sarah M.", car: "Range Rover Sport", service: "Starlight headliner", text: "Wanted a warm white starlight with a couple of shooting stars. They sent a video before I picked it up. My kids won't sit anywhere else now." },
  // PLACEHOLDER: replace with real Google reviews
  { name: "Jason R.", car: "Lexus LX 600", service: "Ceramic and tint", text: "Clear quote by text, no upselling. The ceramic makes washing off road grime a two minute job and the tint actually keeps the cabin cool." },
  // PLACEHOLDER: replace with real Google reviews
  { name: "Daniel P.", car: "Porsche 911", service: "Full body PPF", text: "Third shop I asked and the only one that showed me the film and the warranty card before quoting. Panel gaps and sensors all perfect." },
];

export const faqs = [
  {
    q: "How long does a full wrap take?",
    a: "Three to five business days for most cars. Large SUVs like a G-Class can take six. You get a finish date in writing with your quote.",
  },
  {
    q: "Will a wrap or PPF damage my paint?",
    a: "Not on factory paint. Both come off clean with heat when the time comes. Repainted panels need a check first, so we look before we quote.",
  },
  {
    q: "What is the difference between PPF and ceramic coating?",
    a: "PPF is a thick clear film that stops rock chips and scratches. Ceramic is a hard coating that adds gloss and makes washing easy. Many customers do PPF on the front and ceramic over the whole car.",
  },
  {
    q: "How dark can I tint my windows?",
    a: "Within California legal limits, we'll advise on the day. We fit nano ceramic film, so you get strong heat rejection without needing to go very dark.",
  },
  {
    q: "Can you fit a starlight headliner in any car?",
    a: "Most cars, yes, including ones with a sunroof. We take the headliner out, fit the fibers by hand and refit it. Most installs take two days.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes. Every film carries the manufacturer's warranty, and our workmanship is covered on top. The exact terms are written on your quote.",
  },
];
