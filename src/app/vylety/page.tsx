import type { Metadata } from "next";
import Image from "next/image";
import { Snowflake, Sun, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SeasonSection from "@/components/trips/SeasonSection";
import type { Trip } from "@/components/trips/TripRow";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { commonsFile } from "@/lib/commonsImage";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Tipy na výlety",
  description: "Léto i zima v Krkonoších — lyžařské areály, koupaliště, výlety pro děti i tipy na jídlo v okolí roubenky.",
};

// TODO: dočasné ilustrační fotky z Wikimedia Commons (viz lib/commonsImage) —
// nahradit reálnými fotkami jednotlivých míst, jakmile je klient dodá.
// TODO: vzdálenosti a popisky u níže označených tipů jsou orientační — doplnit/upřesnit podle klienta.
const WINTER_TRIPS: Trip[] = [
  {
    title: "Areál Mladé Buky",
    description: "V zimě lyžařský areál s vleky pro rodiny s dětmi i pokročilé, celoročně v provozu i nejdelší bobová dráha v Krkonoších.",
    distance: "1 km pěšky / 1,8 km autem",
    image: commonsFile("Ansicht kreuzberg abfahrten 2009.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    title: "Běžecké tratě u Grund Resort Golf & Ski",
    description: "Upravované běžecké stopy přímo za humny — ideální na rychlou lyžovačku před snídaní.",
    distance: "600 m pěšky / 1 km autem",
    image: commonsFile("Goms cross-country skiing.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Skiresort Černá Hora – Pec",
    // Vzdálenost dle zadání klienta.
    description: "Největší lyžařský areál v Česku — šest propojených středisek a přes 50 km sjezdovek na jeden skipas.",
    distance: "6,5 km autem",
    image: commonsFile("Meribel janvier 2008.jpg"),
    mapQuery: "SkiResort Černá hora – Pec",
    moreHref: "https://www.skiresort.cz",
  },
];

const SUMMER_TRIPS: Trip[] = [
  {
    title: "Areál Mladé Buky",
    description: "V létě bikepark s lanovkou nahoru a dětský zábavní park Hříčky, celoročně v provozu i bobová dráha.",
    distance: "1 km pěšky / 1,8 km autem",
    image: commonsFile("7 Stanes Mountain bike trail - geograph.org.uk - 4844197.jpg"),
    mapQuery: "Areál Mladé Buky, Mladé Buky",
    moreHref: "https://mladebuky.cz",
  },
  {
    title: "Grund Resort Golf & Ski",
    description: "18jamkové golfové hřiště a wellness centrum, otevřené i pro veřejnost mimo hotelové hosty.",
    distance: "1 km autem / 600 m pěšky",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Lesní plovárna Sejfy",
    description: "Přírodní koupaliště s 50metrovým bazénem, travnatou plochou k opalování a hřišti na plážový volejbal.",
    distance: "1 km",
    image: commonsFile("Natural swimming hole, Brisbane Water National Park.jpg"),
    mapQuery: "Lesní plovárna Sejfy, Mladé Buky",
    moreHref: "https://www.lesniplovarna.cz",
  },
  {
    title: "Zoo Dvůr Králové",
    description: "Jedna z největších afrických zoo v Evropě se safari okruhem přímo mezi zvířaty.",
    distance: V.VZDALENOST_ZOO_DVUR_KRALOVE,
    image: commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG"),
    mapQuery: "Safari Park Dvůr Králové",
    moreHref: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    title: "Stezka korunami stromů",
    // Orientační vzdálenost — Janské Lázně, upřesnit.
    description: "Procházka po korunách stromů až do výšky 45 metrů s výhledy na Krkonoše ze tří světových stran.",
    distance: "9 km autem",
    image: commonsFile("Stezka korunami stromů Krkonoše 2024.jpg"),
    mapQuery: "Stezka korunami stromů, Janské Lázně",
    moreHref: "https://treetop-walks.com/krkonose/",
  },
  {
    title: "Adršpašské skály",
    description: "Bludiště pískovcových věží, soutěsek a lodní vyhlídkové plavby po Skalním jezírku.",
    distance: V.VZDALENOST_ADRSPACH,
    image: commonsFile("Adršpašskoteplické skály 02.JPG"),
    mapQuery: "Adršpašsko-teplické skály",
    moreHref: V.TIP_ADRSPACH_URL,
  },
  {
    title: "Sněžka",
    description: "Nejvyšší hora Česka — lanovkou z Pece pod Sněžkou nebo pěšky po jedné z několika značených tras.",
    distance: V.VZDALENOST_SNEZKA,
    image: commonsFile("Sněžka a Obří důl.jpg"),
    mapQuery: "Sněžka, Krkonoše",
    moreHref: V.TIP_SNEZKA_URL,
  },
  {
    title: "Farmapark Muchomůrka",
    // Orientační vzdálenost — Svoboda nad Úpou, upřesnit.
    description: "Farmový park se zvířátky, prolézačkami a atrakcemi pro nejmenší, mezi Janskými Lázněmi a Svobodou nad Úpou.",
    distance: "10 km autem",
    image: commonsFile("Collingwood Children's Farm - goats.JPG"),
    mapQuery: "Farmapark Muchomůrka, Svoboda nad Úpou",
    moreHref: "http://www.farmapark-muchomurka.cz",
  },
];

const RESTAURANTS: Trip[] = [
  {
    title: "Grund Resort Golf & Ski",
    description: "Restaurace v hotelovém resortu s výhledem na golfové hřiště a krkonošské kopce.",
    distance: "1 km autem / 600 m pěšky",
    image: commonsFile("Forest Dunes Panorama.jpg"),
    mapQuery: "Grund Resort Golf & Ski, Mladé Buky",
    moreHref: "https://grundresort.cz",
  },
  {
    title: "Na kopečku – Horní Maršov",
    // Orientační vzdálenost, upřesnit.
    description: "Oblíbený hostinec s českou i mezinárodní kuchyní a letní zahrádkou v centru Horního Maršova.",
    distance: "6 km autem",
    image: commonsFile("Jaroměř, hostinec Růžovka.jpg"),
    mapQuery: "Hostinec Na Kopečku, Horní Maršov",
    moreHref: "https://www.hostinecnakopecku.cz",
  },
];

export default async function VyletyPage() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-[#1a241f]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Tipy na výlety</h1>
            <p className="max-w-xl text-[15px] text-[#d9ebe3] sm:text-[17px]">
              Krkonoše v zimě i v létě — vybrali jsme, kam se z roubenky vypravit.
            </p>
          </div>
        </section>

        <SeasonSection
          id="zima"
          icon={<Snowflake className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="ZIMA"
          title="Lyže, běžky a bobovka"
          subtitle="Sjezdovky i upravené běžecké stopy, na které to z roubenky máte jen na skok."
          trips={WINTER_TRIPS}
          bgClassName="bg-[#eef3f4]"
        />

        <SeasonSection
          id="leto"
          icon={<Sun className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="LÉTO"
          title="Hory, koupání a výlety pro děti"
          subtitle="Od koupání po lesích a skalách až po safari a lanovky — na léto je toho v okolí nejvíc."
          trips={SUMMER_TRIPS}
          bgClassName="bg-cream"
          extraLink={{
            label: "Další tipy na pěší trasy v Krkonoších",
            href: "https://www.region-krkonose.cz/aktivni-vyziti/turisticke-trasy-naucne-stezky/",
          }}
        />

        <SeasonSection
          id="restaurace"
          icon={<UtensilsCrossed className="size-5" strokeWidth={2} aria-hidden />}
          eyebrow="V OKOLÍ"
          title="Restaurace v okolí"
          subtitle="Kam zajít na jídlo, když se vám nechce vařit."
          trips={RESTAURANTS}
          bgClassName="bg-white"
        />

        <CTASection
          title="Roubenka Ořechovka vás čeká"
          subtitle="Zarezervujte si pobyt jednoduše a bezpečně přes Booking.com."
        />
      </main>
      <Footer />
    </>
  );
}
