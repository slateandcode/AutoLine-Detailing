// Ads attribution: gclid and utm_* from the landing URL, kept for the session so they survive in-page navigation.
export const attributionKeys = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Attribution = Partial<Record<(typeof attributionKeys)[number], string>>;

const STORAGE_KEY = "attribution";

export function captureAttribution(): Attribution {
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const key of attributionKeys) {
    const value = params.get(key);
    if (value) fresh[key] = value.slice(0, 200);
  }
  // A new click with a gclid or utm set replaces the old one rather than mixing campaigns.
  const merged = Object.keys(fresh).length ? fresh : stored;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Storage blocked: the values still go out with this page's form.
  }
  return merged;
}
