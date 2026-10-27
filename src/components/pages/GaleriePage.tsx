import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SubpageHero from "@/components/SubpageHero";
import GalleryFilterGrid from "@/components/gallery/GalleryFilterGrid";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { getNews } from "@/lib/notion";
import { fotka } from "@/lib/fotky";
import { texty, type Locale } from "@/lib/texty";

export default async function GaleriePage({ locale }: { locale: Locale }) {
  const news = await getNews();
  const g = texty("galerie", locale);
  const s = texty("spolecne", locale);

  return (
    <>
      {locale === "en" && <HtmlLangSetter lang="en" />}
      <Navbar hasNews={news.length > 0} locale={locale} />
      <main>
        <SubpageHero photo={fotka("galerie-hero", locale)} title={g.t("hero.nadpis")} subtitle={g.t("hero.podnadpis")} overlayClassName="bg-[#2a1c12]/50" />

        <div className="px-6 sm:px-10 lg:px-[100px]">
          <GalleryFilterGrid locale={locale} />
        </div>

        {g.sekce("cta") && (
          <CTASection
            title={s.t("cta.cekame.nadpis")}
            subtitle={s.t("cta.cekame.podnadpis")}
            buttonLabel={s.t("cta.tlacitko")}
            locale={locale}
          />
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
