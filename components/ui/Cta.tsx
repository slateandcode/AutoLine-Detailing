import { quoteHref, telLink } from "@/lib/content";

type Variant = "solid" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-2";
const variants: Record<Variant, string> = {
  solid: "bg-accent text-bg hover:bg-ink",
  outline: "border border-line-strong text-ink hover:border-ink",
  ghost: "text-ink hover:text-accent",
};
const sizes = { md: "h-12 px-6", sm: "h-10 px-4" };

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  location: string;
  service?: string;
  className?: string;
  ariaLabel?: string;
};

// "Get a quote" and "Contact" both jump to the booking form. data-quote-service and data-quote-note
// are read by BookingForm to pre-select the service and pre-fill the message.
export function QuoteCta({
  children,
  variant = "solid",
  size = "md",
  location,
  service,
  note,
  className = "",
  ariaLabel,
}: Props & { note?: string }) {
  return (
    <a
      href={quoteHref}
      aria-label={ariaLabel}
      data-track="quote_click"
      data-track-location={location}
      data-track-service={service}
      data-quote-service={service}
      data-quote-note={note}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}

export function CallCta({ children, variant = "outline", size = "md", location, className = "" }: Props) {
  return (
    <a
      href={telLink}
      data-track="call_click"
      data-track-location={location}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
