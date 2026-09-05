import { cache } from "react";
import { Client } from "@notionhq/client";
import newsFallbackJson from "@/generated/news-fallback.json";

export type NewsItem = {
  id: string;
  title: string;
  date: string | null;
  text: string;
  imageUrl: string | null;
  link: string | null;
  // Text odkazu z Notionu — text tlačítka, za kterým se v popupu schová
  // `link`. Prázdné/chybí = použije se rozumný výchozí text v komponentě.
  linkText: string | null;
};

const API_KEY = process.env.NOTION_API_KEY;
const DATA_SOURCE_ID = process.env.NOTION_NEWS_DATA_SOURCE_ID;

// Naposledy úspěšně stažené novinky (scripts/sync-news-fallback.mjs, commitnutý
// soubor) — použije se, když getNews() dole selže na chybě sítě/API. Skutečně
// prázdná databáze se od tohohle neliší jinak, než že fallback sám bude [].
const newsFallback = newsFallbackJson as NewsItem[];

type NotionText = { plain_text: string };
type NotionFile = { type: "external" | "file"; external?: { url: string }; file?: { url: string } };

function readTitle(prop: unknown): string {
  const arr = (prop as { title?: NotionText[] } | undefined)?.title;
  return arr?.map((t) => t.plain_text).join("") ?? "";
}

function readRichText(prop: unknown): string {
  const arr = (prop as { rich_text?: NotionText[] } | undefined)?.rich_text;
  return arr?.map((t) => t.plain_text).join("") ?? "";
}

function readDate(prop: unknown): string | null {
  return (prop as { date?: { start?: string } } | undefined)?.date?.start ?? null;
}

function readUrl(prop: unknown): string | null {
  return (prop as { url?: string } | undefined)?.url ?? null;
}

function readCheckbox(prop: unknown): boolean {
  return (prop as { checkbox?: boolean } | undefined)?.checkbox ?? false;
}

function readFirstFileUrl(prop: unknown): string | null {
  const files = (prop as { files?: NotionFile[] } | undefined)?.files;
  const first = files?.[0];
  if (!first) return null;
  return first.type === "external" ? first.external?.url ?? null : first.file?.url ?? null;
}

/**
 * Načte publikované novinky z Notion databáze ("Novinky – Roubenka Ořechovka").
 * Klient je přidává sám v Notionu — pokud databáze není nastavená (chybí env
 * proměnné) nebo je opravdu prázdná, vrátí se prázdné pole a sekce na webu
 * se skryje. Selže-li ale dotaz samotný (výpadek Notionu/sítě), vrátí se
 * naposledy známé novinky (newsFallback) místo prázdného pole — ať kvůli
 * dočasnému výpadku sekce nezmizí celá.
 *
 * Obalené v React cache() — voláme to jak z NewsSection, tak z každé
 * stránky (kvůli odkazu "Novinky" v navbaru), a takhle se v rámci jednoho
 * buildu/renderu na Notion sáhne jen jednou, ne vícekrát zbytečně.
 */
export const getNews = cache(async (): Promise<NewsItem[]> => {
  if (!API_KEY || !DATA_SOURCE_ID) return newsFallback;

  try {
    const notion = new Client({ auth: API_KEY });
    const response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      sorts: [{ property: "Datum", direction: "descending" }],
    });

    const items: NewsItem[] = [];
    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const props = page.properties as Record<string, unknown>;

      if (readCheckbox(props["Skrýt"])) continue;

      const title = readTitle(props["Název"]);
      if (!title) continue;

      items.push({
        id: page.id,
        title,
        date: readDate(props["Datum"]),
        text: readRichText(props["Text"]),
        imageUrl: readFirstFileUrl(props["Obrázek"]),
        link: readUrl(props["Odkaz"]),
        linkText: readRichText(props["Text odkazu"]) || null,
      });
    }
    return items;
  } catch (err) {
    console.error("Nepodařilo se načíst novinky z Notionu:", err);
    return newsFallback;
  }
});
