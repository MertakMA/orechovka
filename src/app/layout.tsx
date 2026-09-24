import type { Metadata } from "next";
import { Playfair_Display, Lora, Montserrat } from "next/font/google";
import SmoothHashScroll from "@/components/SmoothHashScroll";
import { V } from "@/generated/variables";
import { texty } from "@/lib/texty";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

// Podnadpisy podle brand boardu — Lora drží serifový tón nadpisů, ale je
// měkčí a čitelnější v menších velikostech než Playfair.
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-subheading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const s = texty("spolecne", "cs");
const SITE_URL = V.SITE_URL;
const SITE_NAME = s.vzdy("NAZEV_WEBU");
const SITE_TITLE = s.vzdy("seo.titulek");
const SITE_DESCRIPTION = s.vzdy("seo.popis");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "cs_CZ",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${playfairDisplay.variable} ${lora.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <SmoothHashScroll />
        {children}
      </body>
    </html>
  );
}
