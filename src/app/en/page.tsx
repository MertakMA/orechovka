import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import AboutSection from "@/components/AboutSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import GallerySection from "@/components/GallerySection";
import TipsSection from "@/components/TipsSection";
import PricingSection from "@/components/PricingSection";
import WeatherSection from "@/components/WeatherSection";
import MapSection from "@/components/MapSection";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: { absolute: "Roubenka Ořechovka | Cabin rental near the Krkonoše Mountains" },
  description:
    "A cozy log cabin to rent for families, couples and groups of friends. The whole place just for you, a garden with a grill, a stove and Krkonoše views.",
  alternates: {
    canonical: `${V.SITE_URL}/en`,
    languages: { cs: V.SITE_URL, en: `${V.SITE_URL}/en` },
  },
  openGraph: { locale: "en_US" },
};

// Statický export (GitHub Pages) nemá server, takže ISR (revalidate) tu
// nefunguje — novinky z Notionu se načtou vždy jen při buildu. Aktuálnost
// proto zajišťuje pravidelný rebuild naplánovaný v GitHub Actions workflow
// (viz .github/workflows/deploy.yml), ne runtime revalidace.

export default async function HomeEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <Hero locale="en" />
        <Stats locale="en" />
        <AboutSection locale="en" />
        <AdvantagesSection locale="en" />
        <GallerySection locale="en" />
        <TipsSection locale="en" />
        <PricingSection locale="en" />
        <WeatherSection locale="en" />
        <MapSection locale="en" />
        <NewsSection locale="en" />
        <CTASection
          title="Ready for a stay in nature?"
          subtitle="Roubenka Ořechovka is waiting. Book your dates simply and safely via Booking.com."
          buttonLabel="Book your stay via Booking.com →"
        />
      </main>
      <Footer locale="en" />
    </>
  );
}
