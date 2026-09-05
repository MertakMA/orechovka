import newsJson from "@/generated/news.json";

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

// Novinky se za běhu ani při renderu z Notionu nestahují — udělá to
// scripts/sync-news.mjs před buildem a zapíše výsledek do
// src/generated/news.json (soubor je commitnutý). Důvody jsou dva:
//
// 1. Obrázky. Notion u nahraných souborů vrací podepsanou URL platnou hodinu.
//    Ve statickém exportu by se zapekla do HTML a po hodině by obrázek zmizel.
//    Skript je proto stáhne do public/images/novinky/ a sem uloží lokální cestu.
// 2. Odolnost. Build nesahá na síť, takže výpadek Notionu ho nemůže ovlivnit —
//    použije se poslední commitnutý stav včetně obrázků.
//
// Prázdné pole = v Notionu opravdu žádné novinky nejsou; sekce se pak na webu
// vůbec nezobrazí (viz NewsSection).
const news = newsJson as unknown as NewsItem[];

export async function getNews(): Promise<NewsItem[]> {
  return news;
}
