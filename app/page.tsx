import type { Metadata } from "next";
import { getVariant, site } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import MobileBar from "@/components/ui/MobileBar";
import JsonLd from "@/components/ui/JsonLd";
import PositionIn from "@/components/ui/PositionIn";
import Film from "@/components/film/Film";
import Starfield from "@/components/film/Starfield";
import Statement from "@/components/sections/Statement";
import ServiceMap from "@/components/sections/ServiceMap";
import StarlightConfigurator from "@/components/sections/StarlightConfigurator";
import Process from "@/components/sections/Process";
import Work from "@/components/sections/Work";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import Closing from "@/components/sections/Closing";
import BookingForm from "@/components/sections/BookingForm";
import Location from "@/components/sections/Location";
import Footer from "@/components/sections/Footer";

// ?s= picks the ad variant on the server, so the H1 and CTA match the ad with no client flicker.
type Props = { searchParams: Promise<{ s?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const v = getVariant((await searchParams).s);
  return {
    title: v.title,
    description: v.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: v.title,
      description: v.description,
      type: "website",
      siteName: site.name,
      locale: "en_US",
      images: [{ url: "/media/stills/2B-1088.webp", width: 1088, height: 608 }],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const v = getVariant((await searchParams).s);
  return (
    <>
      <Nav />
      {/* Clips sideways (not a scroll container, so the film's sticky pin still works) while parts slide in from off screen. */}
      <main className="overflow-x-clip">
        <Film variant={v} />
        <Starfield />
        <Statement />
        <ServiceMap initial={v.highlight} />
        <StarlightConfigurator />
        <Work />
        <Process />
        <Reviews />
        <Faq />
        <Closing />
        <BookingForm defaultService={v.highlight} />
        <Location />
      </main>
      <Footer />
      <MobileBar />
      <JsonLd />
      <PositionIn />
    </>
  );
}
