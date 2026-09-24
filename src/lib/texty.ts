import { V, V_EN } from "@/generated/variables";
import spolecne from "@/generated/texty/spolecne.json";
import uvod from "@/generated/texty/uvod.json";
import cenik from "@/generated/texty/cenik.json";
import galerie from "@/generated/texty/galerie.json";
import vylety from "@/generated/texty/vylety.json";
import kontakt from "@/generated/texty/kontakt.json";
import chyba404 from "@/generated/texty/chyba404.json";

// Texty webu žijí v Notion databázi "Texty" (viz TEXTY.md) a do
// src/generated/texty/*.json je před buildem stahuje scripts/sync-texts.mjs.

export type Locale = "cs" | "en";
export type Stranka = "spolecne" | "uvod" | "cenik" | "galerie" | "vylety" | "kontakt" | "chyba404";

// t = hlavní text, p = "Text 2" (odpověď u FAQ, hodnota u poplatku...), i = ikona.
export type Polozka = { t: string; p?: string; i?: string };

type Soubor = {
  cs: Record<string, Polozka | Polozka[]>;
  en: Record<string, Polozka | Polozka[]>;
  skryte: string[];
};

const SOUBORY = { spolecne, uvod, cenik, galerie, vylety, kontakt, chyba404 } as unknown as Record<Stranka, Soubor>;

export function promenne(locale: Locale): Record<keyof typeof V, string> {
  return locale === "en" ? V_EN : V;
}

// {NAZEV} v textu → hodnota proměnné z Variables, nebo sdílený text ze
// stránky Společné s ID velkými písmeny (ten může obsahovat další {…}).
function dosadit(text: string, locale: Locale, hloubka = 0): string {
  const vars = promenne(locale) as Record<string, string>;
  return text.replace(/\{([A-Z][A-Z0-9_]*)\}/g, (cely, klic: string) => {
    if (klic in vars) return vars[klic];
    const sdileny = SOUBORY.spolecne[locale][klic];
    if (sdileny && !Array.isArray(sdileny) && hloubka < 3) return dosadit(sdileny.t, locale, hloubka + 1);
    return cely;
  });
}

function vyresit(polozka: Polozka, locale: Locale): Polozka {
  return {
    t: dosadit(polozka.t, locale),
    p: polozka.p === undefined ? undefined : dosadit(polozka.p, locale),
    i: polozka.i,
  };
}

export function texty(stranka: Stranka, locale: Locale) {
  const soubor = SOUBORY[stranka];
  const data = soubor[locale];
  const skryte = new Set(soubor.skryte);

  const nacist = (id: string): Polozka | null => {
    const hodnota = data[id];
    if (!hodnota || Array.isArray(hodnota)) return null;
    return vyresit(hodnota, locale);
  };

  return {
    /** Text prvku, nebo null když je v Notionu skrytý (nebo řádek chybí) — pak se prvek nevykreslí. */
    t: (id: string): string | null => (skryte.has(id) ? null : (nacist(id)?.t ?? null)),
    /** Celý řádek (Text + Text 2 + ikona), null když je skrytý. */
    polozka: (id: string): Polozka | null => (skryte.has(id) ? null : nacist(id)),
    /** Text, který se zobrazí vždy — Skrýt se ignoruje (povinná pole formuláře, alt texty, SEO). */
    vzdy: (id: string): string => nacist(id)?.t ?? "",
    /** Položky seznamu (skryté jsou už vyřazené), v pořadí podle sloupce Pořadí. */
    seznam: (id: string): Polozka[] => {
      const hodnota = data[id];
      return Array.isArray(hodnota) ? hodnota.map((p) => vyresit(p, locale)) : [];
    },
    /** false = celá sekce je v Notionu skrytá. */
    sekce: (id: string): boolean => !skryte.has(id),
  };
}

export type Texty = ReturnType<typeof texty>;
