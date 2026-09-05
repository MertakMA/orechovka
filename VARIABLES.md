# Proměnné webu Roubenka Ořechovka

Provozní hodnoty, které se v čase mění (kontakty, poloha, odkazy, parametry objektu, ceny,
poplatky, pravidla pobytu, vzdálenosti), žijí v Notion databázi **Variables** — ne přímo v kódu.
Ve webu je vidíš jako `V.NAZEV` (import z `@/generated/variables`).

`src/generated/variables.ts` je **generovaný, ale commitnutý** soubor. Stahuje ho
`scripts/sync-variables.mjs` automaticky před `npm run dev`/`npm run build` (`predev`/`prebuild`
v `package.json`). Bez `NOTION_VARIABLES_API_KEY`/`NOTION_VARIABLES_DATA_SOURCE_ID` nebo při chybě sítě
skript jen vypíše varování a nechá poslední commitnutou verzi — dev/build kvůli tomu nespadne.

**Zdroj pravdy:** [Variables](https://app.notion.com/p/8292a07ec2cf4ec0b77fe7d01ab7c1a4) v Notionu
(filtrovatelné podle sloupce *Sekce*)

**45 proměnných** v 7 sekcích. Stav ke dni **5. 9. 2026**, ověřeno proti kódu — homepage a
`/cenik` teď renderují stejné ceny ze stejných proměnných, duplicitní konstanty (`MAP_QUERY`,
`SOCIAL_LINKS` hodnoty) jsou pryč.

Texty webu — nadpisy, popisky, texty tlačítek, SEO titulky, znění FAQ, texty výhod a názvy
výletních cílů — sem **nepatří** a zůstávají v kódu. Do proměnných se jen vkládají čísla/odkazy
(např. odpověď FAQ na check-in zůstává celá napsaná v kódu, jen s `${V.CHECK_IN}` uvnitř).

⚠️ = hodnota není finální (placeholder od klienta). Souhrn je [na konci](#placeholdery-k-doplneni-od-klienta).

---

## Kontakt & poloha

| Proměnná | Hodnota | Kde v kódu |
| --- | --- | --- |
| `KONTAKT_EMAIL` | info@roubenkaorechovka.cz | `kontakt/page.tsx → CONTACT_CARDS`, `Footer.tsx → CONTACT_LINES`, `ContactForm.tsx` (mailto + fallback text) |
| `KONTAKT_TELEFON` | +420 XXX XXX XXX ⚠️ | `kontakt/page.tsx → CONTACT_CARDS`, `Footer.tsx → CONTACT_LINES`, `ContactForm.tsx → placeholder`. `tel:` odkaz se skládá v místě použití (`.replace(/\s+/g, "")`) |
| `ADRESA_RADEK_1` | Mladé Buky, u kostela | `MapSection.tsx`, `kontakt/page.tsx → CONTACT_CARDS` (spojeno s `ADRESA_RADEK_2` přes „ — ") |
| `ADRESA_RADEK_2` | 542 23, okres Trutnov ⚠️ chybí číslo popisné | `MapSection.tsx`, `kontakt/page.tsx → CONTACT_CARDS` |
| `GPS_LAT` | 50.6065 ⚠️ poloha obce, ne roubenky | `lib/weather.ts → CABIN_COORDS` (`Number(V.GPS_LAT)`) |
| `GPS_LON` | 15.8336 ⚠️ poloha obce, ne roubenky | `lib/weather.ts → CABIN_COORDS` |
| `MAPA_QUERY` | Mladé Buky, kostel svaté Kateřiny Alexandrijské ⚠️ | `MapSection.tsx`, `kontakt/page.tsx` — obě skládají `MAP_EMBED_SRC` ze stejné proměnné |

## Odkazy

| Proměnná | Hodnota | Kde v kódu |
| --- | --- | --- |
| `SITE_URL` | https://roubenkaorechovka.cz ⚠️ doména nenasazená | `layout.tsx`, `sitemap.ts`, `robots.ts` |
| `BOOKING_URL` | https://www.booking.com ⚠️ obecný, ne přímý odkaz na objekt | `Hero.tsx`, `Navbar.tsx` (2×), `Footer.tsx → COLUMNS`, `CTASection.tsx`/`PriceCard.tsx` (výchozí `buttonHref`), `kontakt/page.tsx → CONTACT_CARDS` |
| `FACEBOOK_URL` | `#` ⚠️ nikam nevede | `kontakt/page.tsx → SOCIAL_LINKS`, `Footer.tsx → SOCIAL_LINKS` |
| `INSTAGRAM_URL` | `#` ⚠️ nikam nevede | `kontakt/page.tsx → SOCIAL_LINKS`, `Footer.tsx → SOCIAL_LINKS` |
| `WEBKAMERA_STRANKA_URL` | https://www.holidayinfo.cz/cs/camera/mbuky/2084 | `WeatherSection.tsx` |
| `WEBKAMERA_VIDEO_URL` | exports.holidayinfo.cz/... ⚠️ externí služba, `dc`/`camid` se mohou změnit | `WebcamPlayer.tsx` |
| `TIP_SNEZKA_URL` | https://www.snezka.cz ⚠️ ověřit s klientem | `TipsSection.tsx → TIPS` |
| `TIP_ZOO_DVUR_KRALOVE_URL` | https://safaripark.cz ⚠️ ověřit s klientem | `TipsSection.tsx → TIPS` |
| `TIP_RYCHORY_URL` | https://cs.wikipedia.org/wiki/Rýchory ⚠️ Wikipedie, nahradit lepším zdrojem | `TipsSection.tsx → TIPS` |
| `TIP_ADRSPACH_URL` | https://www.adrspach.cz ⚠️ ověřit s klientem | `TipsSection.tsx → TIPS` |

`SOCIAL_LINKS` zůstává deklarované ve dvou souborech (kontakt/page.tsx má navíc barvy/ikony pro
kulatá tlačítka, Footer.tsx ne — jiná prezentace), ale obě čtou stejné `V.FACEBOOK_URL`/
`V.INSTAGRAM_URL` — duplicitní byla jen hodnota, ne struktura.

## Parametry objektu

| Proměnná | Hodnota | Kde v kódu |
| --- | --- | --- |
| `POCET_LOZNIC` | 3 ⚠️ ověřit u klienta | `Stats.tsx → STATS` |
| `KAPACITA` | 8 osob ⚠️ ověřit u klienta | `Stats.tsx → STATS` |
| `POCET_KOUPELEN` | 1 ⚠️ ověřit u klienta | `Stats.tsx → STATS` |
| `VELIKOST_ZAHRADY` | 500 m² ⚠️ ověřit u klienta | `Stats.tsx → STATS` |
| `POCET_PARKOVACICH_MIST` | 2 | `cenik/page.tsx → INCLUDED` („Parkování na pozemku (2 místa)"), `kontakt/page.tsx → DIRECTIONS` |

## Ceny

Jedna kanonická sada, stejná na homepage (`PricingSection.tsx → PLANS`) i na `/cenik`
(`cenik/page.tsx → PLANS`) — obě stránky teď ukazují stejné tři karty.

| Proměnná | Hodnota |
| --- | --- |
| `CENA_HLAVNI_SEZONA` | od 4 500 Kč |
| `TERMIN_HLAVNI_SEZONA` | Červen – srpen, svátky |
| `CENA_VEDLEJSI_SEZONA` | od 3 200 Kč |
| `TERMIN_VEDLEJSI_SEZONA` | Květen, září, říjen |
| `CENA_MIMO_SEZONU` | od 2 500 Kč |
| `TERMIN_MIMO_SEZONU` | Listopad – duben |

## Poplatky

Vše v `cenik/page.tsx → FEES`.

| Proměnná | Hodnota |
| --- | --- |
| `POPLATEK_TURISTICKA_TAXA` | dle aktuálního sazebníku obce ⚠️ upřesnit |
| `POPLATEK_UKLID` | 800 Kč (nebo sami uklidíte) |
| `POPLATEK_MAZLICCI` | po dohodě, příplatek 200 Kč/noc |
| `POPLATEK_POZDNI_CHECKOUT` | po dohodě, příplatek 300 Kč |
| `POPLATEK_VIKEND` | od 2 800 Kč za noc (pá–ne mimo sezónu) — dřív samostatná 3. karta ceníku, teď poplatek |

## Pravidla pobytu

| Proměnná | Hodnota | Kde v kódu |
| --- | --- | --- |
| `CHECK_IN` | od 15:00 | `kontakt/page.tsx → PRACTICAL_INFO`, `FAQAccordion.tsx → FAQ` |
| `CHECK_OUT` | do 10:00 | `kontakt/page.tsx → PRACTICAL_INFO`, `FAQAccordion.tsx → FAQ` |
| `MIN_DELKA_POBYTU` | 2 noci | `cenik/page.tsx` (text pod nadpisem), `FAQAccordion.tsx → FAQ` (2× v odpovědi) |
| `MIN_DELKA_POBYTU_HLAVNI_SEZONA` | 3 noci | `FAQAccordion.tsx → FAQ` |

## Vzdálenosti

| Proměnná | Hodnota | Kde v kódu |
| --- | --- | --- |
| `VZDALENOST_TRUTNOV_KM` | 5 km | `AdvantagesSection.tsx → ADVANTAGES`, `kontakt/page.tsx → DIRECTIONS` (2×, „cca 5 km") |
| `VZDALENOST_TRUTNOV_MIN` | 5 min | `MapSection.tsx` |
| `VZDALENOST_SNEZKA` | 20 km | `AdvantagesSection.tsx → ADVANTAGES`, `TipsSection.tsx → TIPS` |
| `VZDALENOST_ZOO_DVUR_KRALOVE` | 20 km | `AdvantagesSection.tsx → ADVANTAGES`, `TipsSection.tsx → TIPS` |
| `VZDALENOST_RYCHORY` | 3 km | `TipsSection.tsx → TIPS` |
| `VZDALENOST_ADRSPACH` | 30 km | `TipsSection.tsx → TIPS` |
| `VZDALENOST_HRADEC_KRALOVE` | 30 min | `MapSection.tsx` |
| `VZDALENOST_PEC_POD_SNEZKOU` | 20 min | `MapSection.tsx` |

---

## Hodnoty skládané z proměnných v místě použití

Nejsou samostatným řádkem v Notionu ani ve `variables.ts` — vznikl by druhý zdroj pravdy, který
by se mohl rozejít. Skládají se přímo v kódu z hodnot výše:

| Skládaná hodnota | Z čeho | Kde |
| --- | --- | --- |
| `tel:` odkaz na telefon | `KONTAKT_TELEFON` bez mezer | `kontakt/page.tsx`, `Footer.tsx` |
| `mailto:` odkaz na e-mail | `KONTAKT_EMAIL` | `kontakt/page.tsx`, `Footer.tsx`, `ContactForm.tsx` |
| Google Maps embed URL | `MAPA_QUERY` | `MapSection.tsx`, `kontakt/page.tsx` |
| Celá adresa na kartě Kontakt | `ADRESA_RADEK_1` + „ — " + `ADRESA_RADEK_2` | `kontakt/page.tsx` |
| GPS jako čísla pro Open-Meteo | `Number(GPS_LAT)`, `Number(GPS_LON)` | `lib/weather.ts` |
| Rok v patičce | `new Date()` — nepokazí se v lednu | `Footer.tsx` |

## Novinky — samostatný mechanismus, ne proměnné

Sekce Novinky nejede přes `variables.ts` (vlastní Notion databáze, ne Variables). Má vlastní
generovaný soubor `src/generated/news-fallback.json`, plněný `scripts/sync-news-fallback.mjs`
(spouští se spolu se sync-variables v `predev`/`prebuild`). `getNews()` v `lib/notion.ts` ho
použije, když živý dotaz na Notion selže (výpadek) nebo chybí konfigurace — místo aby sekce
zmizela, ukáže se poslední známý stav. Skutečně prázdná databáze (bez chyby) se chová beze
změny — vrátí se prázdné pole a sekce zmizí.

## Placeholdery k doplnění od klienta

| Co | Proměnné |
| --- | --- |
| Telefonní číslo | `KONTAKT_TELEFON` |
| Přesná adresa (číslo popisné) | `ADRESA_RADEK_1`, `MAPA_QUERY` |
| GPS roubenky (teď jen obec) | `GPS_LAT`, `GPS_LON` |
| Přímý odkaz na objekt na Bookingu | `BOOKING_URL` |
| Sociální sítě | `FACEBOOK_URL`, `INSTAGRAM_URL` |
| Parametry objektu | `POCET_LOZNIC`, `KAPACITA`, `POCET_KOUPELEN`, `VELIKOST_ZAHRADY` |
| Turistická taxa dle obce | `POPLATEK_TURISTICKA_TAXA` |
| Ověřit odkazy na výletní cíle | `TIP_SNEZKA_URL`, `TIP_ZOO_DVUR_KRALOVE_URL`, `TIP_RYCHORY_URL`, `TIP_ADRSPACH_URL` |

Ať placeholdery neplet klienta v Notionu — do sloupce **Poznámka** u dané proměnné napsat, co
ještě čeká na doplnění.

## Hodnoty na více místech v kódu

| Proměnná | Počet |
| --- | --- |
| `BOOKING_URL` | 7 výskytů v 6 souborech |
| `SITE_URL` | 3 soubory |
| `KONTAKT_EMAIL` | 3 soubory |
| `KONTAKT_TELEFON` | 3 soubory |
| `ADRESA_RADEK_1`, `ADRESA_RADEK_2`, `MAPA_QUERY`, `FACEBOOK_URL`, `INSTAGRAM_URL`, `CHECK_IN`, `CHECK_OUT`, `MIN_DELKA_POBYTU`, `POCET_PARKOVACICH_MIST`, `VZDALENOST_TRUTNOV_KM`, `VZDALENOST_SNEZKA`, `VZDALENOST_ZOO_DVUR_KRALOVE` | 2 soubory |

Při změně hodnoty v Notionu se všechna tahle místa aktualizují sama při dalším buildu — nic
z tohohle se neupravuje ručně v kódu.
