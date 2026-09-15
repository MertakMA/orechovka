import type { Metadata } from "next";
import Image from "next/image";
import { Snowflake, Sun, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SeasonSection from "@/components/trips/SeasonSection";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import type { Trip } from "@/components/trips/TripRow";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { commonsFile } from "@/lib/commonsImage";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Trip ideas",
  description: "Summer and winter in the Krkonoše — ski areas, swimming spots, trips for kids and food tips near the cabin.",
  alternates: {
    canonical: `${V.SITE_URL}/en/vylety`,
    languages: { cs: `${V.SITE_URL}/vylety`, en: `${V.SITE_URL}/en/vylety` },
  },
  openGraph: { locale: "en_US" },
};

// Stejná místa a fotky jako na české stránce (viz src/app/vylety/page.tsx),
// jen přeložené popisky a vzdálenosti se slovem místo českého "autem"/"pěšky".
const WINTER_TRIPS: Trip[] = [
  {
    title: "Mladé Buky resort",
    description:
      "A ski area with lifts for families and advanced skiers in winter, plus the longest bobsled track in the Krkonoše, open year-round.",
    distance: "1 km on foot / 1.8 km by car",
    image: commonsFile("Ansicht kreuzberg abfahrten 2009.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    title: "Cross-country trails at Grund Resort Golf & Ski",
    description: "Groomed cross-country tracks right on the doorstep — great for a quick ski before breakfast.",
    distance: "600 m on foot / 1 km by car",
    image: commonsFile("Goms cross-country skiing.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Skiresort Černá Hora – Pec",
    description:
      "The largest ski area in Czechia — six connected resorts and over 50 km of slopes on a single ski pass.",
    distance: "6.5 km by car",
    image: commonsFile("Meribel janvier 2008.jpg"),
    mapQuery: "SkiResort Černá hora – Pec",
    moreHref: "https://www.skiresort.cz",
  },
];

const SUMMER_TRIPS: Trip[] = [
  {
    title: "Mladé Buky resort",
    description:
      "A bike park with an uphill lift and the Hříčky kids' fun park in summer, plus a bobsled track open year-round.",
    distance: "1 km on foot / 1.8 km by car",
    image: commonsFile("7 Stanes Mountain bike trail - geograph.org.uk - 4844197.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    title: "Grund Resort Golf & Ski",
    description: "An 18-hole golf course and wellness centre, open to the public beyond hotel guests.",
    distance: "1 km by car / 600 m on foot",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Sejfy forest swimming spot",
    description: "A natural swimming area with a 50-metre pool, a grassy sunbathing lawn and beach volleyball courts.",
    distance: "1 km",
    image: commonsFile("Natural swimming hole, Brisbane Water National Park.jpg"),
    mapQuery: "Lesní plovárna Sejfy, Mladé Buky",
    moreHref: "https://www.lesniplovarna.cz",
  },
  {
    title: "Dvůr Králové Zoo",
    description: "One of the largest African-style zoos in Europe, with a safari loop right among the animals.",
    distance: V.VZDALENOST_ZOO_DVUR_KRALOVE,
    image: commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG"),
    mapQuery: "Safari Park Dvůr Králové",
    moreHref: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    title: "Treetop Walk",
    description: "A walkway through the treetops up to 45 metres high, with views of the Krkonoše from three sides.",
    distance: "9 km by car",
    image: commonsFile("Stezka korunami stromů Krkonoše 2024.jpg"),
    mapQuery: "Stezka korunami stromů, Janské Lázně",
    moreHref: "https://treetop-walks.com/krkonose/",
  },
  {
    title: "Adršpach Rocks",
    description: "A maze of sandstone towers and gorges, with boat trips across the Rock Lake.",
    distance: V.VZDALENOST_ADRSPACH,
    image: commonsFile("Adršpašskoteplické skály 02.JPG"),
    mapQuery: "Adršpašsko-teplické skály",
    moreHref: V.TIP_ADRSPACH_URL,
  },
  {
    title: "Sněžka",
    description: "The Czech Republic's highest mountain — by cable car from Pec pod Sněžkou or on foot via marked trails.",
    distance: V.VZDALENOST_SNEZKA,
    image: commonsFile("Sněžka a Obří důl.jpg"),
    mapQuery: "Sněžka, Krkonoše",
    moreHref: V.TIP_SNEZKA_URL,
  },
  {
    title: "Muchomůrka Farm Park",
    description:
      "A farm park with animals, climbing structures and attractions for the youngest, between Janské Lázně and Svoboda nad Úpou.",
    distance: "10 km by car",
    image: commonsFile("Collingwood Children's Farm - goats.JPG"),
    mapQuery: "Farmapark Muchomůrka, Svoboda nad Úpou",
    moreHref: "http://www.farmapark-muchomurka.cz",
  },
];

const RESTAURANTS: Trip[] = [
  {
    title: "Grund Resort Golf & Ski",
    description: "A restaurant at the hotel resort with views over the golf course and the Krkonoše hills.",
    distance: "1 km by car / 600 m on foot",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Na kopečku – Horní Maršov",
    description: "A popular inn serving Czech and international dishes, with a summer garden in the centre of Horní Maršov.",
    distance: "6 km by car",
    image: commonsFile("Jaroměř, hostinec Růžovka.jpg"),
    mapQuery: "Hostinec Na Kopečku, Horní Maršov",
    moreHref: "https://www.hostinecnakopecku.cz",
  },
];

export default async function VyletyPageEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]" />
          <div className="absolute inset-0 bg-[#2a1c12]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Trip ideas</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              The Krkonoše in winter and summer — our picks for a trip from the cabin.
            </p>
          </div>
        </section>

        <SeasonSection
          id="zima"
          icon={<Snowflake className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="WINTER"
          title="Skis, cross-country and a bobsled"
          subtitle="Ski slopes and groomed cross-country tracks, just a short hop from the cabin."
          trips={WINTER_TRIPS}
          season="winter"
          bgClassName="bg-cream"
          locale="en"
        />

        <SeasonSection
          id="leto"
          icon={<Sun className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="SUMMER"
          title="Mountains, swimming and trips for kids"
          subtitle="From forest and rock swimming to safari and cable cars — summer brings the most options nearby."
          trips={SUMMER_TRIPS}
          season="summer"
          bgClassName="bg-sand"
          locale="en"
          extraLink={{
            label: "More hiking trail ideas in the Krkonoše",
            href: "https://www.region-krkonose.cz/aktivni-vyziti/turisticke-trasy-naucne-stezky/",
          }}
        />

        <SeasonSection
          id="restaurace"
          icon={<UtensilsCrossed className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="NEARBY"
          title="Restaurants nearby"
          subtitle="Where to eat out when you don't feel like cooking."
          trips={RESTAURANTS}
          season="food"
          bgClassName="bg-cream"
          locale="en"
        />

        <CTASection
          title="Roubenka Ořechovka is waiting"
          subtitle="Book your stay simply and safely via Booking.com."
          buttonLabel="Book your stay via Booking.com →"
        />
      </main>
      <Footer locale="en" />
    </>
  );
}
