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

// Znovu ověří novinky z Notionu nejdéle jednou za 30 minut (ISR),
// aby se nová novinka přidaná klientem objevila bez ručního redeploye.
export const revalidate = 1800;

export default function Home() {
  return (
    <>
      <Navbar />
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
