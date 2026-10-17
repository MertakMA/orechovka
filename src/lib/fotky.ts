import fotkyJson from "@/generated/fotky.json";
import { withBasePath } from "@/lib/basePath";
import { commonsFile } from "@/lib/commonsImage";
import { dosadit, type Locale } from "@/lib/texty";

// Fotky webu žijí v Notion databázi "Fotky" (viz FOTKY v TEXTY.md) a do
// src/generated/fotky.json + public/images/notion/ je stahuje scripts/sync-fotky.mjs.
// Když místo nemá v Notionu žádnou viditelnou fotku, použijí se VYCHOZI níže —
// web tak nikdy nezůstane bez obrázku.

export type Misto =
  | "uvod-hero"
  | "uvod-kolotoc"
  | "uvod-galerie"
  | "uvod-vyhody"
  | "uvod-tipy"
  | "galerie-exterier"
  | "galerie-interier"
  | "galerie-okoli"
  | "vylety-tipy"
  | "cenik-hero"
  | "galerie-hero"
  | "vylety-hero"
  | "kontakt-hero";

type FotkaData = { src: string; srcSm: string; alt: { cs: string; en: string }; id?: string; pozice?: string };

/** Fotka připravená pro komponentu — src = velká (lightbox, hero), srcSm = pro dlaždice. */
export type Fotka = { src: string; srcSm: string; alt: string; id?: string; pozice?: string };

const local = (path: string) => withBasePath(path);
const v = (src: string, cs: string, en: string, extra: { id?: string } = {}): FotkaData => ({
  src,
  srcSm: src,
  alt: { cs, en },
  ...extra,
});

const HERO_FACADE = local("/images/hero-facade.jpg");
const JIDELNI_STUL = v(
  local("/images/carousel-1.jpg"),
  "Jídelní stůl z masivního dřeva s výhledem do krajiny",
  "Solid wood dining table with a view of the countryside",
);
const OBYVAK = v(
  local("/images/carousel-2.png"),
  "Obývací pokoj s křesly a dřevěnými trámy",
  "Living room with armchairs and wooden beams",
);
const KUCHYN_OTEVRENA = v(
  local("/images/carousel-3.jpg"),
  "Otevřená kuchyně a obývací část roubenky",
  "Open kitchen and living area of the cabin",
);
const ZAHRADA = v(local("/images/adv-soukromi.png"), "Oplocená zahrada s kamennou zídkou", "Fenced garden with a stone wall");
const KUCHYN = v(local("/images/gallery-3.jpg"), "Kuchyně s výhledem do zahrady", "Kitchen overlooking the garden");
const KRB = v(local("/images/adv-krb.jpg"), "Kachlový krb s posezením", "Tiled stove with seating");

const SNEZKA = commonsFile("Sněžka a Obří důl.jpg");
const ZOO = commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG");
const ADRSPACH = commonsFile("Adršpašskoteplické skály 02.JPG");
const MLADE_BUKY = commonsFile("Ansicht kreuzberg abfahrten 2009.jpg");
const STEZKA = commonsFile("Stezka korunami stromů Krkonoše 2024.jpg");
const GRUND = commonsFile("Forest Dunes Panorama.jpg");

// Tipy a výlety: prázdný popisek = použije se název tipu z Textů.
const tip = (id: string, src: string) => v(src, "", "", { id });

