// Tiny shared state between the motion layer (GSAP) and the canvases, so neither imports the other.
type Listener = () => void;

export const filmState = {
  chapter: 0,
  frame: 0,
  stars: 0, // starfield opacity, 0 to 1
  halfwayCh1: false,
};

const listeners = new Set<Listener>();

export function setFilm(patch: Partial<typeof filmState>) {
  let changed = false;
  for (const k in patch) {
    const key = k as keyof typeof filmState;
    if (filmState[key] !== patch[key]) {
      (filmState as Record<string, unknown>)[key] = patch[key];
      changed = true;
    }
  }
  if (changed) listeners.forEach((fn) => fn());
}

export function subscribeFilm(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
