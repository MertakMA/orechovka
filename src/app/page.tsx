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
import { getNews } from "@/lib/notion";

// Statický export (GitHub Pages) nemá server, takže ISR (revalidate) tu
// nefunguje — novinky z Notionu se načtou vždy jen při buildu. Aktuálnost
// proto zajišťuje pravidelný rebuild naplánovaný v GitHub Actions workflow
// (viz .github/workflows/deploy.yml), ne runtime revalidace.

export default async function Home() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main>
        <Hero />
        <Stats />
        <AboutSection />
        <AdvantagesSection />
        <GallerySection />
        <TipsSection />
        <PricingSection />
        <WeatherSection />
        <MapSection />
        <NewsSection />
        <CTASection
          title="Připraveni na pobyt v přírodě?"
          subtitle="Roubenka Ořechovka čeká. Rezervujte si termín jednoduše a bezpečně přes Booking.com."
        />
      </main>
      <Footer />
    </>
  );
}
