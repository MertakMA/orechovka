#!/usr/bin/env node
// Stáhne aktuální novinky z Notionu a při úspěchu je uloží jako
// src/generated/news-fallback.json. lib/notion.ts z něj čte, když se
// getNews() při skutečném requestu/buildu nepodaří (výpadek Notionu) —
// místo aby sekce Novinky zmizela úplně, ukáže se poslední známý stav.
// Stejně jako u proměnných: bez klíče/ID nebo při chybě sítě jen varování,
// ponechá se naposledy commitnutá verze, dev/build kvůli tomu nespadne.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = join(ROOT, "src/generated/news-fallback.json");

function loadDotEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].trim();
  }
}
loadDotEnvLocal();

const API_KEY = process.env.NOTION_API_KEY;
const DATA_SOURCE_ID = process.env.NOTION_NEWS_DATA_SOURCE_ID;

function warn(message) {
  console.warn(`[sync-news-fallback] ${message} — ponechávám naposledy commitnutou verzi.`);
}

function readTitle(prop) {
  return prop?.title?.map((t) => t.plain_text).join("") ?? "";
}
function readRichText(prop) {
  return prop?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}
function readDate(prop) {
  return prop?.date?.start ?? null;
}
function readUrl(prop) {
  return prop?.url ?? null;
}
function readCheckbox(prop) {
  return prop?.checkbox ?? false;
}
function readFirstFileUrl(prop) {
  const first = prop?.files?.[0];
  if (!first) return null;
  return first.type === "external" ? first.external?.url ?? null : first.file?.url ?? null;
}

async function main() {
  if (!API_KEY || !DATA_SOURCE_ID) {
    warn("chybí NOTION_API_KEY nebo NOTION_NEWS_DATA_SOURCE_ID");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: API_KEY });

  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      sorts: [{ property: "Datum", direction: "descending" }],
    });
  } catch (err) {
    warn(`nepodařilo se stáhnout data z Notionu (${err.message})`);
    return;
  }

  const items = [];
  for (const page of response.results) {
    if (!("properties" in page)) continue;
    const props = page.properties;
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

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(items, null, 2) + "\n", "utf8");
  console.log(`[sync-news-fallback] hotovo — ${items.length} novinek zapsáno do src/generated/news-fallback.json`);
}

await main();