const VYCHOZI: Record<Misto, FotkaData[]> = {
  "uvod-hero": [
    v(
      local("/images/hero-2.jpg"),
      "{NAZEV_WEBU} – dřevěná roubenka pod korunou ořešáku",
      "{NAZEV_WEBU} – a wooden log cabin framed by the walnut tree above it",
    ),
  ],
  "uvod-kolotoc": [
    JIDELNI_STUL,
    OBYVAK,
    KUCHYN_OTEVRENA,
    v(local("/images/food-bread.jpg"), "Čerstvý domácí chléb na dřevěném prkénku", "Fresh homemade bread on a wooden board"),
  ],
  "uvod-galerie": [
    v(local("/images/gallery-1.jpg"), "{NAZEV_WEBU} zvenčí", "{NAZEV_WEBU} from the outside"),
    v(local("/images/gallery-2.jpg"), "Kachlový krb s posezením", "Tiled stove with seating"),
    KUCHYN,
    v(local("/images/gallery-4.png"), "Podkrovní ložnice s vikýřem", "Attic bedroom with a dormer window"),
    JIDELNI_STUL,
    OBYVAK,
    ZAHRADA,
  ],
  "uvod-vyhody": [KRB],
  "uvod-tipy": [
    tip("tipy.snezka", SNEZKA),
    tip("tipy.zoo", ZOO),
    tip("tipy.mlade-buky", MLADE_BUKY),
    tip("tipy.adrspach", ADRSPACH),
  ],
  "galerie-exterier": [
    v(local("/images/hero.jpg"), "{NAZEV_WEBU} zvenčí v létě", "{NAZEV_WEBU} from the outside in summer"),
    v(local("/images/adv-priroda.jpg"), "Pohled na roubenku a okolní krajinu", "View of the cabin and the surrounding countryside"),
    ZAHRADA,
  ],
  "galerie-interier": [KUCHYN_OTEVRENA, JIDELNI_STUL, KRB, KUCHYN, OBYVAK],
  "galerie-okoli": [
    v(SNEZKA, "Sněžka", "Sněžka"),
    v(ZOO, "Zoo Dvůr Králové", "Dvůr Králové Zoo"),
    v(ADRSPACH, "Adršpašské skály", "Adršpach Rocks"),
    v(MLADE_BUKY, "Areál Mladé Buky", "Mladé Buky resort"),
    v(STEZKA, "Stezka korunami stromů", "Treetop Walk"),
  ],
  "vylety-tipy": [
    tip("zima.mlade-buky", MLADE_BUKY),
    tip("zima.bezky", commonsFile("Goms cross-country skiing.jpg")),
    tip("zima.cerna-hora", commonsFile("Meribel janvier 2008.jpg")),
    tip("leto.mlade-buky", commonsFile("7 Stanes Mountain bike trail - geograph.org.uk - 4844197.jpg")),
    tip("leto.grund", GRUND),
    tip("leto.sejfy", commonsFile("Natural swimming hole, Brisbane Water National Park.jpg")),
    tip("leto.zoo", ZOO),
    tip("leto.stezka", STEZKA),
    tip("leto.adrspach", ADRSPACH),
    tip("leto.snezka", SNEZKA),
    tip("leto.muchomurka", commonsFile("Collingwood Children's Farm - goats.JPG")),
    tip("okoli.grund", GRUND),
    tip("okoli.na-kopecku", commonsFile("Jaroměř, hostinec Růžovka.jpg")),
  ],
  "cenik-hero": [v(HERO_FACADE, "", "")],
  "galerie-hero": [v(HERO_FACADE, "", "")],
  "vylety-hero": [v(HERO_FACADE, "", "")],
  "kontakt-hero": [v(HERO_FACADE, "", "")],
};

const NOTION = (fotkyJson as { mista: Partial<Record<Misto, FotkaData[]>> }).mista;

// Fotky stažené z Notionu leží v public/ — basePath se jim musí přidat ručně
// (next/image s unoptimized ho sám nepřidá). Vložené odkazy zůstávají beze změny.
const PUBLIC_NOTION = "/images/notion";
const zNotionu = (src: string) => (src.startsWith(`${PUBLIC_NOTION}/`) ? withBasePath(src) : src);

function priprav(data: FotkaData, locale: Locale): Fotka {
  return {
    src: zNotionu(data.src),
    srcSm: zNotionu(data.srcSm),
    alt: dosadit(data.alt[locale] || data.alt.cs, locale),
    id: data.id,
    pozice: data.pozice,
  };
}

/** Všechny fotky místa (seznamová místa: kolotoč, galerie…) v pořadí z Notionu. */
export function fotky(misto: Misto, locale: Locale): Fotka[] {
  const notion = NOTION[misto];
  const data = notion && notion.length > 0 ? notion : VYCHOZI[misto];
  return data.map((d) => priprav(d, locale));
}

/** Jedna fotka místa — první viditelná, u tipů/výletů ta s daným ID. */
export function fotka(misto: Misto, locale: Locale, id?: string): Fotka {
  const najdi = (list: FotkaData[] | undefined) => (id ? list?.find((d) => d.id === id) : list?.[0]);
  const data = najdi(NOTION[misto]) ?? najdi(VYCHOZI[misto]) ?? VYCHOZI[misto][0];
  return priprav(data, locale);
}
