#!/usr/bin/env node
// Stáhne databázi "Texty" z Notionu a vygeneruje src/generated/texty/<stránka>.json
// (jeden soubor na podstránku + spolecne.json pro texty sdílené napříč webem).
// Spouští se automaticky před `npm run dev`/`npm run build` (viz package.json),
// až po sync-variables — kontrola placeholderů {NAZEV} čte čerstvé proměnné.
// Bez API klíče/ID nebo při chybě sítě jen vypíše varování a ponechá naposledy
// commitnutou verzi — dev/build kvůli tomu nespadne.
// --strict: neznámý placeholder, duplicitní ID nebo neplatný řádek skončí chybou.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "src/generated/texty");
const VARIABLES_FILE = join(ROOT, "src/generated/variables.ts");
const STRICT = process.argv.includes("--strict");

// Hodnota sloupce "Stránka" v Notionu → název vygenerovaného souboru.
export const STRANKY = {
  "Společné": "spolecne",
  "Úvod": "uvod",
  "Ceník": "cenik",
  "Galerie": "galerie",
  "Výlety": "vylety",
  "Kontakt": "kontakt",
  "Stránka 404": "chyba404",
};

const SEZNAM = "Položka seznamu";
const POPISEK_FOTKY = "Popisek fotky";

function loadDotEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].trim();
  }
}

function readTitle(prop) {
  return prop?.title?.map((t) => t.plain_text).join("") ?? "";
}
function readRichText(prop) {
  return prop?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}
function readSelect(prop) {
  return prop?.select?.name ?? "";
}
function readCheckbox(prop) {
  return prop?.checkbox ?? false;
}
function readNumber(prop) {
  return typeof prop?.number === "number" ? prop.number : null;
}

function rowFromNotion(page) {
  const p = page.properties;
  return {
    nazev: readTitle(p["Název"]),
    id: readRichText(p["ID"]).trim(),
    stranka: readSelect(p["Stránka"]),
    typ: readSelect(p["Typ"]),
    cs: readRichText(p["Text CZ"]),
    en: readRichText(p["Text EN"]),
    cs2: readRichText(p["Text 2 CZ"]),
    en2: readRichText(p["Text 2 EN"]),
    ikona: readSelect(p["Ikona"]),
    skryt: readCheckbox(p["Skrýt"]),
    poradi: readNumber(p["Pořadí"]),
  };
}

function variableKeys() {
  if (!existsSync(VARIABLES_FILE)) return new Set();
  const source = readFileSync(VARIABLES_FILE, "utf8");
  return new Set([...source.matchAll(/^ {2}([A-Z][A-Z0-9_]*):/gm)].map((m) => m[1]));
}

function polozka(row, lang) {
  const t = lang === "en" ? row.en || row.cs : row.cs;
  const p = lang === "en" ? row.en2 || row.cs2 : row.cs2;
  const out = { t };
  if (p) out.p = p;
  if (row.ikona) out.i = row.ikona;
  return out;
}

function sortKeys(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}

