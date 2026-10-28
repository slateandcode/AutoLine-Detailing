// quote_click: any "Get a quote" or "Contact" button (they all open the booking form).
export type TrackEvent = "quote_click" | "call_click" | "lead_submit" | "configurator_use";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
