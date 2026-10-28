"use client";

import { useEffect, useRef, useState } from "react";
import { bookingSteps, quoteHref, services, site, telLink, type ServiceId } from "@/lib/content";
import { attributionKeys, captureAttribution, type Attribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import SectionHeader from "@/components/ui/SectionHeader";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-2 block w-full border border-line-strong bg-surface px-4 py-3.5 text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none";
const label = "text-sm text-ink/85";

export default function BookingForm({ defaultService }: { defaultService: ServiceId | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [attribution, setAttribution] = useState<Attribution>({});
  const [today, setToday] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAttribution(captureAttribution());
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  // Every "Get a quote" button links here. Carry over the service it was on, and the configurator's build note.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>(`a[href="${quoteHref}"]`);
      if (!link) return;
      const { quoteService, quoteNote } = link.dataset;
      if (quoteService && serviceRef.current) serviceRef.current.value = quoteService;
      if (quoteNote && messageRef.current && !messageRef.current.value.trim()) messageRef.current.value = quoteNote;
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("lead_submit", { service: data.service, gclid: attribution.gclid });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="booking" aria-labelledby="booking-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader
          id="booking-title"
          title="Get a quote or book a slot."
          intro="Tell us the car and what you have in mind. We'll come back with a fixed price."
        />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-24">
          <div data-in-group className="col-span-12 lg:col-span-4">
            <p data-in="rise" className="text-sm text-muted">
              What happens next
            </p>
            <ol className="mt-5 space-y-6">
              {bookingSteps.map((step, i) => (
                <li key={step.title} data-in="rise" data-in-delay={100 + i * 110} className="grid grid-cols-[2.25rem_1fr] border-t border-line pt-4">
                  <span className="type-display tabular text-2xl text-accent">{i + 1}</span>
                  <span>
                    <span className="block text-ink">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p data-in="rise" data-in-delay={450} className="mt-10 text-sm text-muted">
              Or call us
            </p>
            <a href={telLink} data-in="rise" data-in-delay={500} data-track="call_click" data-track-location="booking" className="type-display tabular mt-1 block text-3xl text-ink hover:text-accent">
              {site.phoneDisplay}
            </a>
          </div>
          <form onSubmit={onSubmit} data-in="wipe" className="col-span-12 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6" noValidate={false}>
            <div>
              <label htmlFor="lead-name" className={label}>
                Name
              </label>
              <input ref={nameRef} id="lead-name" name="name" required autoComplete="name" maxLength={120} className={field} />
            </div>
            <div>
              <label htmlFor="lead-phone" className={label}>
                Phone
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                pattern="[+0-9 ()\-.]{7,20}"
                placeholder="(818) 555-0199"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="lead-email" className={label}>
                Email <span className="text-muted">(optional)</span>
              </label>
              <input id="lead-email" name="email" type="email" autoComplete="email" maxLength={160} className={field} />
            </div>
            <div>
              <label htmlFor="lead-car" className={label}>
                Car model
              </label>
              <input id="lead-car" name="car" required maxLength={120} placeholder="e.g. G 63, 2024" className={field} />
            </div>
            <div>
              <label htmlFor="lead-service" className={label}>
                Service
              </label>
              <select ref={serviceRef} id="lead-service" name="service" required defaultValue={defaultService ?? ""} className={`${field} appearance-none`}>
                <option value="" disabled>
                  Choose a service
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="not-sure">Not sure yet</option>
              </select>
            </div>
            <div>
              <label htmlFor="lead-date" className={label}>
                Preferred date
              </label>
              <input id="lead-date" name="date" type="date" min={today || undefined} className={`${field} [color-scheme:dark]`} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="lead-message" className={label}>
                Anything we should know <span className="text-muted">(optional)</span>
              </label>
              <textarea ref={messageRef} id="lead-message" name="message" rows={4} maxLength={2000} className={`${field} resize-y`} />
            </div>

            {/* Honeypot: hidden from people, filled by bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="lead-company">Company</label>
              <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
            {attributionKeys.map((k) => (
              <input key={k} type="hidden" name={k} value={attribution[k] ?? ""} />
            ))}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-medium text-bg transition-colors hover:bg-ink disabled:opacity-60"
              >
                {status === "sending" ? "Sending" : "Get my quote"}
              </button>
            </div>

            <p aria-live="polite" className="text-sm sm:col-span-2">
              {status === "sent" && <span className="text-accent">Got it. We'll call or text you shortly with your quote.</span>}
              {status === "error" && (
                <span className="text-ink">
                  That didn't send. Please call us on{" "}
                  <a href={telLink} data-track="call_click" data-track-location="booking_error" className="underline underline-offset-4">
                    {site.phoneDisplay}
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
