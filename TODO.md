# TODO – další kolo doladění


### logo - zatím nedělat

### zprovoznit formulář
Řešení: formulářová služba třetí strany (Web3Forms nebo Formspree) — formulář pošle POST
požadavek přímo na jejich endpoint, oni doručí e-mail na info@roubenkaorechovka.cz. Žádná
změna hostingu (zůstává statický export na GitHub Pages), žádný vlastní server. Nahradí
současné mailto: řešení, které na spoustě mobilů nefunguje (nemají nastavený e-mailový klient).
Čeká se na založení účtu/klíče u zvolené služby od klienta — bez toho nejde dodělat.
Až se to zapojí, potřeba i drobná úprava stránky Zpracování osobních údajů (přibude zmínka
o té službě jako příjemci údajů).

### správa fotek přes Notion - zatím nedělat
Cíl: klient fotky na webu přidá / vymění / skryje v Notionu, bez programátora.
Stejný princip, jaký už mají Novinky (`scripts/sync-news.mjs`): Notion vrací u nahraných souborů
podepsanou URL platnou jen hodinu, proto se fotky při buildu stáhnou k sobě.

Notion — nová databáze **Fotky** (vedle Texty/Variables):
- **Název** (title), **Soubor** (files), **Místo** (select), **Popisek CZ / EN** (alt text),
  **Pořadí** (number), **Skrýt** (checkbox), **Ořez** (select: nahoře / uprostřed / dole),
  **Poznámka**.
- Místa: Úvodní fotka (hero), O nás – kolotoč, Úvod – galerie (4 fotky + lightbox),
  Výhody – fotka vedle textu, Galerie – Exteriér / Interiér / Okolí, Tipy (polaroidy),
  Výlety (fotka u každého tipu — párovat přes ID řádku v Textech), úvodní fotky podstránek
  (Ceník, Galerie, Výlety, Kontakt — dnes všechny sdílí `hero-facade.jpg` v `SubpageHero`,
  každá podstránka dostane vlastní slot; klient potvrdil, že je chce měnit).
- Seznamová místa (kolotoč, kategorie galerie) = libovolný počet fotek, řazení Pořadím.
  Místa s pevným rozvržením (hero, 4 dlaždice na úvodu, fotka pece) = daný počet slotů,
  jde jen vyměnit.
- Popisky fotek přesunout z Textů (`foto.*`) sem, ať je fotka i popis na jednom řádku.

Kód:
- `scripts/sync-fotky.mjs`: stáhne databázi, soubory stáhne do `public/images/notion/`
  (název podle ID přílohy, jako u novinek → stahuje se jen nová/vyměněná fotka), smaže
  nepoužívané, zapíše `src/generated/fotky.json`. Přidat do predev/prebuild a deploy.yml.
- Zmenšení při syncu přes `sharp`: max ~2400 px delší strana, WebP ~80 %, + menší varianta
  pro dlaždice. Fotky z mobilu mají 5–10 MB, bez toho by web i repozitář nabobtnaly.
- HEIC (iPhone) přeskočit s varováním, v Notionu v Poznámce napsat, že je potřeba JPG/PNG.
- Komponenty berou fotky z `fotky.json`; když místo nemá v Notionu žádnou fotku, zůstane
  dnešní fotka z `public/images` (web nikdy nezůstane bez obrázku).
- Ořez: sloupec Ořez → `object-position` (klient neuvidí výsledek, dokud se web nepřestaví).
- Stejné bezpečnostní chování jako ostatní synky: bez klíče / při výpadku jen varování.

Otevřené otázky na klienta:
- Má fotky, které nahradí ilustrační z Wikimedia Commons (tipy, výlety, galerie Okolí)?
  Ty navíc vyžadují uvedení autora, než web půjde naostro.


