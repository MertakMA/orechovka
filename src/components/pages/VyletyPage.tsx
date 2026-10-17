import { Snowflake, Sun, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SubpageHero from "@/components/SubpageHero";
import SeasonSection from "@/components/trips/SeasonSection";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import type { Trip } from "@/components/trips/TripRow";
import { getNews } from "@/lib/notion";
import { fotka } from "@/lib/fotky";
import { texty, type Locale, type Texty } from "@/lib/texty";
import { V } from "@/generated/variables";

// Odkaz a místo na mapě jsou v kódu; název, popis a vzdálenost v Notionu
// (Texty → Výlety, řádek `id` = název + popis, `id.vzdalenost` = vzdálenost),
// fotka v databázi Fotky (místo „Výlety – tipy“, stejné ID).
type TripDef = { id: string; mapQuery: string; moreHref?: string };

const WINTER_TRIPS: TripDef[] = [
  {
    id: "zima.mlade-buky",
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    id: "zima.bezky",
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "zima.cerna-hora",
    mapQuery: "SkiResort Černá hora – Pec",
    moreHref: "https://www.skiresort.cz",
  },
];

const SUMMER_TRIPS: TripDef[] = [
  {
    id: "leto.mlade-buky",
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    id: "leto.grund",
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "leto.sejfy",
    mapQuery: "Lesní plovárna Sejfy, Mladé Buky",
    moreHref: "https://www.lesniplovarna.cz",
  },
  {
    id: "leto.zoo",
    mapQuery: "Safari Park Dvůr Králové",
    moreHref: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    id: "leto.stezka",
    mapQuery: "Stezka korunami stromů, Janské Lázně",
    moreHref: "https://treetop-walks.com/krkonose/",
  },
  {
    id: "leto.adrspach",
    mapQuery: "Adršpašsko-teplické skály",
    moreHref: V.TIP_ADRSPACH_URL,
  },
  {
    id: "leto.snezka",
    mapQuery: "Sněžka, Krkonoše",
    moreHref: V.TIP_SNEZKA_URL,
  },
  {
    id: "leto.muchomurka",
    mapQuery: "Farmapark Muchomůrka, Svoboda nad Úpou",
    moreHref: "http://www.farmapark-muchomurka.cz",
  },
];

const RESTAURANTS: TripDef[] = [
  {
    id: "okoli.grund",
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "okoli.na-kopecku",
    mapQuery: "Hostinec Na Kopečku, Horní Maršov",
    moreHref: "https://www.hostinecnakopecku.cz",
  },
];

function trips(v: Texty, defs: TripDef[], locale: Locale): Trip[] {
  return defs.flatMap(({ id, ...def }) => {
    const text = v.polozka(id);
    if (!text) return [];
    const photo = fotka("vylety-tipy", locale, id);
    return [
      {
        ...def,
        image: photo.srcSm,
        imageAlt: photo.alt,
        imagePozice: photo.pozice,
        title: text.t,
        description: text.p ?? "",
        distance: v.t(`${id}.vzdalenost`),
      },
    ];
  });
}

// Zimní měsíce (listopad–duben) uvidí nejdřív sekci Zima, zbytek roku Léto —
// ať je jako první to, co je zrovna sezónní. Restaurace zůstávají vždy dole.
function isWinterSeason(month: number) {
  return month <= 4 || month >= 11;
}

export default async function VyletyPage({ locale }: { locale: Locale }) {
  const news = await getNews();
  const v = texty("vylety", locale);
  const s = texty("spolecne", locale);

  const winterSection = (bgClassName: string) =>
    v.sekce("zima") && (
      <SeasonSection
        key="zima"
        id="zima"
        icon={<Snowflake className="size-5" strokeWidth={2} aria-hidden />}
        eyebrow={v.t("zima.nadtitulek")}
        title={v.t("zima.nadpis")}
        subtitle={v.t("zima.podnadpis")}
        trips={trips(v, WINTER_TRIPS, locale)}
        season="winter"
        bgClassName={bgClassName}
        locale={locale}
      />
    );

  const summerSection = (bgClassName: string) =>
    v.sekce("leto") && (
      <SeasonSection
        key="leto"
        id="leto"
        icon={<Sun className="size-5" strokeWidth={2} aria-hidden />}
        eyebrow={v.t("leto.nadtitulek")}
        title={v.t("leto.nadpis")}
        subtitle={v.t("leto.podnadpis")}
        trips={trips(v, SUMMER_TRIPS, locale)}
        season="summer"
        bgClassName={bgClassName}
        locale={locale}
        extraLink={{
          label: v.t("leto.dalsi-tipy"),
          href: "https://www.region-krkonose.cz/aktivni-vyziti/turisticke-trasy-naucne-stezky/",
        }}
      />
    );

  // Pořadí sekcí se otočí podle sezóny, ale střídání pozadí (krémová/písková)
  // zůstává vázané na pozici, ne na sezónu, ať vizuální rytmus stránky
  // zůstává stejný ať je první zima, nebo léto.
  const seasonSections = isWinterSeason(new Date().getMonth() + 1)
    ? [winterSection("bg-cream"), summerSection("bg-sand")]
    : [summerSection("bg-cream"), winterSection("bg-sand")];

  return (
    <>
      {locale === "en" && <HtmlLangSetter lang="en" />}
      <Navbar hasNews={news.length > 0} locale={locale} />
      <main>
        <SubpageHero photo={fotka("vylety-hero", locale)} title={v.t("hero.nadpis")} subtitle={v.t("hero.podnadpis")} />

        {seasonSections}

        {v.sekce("okoli") && (
          <SeasonSection
            id="restaurace"
            icon={<UtensilsCrossed className="size-5" strokeWidth={2} aria-hidden />}
            eyebrow={v.t("okoli.nadtitulek")}
            title={v.t("okoli.nadpis")}
            subtitle={v.t("okoli.podnadpis")}
            trips={trips(v, RESTAURANTS, locale)}
            season="food"
            bgClassName="bg-cream"
            locale={locale}
          />
        )}

        {v.sekce("cta") && (
          <CTASection
            title={s.t("cta.cekame.nadpis")}
            subtitle={s.t("cta.cekame.podnadpis")}
            buttonLabel={s.t("cta.tlacitko")}
          />
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
