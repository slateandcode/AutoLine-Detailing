// The only place fonts are defined. Swap families here; the CSS reads --font-archivo and --font-inter-tight.
// Both are self-hosted through next/font/local and trimmed to Basic Latin, Latin-1 and common punctuation:
//   Archivo: static instance at width 75, weight 800, normal and italic (~12 KB each)
//   Inter Tight: variable, limited to weights 400 to 500 (~24 KB)
// Together about 49 KB, against 230 KB for the full variable fonts from next/font/google.
import localFont from "next/font/local";

export const displayFont = localFont({
  src: [
    { path: "./fonts/archivo-75-800.woff2", weight: "800", style: "normal" },
    { path: "./fonts/archivo-75-800-italic.woff2", weight: "800", style: "italic" },
  ],
  declarations: [{ prop: "font-stretch", value: "75%" }],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const bodyFont = localFont({
  src: [{ path: "./fonts/inter-tight-400-500.woff2", weight: "400 500", style: "normal" }],
  variable: "--font-inter-tight",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
