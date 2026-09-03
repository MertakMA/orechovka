import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import SmoothHashScroll from "@/components/SmoothHashScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// TODO: nahradit reálnou doménou, až bude web nasazený.
const SITE_URL = "https://roubenkaorechovka.cz";
const SITE_TITLE = "Roubenka Ořechovka | Ubytování v podhůří Krkonoš";
const SITE_DESCRIPTION =
  "Útulná roubenka k pronájmu pro rodiny, páry i skupiny přátel. Celý objekt jen pro vás, zahrada s grilem, krb a výhled na Krkonoše.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Roubenka Ořechovka",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Roubenka Ořechovka",
    locale: "cs_CZ",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Roubenka Ořechovka" }],
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
    <html lang="cs" className={`${fraunces.variable} ${nunitoSans.variable}`}>
      <body className="font-sans antialiased">
        <SmoothHashScroll />
        {children}
      </body>
    </html>
  );
}
