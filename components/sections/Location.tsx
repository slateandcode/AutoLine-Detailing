import { site } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import LazyMap from "@/components/ui/LazyMap";
import { CallCta, QuoteCta } from "@/components/ui/Cta";

export default function Location() {
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
  const { street, area, region, postal } = site.address;
  return (
    <section id="location" aria-labelledby="location-title" className="cv-section relative z-[2] bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <SectionHeader
          id="location-title"
          title={`${area}, ${site.address.city}.`}
          intro="Drop by while we're open, or book a time so a bay is ready for you."
        />
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-24">
          <div data-in="rise" className="col-span-12 space-y-10 md:col-span-4">
            <address className="not-italic leading-relaxed text-ink">
              <span className="block text-sm text-muted">Address</span>
              <span className="mt-3 block">
                {site.name}
                <br />
                {street}
                <br />
                {area}, {region} {postal}
              </span>
              <a href={directions} target="_blank" rel="noopener" className="mt-3 inline-block text-accent underline-offset-4 hover:underline">
                Get directions
              </a>
            </address>
            <div>
              <span className="block text-sm text-muted">Opening hours</span>
              <dl className="mt-3 space-y-2">
                {site.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-6 border-b border-line pb-2">
                    <dt className="text-ink/85">{h.label}</dt>
                    <dd className="tabular text-ink">{h.display}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 border-b border-line pb-2">
                  <dt className="text-ink/85">Sunday</dt>
                  <dd className="text-muted">Closed</dd>
                </div>
              </dl>
            </div>
            <div>
              <span className="block text-sm text-muted">Contact</span>
              <a href={`tel:${site.phoneE164}`} data-track="call_click" data-track-location="location" className="type-display tabular mt-3 block text-3xl text-ink hover:text-accent">
                {site.phoneDisplay}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <QuoteCta location="location">Get a quote</QuoteCta>
                <CallCta location="location">Call</CallCta>
              </div>
            </div>
          </div>
          <div data-in="scale" data-in-delay={150} className="col-span-12 aspect-[4/3] md:col-span-8 md:aspect-auto md:min-h-[480px]">
            <LazyMap query={site.mapsQuery} title={`Map to ${site.name} in ${area}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
