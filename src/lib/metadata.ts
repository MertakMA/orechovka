import type { Metadata } from "next";
import { V } from "@/generated/variables";
import { texty, type Locale, type Stranka } from "@/lib/texty";

// Titulek a popis podstránky z Notionu (řádky seo.titulek / seo.popis) + odkazy na jazykové verze.
// path = cesta české verze, např. "/cenik".
export function metadataStranky(stranka: Stranka, locale: Locale, path: string): Metadata {
  const t = texty(stranka, locale);
  const cs = `${V.SITE_URL}${path}`;
  const en = `${V.SITE_URL}/en${path}`;
  return {
    title: t.vzdy("seo.titulek"),
    description: t.vzdy("seo.popis"),
    alternates: { canonical: locale === "cs" ? cs : en, languages: { cs, en } },
    ...(locale === "en" && { openGraph: { locale: "en_US" } }),
  };
}
