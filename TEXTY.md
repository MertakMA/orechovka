# Texty webu Roubenka Ořechovka

Téměř všechny texty webu (nadpisy, odstavce, tlačítka, FAQ, vybavení, výlety, SEO)
žijí v Notion databázi **Texty** — ne v kódu. Čísla, ceny, kontakty a odkazy dál zůstávají
ve **Variables** (viz [VARIABLES.md](VARIABLES.md)), fotky a jejich popisky v databázi **Fotky**
(viz [Fotky](#fotky) níže).

**Zdroj pravdy:** [Obsah webu – texty](https://app.notion.com/p/3e5233e52cec818aaf3ed1a739d31e58)
(návod pro klienta nahoře, pod ním databáze se záložkou pro každou podstránku)

## Jak to funguje

`scripts/sync-texts.mjs` stáhne databázi před `npm run dev`/`npm run build` (po sync-variables)
a zapíše `src/generated/texty/<stránka>.json` — jeden soubor na podstránku:

| Stránka v Notionu | Soubor | Co obsahuje |
| --- | --- | --- |
| Společné | `spolecne.json` | menu, patička, název webu, SEO webu, cenové karty, sdílené CTA |
| Úvod | `uvod.json` | všechny sekce úvodní stránky |
| Ceník | `cenik.json` | `/cenik` včetně FAQ a poplatků |
| Galerie | `galerie.json` | `/galerie` |
| Výlety | `vylety.json` | `/vylety` |
| Kontakt | `kontakt.json` | `/kontakt` včetně formuláře |
| Stránka 404 | `chyba404.json` | `not-found.tsx` |

JSONy jsou **generované, ale commitnuté**. Bez `NOTION_VARIABLES_API_KEY` / `NOTION_TEXTS_DATA_SOURCE_ID`
nebo při výpadku Notionu skript jen vypíše varování a nechá poslední verzi. `--strict` skončí chybou
i při neznámé proměnné nebo duplicitním ID.

Klíč je stejný jako u Variables — v Notionu stačí k databázi Texty připojit integraci
**Orechovka** (⋯ → Connections). Data source ID: `c6eaa721-9d1b-4478-9098-a856ec55e043`.

## V kódu

```ts
import { texty } from "@/lib/texty";
const c = texty("cenik", locale);
c.t("hero.nadpis");           // string | null — null = skryté v Notionu → prvek nevykreslovat
c.polozka("karta.email");     // { t, p?, i? } | null — Text, Text 2, Ikona
c.vzdy("formular.odeslat");   // string — ignoruje Skrýt (povinná pole, alt texty, SEO)
c.seznam("faq.polozky");      // Polozka[] — skryté vyřazené, seřazené podle Pořadí
c.sekce("poplatky");          // false = celá sekce skrytá
```

- **Typ** řádku: `Text`, `Položka seznamu` (víc řádků se stejným ID = seznam, klient přidává
  duplikováním), `Celá sekce` (bez textu, jen Skrýt), `Popisek fotky` (Skrýt se ignoruje).
- **Placeholdery** `{NAZEV}` se dosazují při renderu podle jazyka: nejdřív proměnná z Variables
  (`V` / `V_EN`), pak řádek ze Společné s ID velkými písmeny (dnes `NAZEV_WEBU`).
- **EN** prázdné = použije se CZ (řeší sync).
- `\n` v textu → `<br />` přes `components/Radky.tsx`. Souhlas ve formuláři: `[text]` = odkaz.
- **Ikony** (`Ikona` select) → `lib/ikony.ts`. Nová možnost v Notionu = přidat i do mapy v kódu.
- **Cenové karty** (`lib/ceny.ts`): `ceny.<karta>` název, `.obdobi` sezóny vedle sebe (Text 2 = termín),
  `.pobyty` typy pobytů (Text 2: 1. řádek cena, další řádky dny/termín/poznámka — úvod ukazuje jen
  název + cenu), `ceny.vlastnosti` + `.navic` = „Cena zahrnuje“. Karty: `vedlejsi`, `hlavni`, `vanoce`.
- Struktura (fotky, odkazy, ikony sekcí, počty lůžek, pořadí sekcí) zůstává v kódu a texty se
  k ní párují přes ID — viz `FLOORS`/`GROUPS` v AdvantagesSection, `TIPS` v `lib/tips.ts`,
  `*_TRIPS` ve VyletyPage, `CONTACT_CARDS` v KontaktPage.

### Přidání nového textu na web
1. V kódu použij `texty(stranka, locale).t("nove.id")`.
2. V Notionu přidej řádek se stejným ID, Stránkou, Typem a vyplněným „Kde na stránce“.
3. `npm run dev` (sync) nebo doplň JSON ručně, když nemáš klíč.

## Fotky

Databáze **Fotky** leží na stejné Notion stránce pod Texty (data source
`14a87357-18e3-42d7-ad0a-c9ab16e2c82a`, env `NOTION_FOTKY_DATA_SOURCE_ID`, klíč stejný jako u Variables).
Sloupce: Název, Soubor, Místo, Popisek CZ / EN (alt text, jde v něm psát `{PROMENNA}`), Skrýt,
Pořadí, Ořez (Nahoře / Uprostřed / Dole → `object-position`), ID (párování s tipem / výletem), Poznámka.

`scripts/sync-fotky.mjs` (po sync-texts) nahrané soubory stáhne, přes `sharp` zmenší na max 1920 px
WebP + variantu `-sm` (900 px) do `public/images/notion/<id přílohy>.webp` (stahuje jen nové,
nepoužité maže) a zapíše `src/generated/fotky.json`. Externí odkazy (Wikimedia) zůstávají jako URL.
HEIC sharp neumí — klient musí nahrát JPG/PNG.

```ts
import { fotky, fotka } from "@/lib/fotky";
fotky("galerie-interier", locale);         // Fotka[] — seznamová místa (kolotoč, galerie)
fotka("uvod-tipy", locale, "tipy.snezka"); // Fotka — první, nebo podle ID
```

Místa (select Místo → slug) jsou v `MISTA` ve sync skriptu a v typu `Misto` v `lib/fotky.ts`.
Když místo nemá v Notionu žádnou viditelnou fotku, použijí se výchozí fotky z `VYCHOZI`
v `lib/fotky.ts` — web nikdy nezůstane bez obrázku. Nové místo = přidat možnost v Notionu,
do `MISTA`, do `Misto` a výchozí fotku do `VYCHOZI`.

Popisky fotek (`foto.*`) se z Textů přesunuly sem; v Textech zůstal jen `mapa.titulek`.

## Záměrně v kódu
- Stránka Zpracování osobních údajů (právní text).
- Popisky pro čtečky (`aria-label`), přepínač jazyka EN/CS, názvy dnů a počasí v `lib/weather.ts`.
- Názvy značek (e-chalupy) v URL, `mailto:`/`tel:` odkazy. ID `menu.booking` a `karta.booking` zůstala
  z dob Bookingu, dnes nesou odkaz na e-chalupy.
- Stránka 404 je jen česká (statický export má jednu 404).
