# TODO – další kolo doladění

## Sjednocení proměnných a jejich načítání z Notionu

> ### ⛔ Pravidlo pro AI asistenty
>
> **Tento úkol se nikdy nezačíná plnit sám od sebe.** Ani částečně, ani „jen přípravný krok".
>
> Před jakýmkoli zásahem do souborů asistent nejdřív předloží ke schválení:
> - seznam všech souborů, kterých se změna dotkne,
> - co přesně se v každém z nich mění a proč,
> - co se mění v Notionu (databáze **Variables**),
> - co se tím rozbije nebo může rozbít.
>
> Teprve po **výslovném odsouhlasení** se smí sáhnout na první soubor. Bez odpovědi se nepokračuje.

**Cíl:** hodnoty, které se v čase mění (kontakty, ceny, odkazy, parametry objektu), mít na jednom místě
v Notionu a do webu je dostávat generovaným souborem při buildu. Podklad a soupis všech
45 proměnných je ve `VARIABLES.md`, zdroj pravdy je databáze
[Variables](https://app.notion.com/p/8292a07ec2cf4ec0b77fe7d01ab7c1a4).

### Odsouhlasená rozhodnutí

- **Mechanismus:** generovaný soubor při buildu (`src/generated/variables.ts`), commitnutý do
  gitu. Žádné načítání z Notionu za běhu — web na Notion po nasazení nesahá.
- **Kanonický ceník:** ceny z úvodní stránky (4 500 / 3 200 / 2 500 Kč). Stránka `/cenik` se
  na ně překlopí.
- **Víkendová sazba:** karta „Víkend mimo sezónu, od 2 800 Kč" se ruší, hodnota se přesune mezi
  doplňkové poplatky jako `POPLATEK_VIKEND`. Obě stránky pak mají stejné tři karty a mřížka
  zůstane tříslupcová.
- **Rozsah:** v Notionu jsou jen provozní údaje (45 proměnných). Texty webu — nadpisy,
  popisky, texty tlačítek, SEO titulky, znění FAQ, texty výhod a názvy výletních cílů —
  zůstávají v kódu. Externí odkazy jsou proměnné, včetně odkazů na výletní cíle.
- **Novinky:** `getNews()` má v `catch` použít poslední známé novinky místo prázdného pole.
  Chování při skutečně prázdné databázi zůstává beze změny — sekce se nezobrazí.

### Kroky

- [x] **Synchronizační skript** `scripts/sync-variables.mjs` — stáhne datový zdroj Variables a
      zapíše `src/generated/variables.ts`. Při chybě sítě/klíče vypíše varování a ponechá
      commitnutou verzi (build nespadne), `--strict` pro ruční/CI kontrolu kvality dat (neplatný
      název proměnné nebo prázdná databáze skončí chybou i tak). **Odchylka od zadání:** žádné
      `{PLACEHOLDERY}` ani dopočítávání odvozených hodnot — živá data v Notionu žádný takový
      zápis nepoužívají (žádná hodnota neobsahuje `{...}`), takže by šlo o neotestovanou
      funkčnost navíc. Snadno se doplní, až/pokud bude potřeba.
- [x] **Napojení do buildu** — `prebuild`/`predev` v `package.json` (spouští i
      `scripts/sync-news-fallback.mjs`, viz níž), `NOTION_VARIABLES_DATA_SOURCE_ID` doplněn do
      `.env.local.example` a do `.github/workflows/deploy.yml`. **Zbývá ruční krok mimo kód:**
      přidat `NOTION_VARIABLES_DATA_SOURCE_ID` jako repozitářový secret na GitHubu (Settings →
      Secrets and variables → Actions) — bez toho hodinový rebuild proměnné nestáhne (jen
      použije poslední commitnutou verzi, nic nespadne).
- [x] **Úklid databáze Variables v Notionu** — hotovo 3. 9. 2026. Databáze obsahuje 45
      provozních proměnných v 7 sekcích (Kontakt & poloha, Odkazy, Parametry objektu, Ceny,
      Poplatky, Pravidla pobytu, Vzdálenosti). Ceny sjednoceny na jednu kanonickou sadu podle
      úvodní stránky, `POPLATEK_VIKEND` přesunut mezi poplatky, `VZDALENOST_TRUTNOV` rozdělena
      na `_KM` a `_MIN`, přidány `VZDALENOST_RYCHORY` a `VZDALENOST_ADRSPACH`. Odvozené hodnoty
      a deploy konfigurace v databázi nejsou. Původní databáze se 142 řádky je v koši Notionu.
- [x] **Přepis komponent** — hotovo ve všech souborech ze zadání (`Stats.tsx`,
      `PricingSection.tsx`, `cenik/page.tsx`, `kontakt/page.tsx`, `kontakt/ContactForm.tsx`,
      `Footer.tsx`, `AdvantagesSection.tsx`, `TipsSection.tsx`, `pricing/FAQAccordion.tsx`,
      `MapSection.tsx`, `WebcamPlayer.tsx`, `WeatherSection.tsx`, `lib/weather.ts`,
      `layout.tsx`, `sitemap.ts`, `robots.ts`, `CTASection.tsx`, `pricing/PriceCard.tsx`,
      `Hero.tsx`, `Navbar.tsx`). Texty (nadpisy, popisky, znění FAQ, texty výhod, názvy
      výletních cílů) zůstaly v kódu, proměnné se do nich jen vkládají (např. FAQ odpověď
      zůstává celá v kódu, jen `${V.CHECK_IN}` uvnitř).
- [x] **Odstranit duplicitní konstanty** — `MAP_QUERY`/`MAP_EMBED_SRC` teď obě čtou
      `V.MAPA_QUERY`, žádná duplicitní hodnota. `SOCIAL_LINKS` zůstává deklarované ve dvou
      souborech (kontakt/page.tsx má navíc barvy/ikony, Footer.tsx ne — jiný tvar dat), ale obě
      místa čtou stejné `V.FACEBOOK_URL`/`V.INSTAGRAM_URL`, takže duplicitní byla jen hodnota,
      ne struktura — ta zůstává správně oddělená podle prezentace.
- [x] **Sjednotit ceník na `/cenik`** s úvodní stránkou — obě stránky renderují stejné tři karty
      (Vedlejší/Hlavní/Mimo sezónu) ze stejných proměnných, karta „Víkend mimo sezónu" je pryč
      z mřížky a je poplatkem (`POPLATEK_VIKEND`).
- [x] **Fallback u novinek** — nový `scripts/sync-news-fallback.mjs` (samostatný, spouští se
      spolu se sync-variables v `predev`/`prebuild`) stahuje novinky a zapisuje je do
      `src/generated/news-fallback.json` (commitnutý, výchozí `[]`). `getNews()` v `lib/notion.ts`
      teď v `catch` i při chybějící konfiguraci vrací tenhle fallback místo prázdného pole.
      Skutečně prázdná databáze (bez chyby) se chová beze změny — vrátí se prázdné pole a sekce
      zmizí.
- [x] **Kontrola** — ověřeno: `npm run build` bez `.env.local` vůbec (simulace odpojeného
      Notionu) proběhl čistě se starými hodnotami; se skutečným klíčem, ale integrací bez
      přístupu k databázi Novinky proběhl s varováním a fallbackem, ne pádem; typecheck čistý;
      proklikáno v prohlížeči (/, /cenik, /kontakt) bez chyb v konzoli a bez natvrdo zůstalé
      hodnoty (ověřeno hromadným grepem přes `src/`).

### Nezapomenout

- `VARIABLES.md` aktualizován na aktuální stav (45 proměnných, žádné 142 z minulosti).
- Změna v Notionu se na webu objeví až po rebuildu — GitHub Pages už na to má hodinový cron,
  nic dalšího řešit netřeba, dokud web zůstává na GitHub Pages.
- Placeholdery v Notionu klienta nemají mást — do sloupce Poznámka napsat, co dané pole
  znamená (např. `KONTAKT_TELEFON` = "+420 XXX XXX XXX" zatím čeká na reálné číslo).
