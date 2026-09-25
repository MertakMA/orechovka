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
import StrukturovanaData from "@/components/StrukturovanaData";
import { getNews } from "@/lib/notion";
import { texty, type Locale } from "@/lib/texty";

export default async function HomePage({ locale }: { locale: Locale }) {
  const news = await getNews();
  const u = texty("uvod", locale);
  const s = texty("spolecne", locale);

  return (
    <>
      {locale === "en" && <HtmlLangSetter lang="en" />}
      <StrukturovanaData locale={locale} />
      <Navbar hasNews={news.length > 0} locale={locale} />
      <main>
        <Hero locale={locale} />
        <Stats locale={locale} />
        <AboutSection locale={locale} />
        <AdvantagesSection locale={locale} />
        <GallerySection locale={locale} />
        <TipsSection locale={locale} />
        <PricingSection locale={locale} />
        <div id="pocasi" className="scroll-mt-24" />
        <div id="webkamera" className="scroll-mt-24" />
        <WeatherSection locale={locale} />
        <MapSection locale={locale} />
        <NewsSection locale={locale} />
        {u.sekce("cta") && (
          <CTASection title={u.t("cta.nadpis")} subtitle={u.t("cta.podnadpis")} buttonLabel={s.t("cta.tlacitko")} />
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
