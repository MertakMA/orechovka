import { Snowflake, Sun, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SubpageHero from "@/components/SubpageHero";
import SeasonSection from "@/components/trips/SeasonSection";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import type { Trip } from "@/components/trips/TripRow";
import { getNews } from "@/lib/notion";
import { commonsFile } from "@/lib/commonsImage";
import { texty, type Locale, type Texty } from "@/lib/texty";
import { V } from "@/generated/variables";

// Fotka, odkaz a místo na mapě jsou v kódu; název, popis a vzdálenost v Notionu
// (Texty → Výlety, řádek `id` = název + popis, `id.vzdalenost` = vzdálenost).
type TripDef = { id: string; image: string; mapQuery: string; moreHref?: string };

// TODO: dočasné ilustrační fotky z Wikimedia Commons (viz lib/commonsImage) —
// nahradit reálnými fotkami jednotlivých míst, jakmile je klient dodá.
const WINTER_TRIPS: TripDef[] = [
  {
    id: "zima.mlade-buky",
    image: commonsFile("Ansicht kreuzberg abfahrten 2009.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    id: "zima.bezky",
    image: commonsFile("Goms cross-country skiing.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "zima.cerna-hora",
    image: commonsFile("Meribel janvier 2008.jpg"),
    mapQuery: "SkiResort Černá hora – Pec",
    moreHref: "https://www.skiresort.cz",
  },
];

const SUMMER_TRIPS: TripDef[] = [
  {
    id: "leto.mlade-buky",
    image: commonsFile("7 Stanes Mountain bike trail - geograph.org.uk - 4844197.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    id: "leto.grund",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "leto.sejfy",
    image: commonsFile("Natural swimming hole, Brisbane Water National Park.jpg"),
    mapQuery: "Lesní plovárna Sejfy, Mladé Buky",
    moreHref: "https://www.lesniplovarna.cz",
  },
  {
    id: "leto.zoo",
    image: commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG"),
    mapQuery: "Safari Park Dvůr Králové",
    moreHref: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    id: "leto.stezka",
    image: commonsFile("Stezka korunami stromů Krkonoše 2024.jpg"),
    mapQuery: "Stezka korunami stromů, Janské Lázně",
    moreHref: "https://treetop-walks.com/krkonose/",
  },
  {
    id: "leto.adrspach",
    image: commonsFile("Adršpašskoteplické skály 02.JPG"),
    mapQuery: "Adršpašsko-teplické skály",
    moreHref: V.TIP_ADRSPACH_URL,
  },
  {
    id: "leto.snezka",
    image: commonsFile("Sněžka a Obří důl.jpg"),
    mapQuery: "Sněžka, Krkonoše",
    moreHref: V.TIP_SNEZKA_URL,
  },
  {
    id: "leto.muchomurka",
    image: commonsFile("Collingwood Children's Farm - goats.JPG"),
    mapQuery: "Farmapark Muchomůrka, Svoboda nad Úpou",
    moreHref: "http://www.farmapark-muchomurka.cz",
  },
];

const RESTAURANTS: TripDef[] = [
  {
    id: "okoli.grund",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    id: "okoli.na-kopecku",
    image: commonsFile("Jaroměř, hostinec Růžovka.jpg"),
    mapQuery: "Hostinec Na Kopečku, Horní Maršov",
    moreHref: "https://www.hostinecnakopecku.cz",
  },
];

function trips(v: Texty, defs: TripDef[]): Trip[] {
  return defs.flatMap(({ id, ...def }) => {
    const text = v.polozka(id);
    return text ? [{ ...def, title: text.t, description: text.p ?? "", distance: v.t(`${id}.vzdalenost`) }] : [];
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
        trips={trips(v, WINTER_TRIPS)}
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
        trips={trips(v, SUMMER_TRIPS)}
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
        <SubpageHero title={v.t("hero.nadpis")} subtitle={v.t("hero.podnadpis")} />

        {seasonSections}

        {v.sekce("okoli") && (
          <SeasonSection
            id="restaurace"
            icon={<UtensilsCrossed className="size-5" strokeWidth={2} aria-hidden />}
            eyebrow={v.t("okoli.nadtitulek")}
            title={v.t("okoli.nadpis")}
            subtitle={v.t("okoli.podnadpis")}
            trips={trips(v, RESTAURANTS)}
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