// Čistá transformace řádků → obsah souborů. Pořadí řádků se bere podle
// sloupce Pořadí, u shody podle pořadí, v jakém je vrátil Notion.
export function sestavit(rows, variables = variableKeys()) {
  const varovani = [];
  const soubory = Object.fromEntries(Object.values(STRANKY).map((slug) => [slug, { cs: {}, en: {}, skryte: [] }]));

  const serazene = rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => (a.row.poradi ?? Infinity) - (b.row.poradi ?? Infinity) || a.index - b.index)
    .map(({ row }) => row);

  for (const row of serazene) {
    const popis = `"${row.nazev || row.id || "(bez názvu)"}"`;
    const slug = STRANKY[row.stranka];
    if (!row.id) {
      varovani.push(`řádek ${popis} nemá vyplněné ID — přeskakuji`);
      continue;
    }
    if (!slug) {
      varovani.push(`řádek ${popis} má neznámou Stránku "${row.stranka}" — přeskakuji`);
      continue;
    }
    const soubor = soubory[slug];
    const existujici = soubor.cs[row.id];

    if (row.typ === SEZNAM) {
      if (existujici && !Array.isArray(existujici)) {
        varovani.push(`ID "${row.id}" je jednou seznam a jednou samostatný text — přeskakuji ${popis}`);
        continue;
      }
      soubor.cs[row.id] ??= [];
      soubor.en[row.id] ??= [];
      if (row.skryt) continue;
      soubor.cs[row.id].push(polozka(row, "cs"));
      soubor.en[row.id].push(polozka(row, "en"));
      continue;
    }

    if (existujici) {
      varovani.push(`ID "${row.id}" je na stránce ${row.stranka} vícekrát — použije se první, ${popis} přeskakuji`);
      continue;
    }
    soubor.cs[row.id] = polozka(row, "cs");
    soubor.en[row.id] = polozka(row, "en");
    // Popisek fotky jde jen upravit — bez popisku by fotka nezmizela, jen by
    // ztratila alt text pro vyhledávače a čtečky.
    if (row.skryt && row.typ !== POPISEK_FOTKY) soubor.skryte.push(row.id);
  }

  const sdilene = new Set(Object.keys(soubory.spolecne.cs).filter((k) => /^[A-Z][A-Z0-9_]*$/.test(k)));
  for (const [slug, soubor] of Object.entries(soubory)) {
    for (const lang of ["cs", "en"]) {
      for (const [id, hodnota] of Object.entries(soubor[lang])) {
        for (const item of Array.isArray(hodnota) ? hodnota : [hodnota]) {
          for (const text of [item.t, item.p ?? ""]) {
            for (const [, klic] of text.matchAll(/\{([A-Z][A-Z0-9_]*)\}/g)) {
              if (!variables.has(klic) && !sdilene.has(klic)) {
                varovani.push(`${slug}/${id} (${lang}): neznámá proměnná {${klic}}`);
              }
            }
          }
        }
      }
    }
    soubor.cs = sortKeys(soubor.cs);
    soubor.en = sortKeys(soubor.en);
    soubor.skryte.sort();
  }

  return { soubory, varovani };
}

export function zapsat(soubory) {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [slug, obsah] of Object.entries(soubory)) {
    writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(obsah, null, 2) + "\n", "utf8");
  }
}

async function main() {
  loadDotEnvLocal();
  // Stejná integrace jako Variables — v Notionu stačí k databázi Texty
  // připojit tutéž integraci (Connections), nový klíč není potřeba.
  const API_KEY = process.env.NOTION_VARIABLES_API_KEY;
  const DATA_SOURCE_ID = process.env.NOTION_TEXTS_DATA_SOURCE_ID;

  const warn = (message) => console.warn(`[sync-texts] ${message} — ponechávám naposledy commitnutou verzi.`);

  if (!API_KEY || !DATA_SOURCE_ID) {
    warn("chybí NOTION_VARIABLES_API_KEY nebo NOTION_TEXTS_DATA_SOURCE_ID");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: API_KEY });

  let pages;
  try {
    let cursor;
    pages = [];
    do {
      const res = await notion.dataSources.query({ data_source_id: DATA_SOURCE_ID, start_cursor: cursor });
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch (err) {
    warn(`nepodařilo se stáhnout data z Notionu (${err.message})`);
    return;
  }

  const rows = pages.filter((page) => "properties" in page).map(rowFromNotion);
  if (rows.length === 0) {
    if (STRICT) {
      console.error("[sync-texts] databáze Texty je prázdná");
      process.exit(1);
    }
    warn("databáze Texty je prázdná");
    return;
  }

  const { soubory, varovani } = sestavit(rows);
  for (const message of varovani) console.warn(`[sync-texts] ${message}`);
  if (STRICT && varovani.length > 0) process.exit(1);

  zapsat(soubory);
  console.log(`[sync-texts] hotovo — ${rows.length} řádků zapsáno do src/generated/texty/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
