#!/usr/bin/env node
// Stáhne databázi "Variables" z Notionu a vygeneruje src/generated/variables.ts.
// Spouští se automaticky před `npm run dev`/`npm run build` (viz package.json).
// Bez API klíče/ID nebo při chybě sítě jen vypíše varování a ponechá naposledy
// commitnutou verzi vygenerovaného souboru — dev/build kvůli tomu nespadne.
// --strict (pro ruční/CI kontrolu kvality dat): neplatný název proměnné nebo
// prázdná databáze skončí chybou místo varování. Výpadek sítě/klíče zůstává
// i ve --strict vždy jen varováním, ať hodinový rebuild na GitHub Pages
// nezačne padat kvůli dočasnému výpadku Notionu.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = join(ROOT, "src/generated/variables.ts");
const STRICT = process.argv.includes("--strict");

// Node spuštěný takhle přímo (na rozdíl od Next.js dev/build serveru) nemá
// .env.local načtené automaticky. V CI (GitHub Actions) tenhle soubor
// neexistuje vůbec — tam se použijí secrets vložené přímo do env.
function loadDotEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].trim();
  }
}
loadDotEnvLocal();

// Vlastní integrace/klíč, ne NOTION_API_KEY sdílený s Novinkami — ta má
// přístup jen k databázi Variables, News integrace zase jen k Novinkám.
// Stejné jméno by v GitHub Secrets přepsalo klíč, který už tam pro
// Novinky je.
const API_KEY = process.env.NOTION_VARIABLES_API_KEY;
const DATA_SOURCE_ID = process.env.NOTION_VARIABLES_DATA_SOURCE_ID;

function fail(message) {
  console.error(`[sync-variables] ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`[sync-variables] ${message} — ponechávám naposledy commitnutou verzi.`);
}

function readTitle(prop) {
  return prop?.title?.map((t) => t.plain_text).join("") ?? "";
}

function readRichText(prop) {
  return prop?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

async function main() {
  if (!API_KEY || !DATA_SOURCE_ID) {
    warn("chybí NOTION_VARIABLES_API_KEY nebo NOTION_VARIABLES_DATA_SOURCE_ID");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: API_KEY });

  let rows;
  try {
    let cursor;
    rows = [];
    do {
      const res = await notion.dataSources.query({ data_source_id: DATA_SOURCE_ID, start_cursor: cursor });
      rows.push(...res.results);
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch (err) {
    warn(`nepodařilo se stáhnout data z Notionu (${err.message})`);
    return;
  }

  const variables = {};
  for (const row of rows) {
    if (!("properties" in row)) continue;
    const key = readTitle(row.properties["Název proměnné"]);
    if (!key) continue;
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
      const message = `neplatný název proměnné "${key}" (má být SCREAMING_SNAKE_CASE)`;
      if (STRICT) fail(message);
      warn(`${message} — přeskakuji`);
      continue;
    }
    variables[key] = readRichText(row.properties["Hodnota"]);
  }

  const keys = Object.keys(variables).sort();
  if (keys.length === 0) {
    const message = "databáze Variables je prázdná nebo nedala žádné platné řádky";
    if (STRICT) fail(message);
    warn(message);
    return;
  }

  const body = keys.map((k) => `  ${k}: ${JSON.stringify(variables[k])},`).join("\n");
  const contents = `// Tento soubor je generovaný — needituj ho ručně, změny se přepíší.
// Vygenerováno z Notion databáze "Variables" skriptem scripts/sync-variables.mjs.
// Zdroj pravdy: https://app.notion.com/p/8292a07ec2cf4ec0b77fe7d01ab7c1a4

export const V = {
${body}
} as const;
`;

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, contents, "utf8");
  console.log(`[sync-variables] hotovo — ${keys.length} proměnných zapsáno do src/generated/variables.ts`);
}

await main();
