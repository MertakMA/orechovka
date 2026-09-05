#!/usr/bin/env node
// Stáhne novinky z Notionu a zapíše je do src/generated/news.json, ze kterého
// je pak čte src/lib/notion.ts. Obrázky, které klient v Notionu nahraje jako
// soubor, se stáhnou do public/images/novinky/ a do JSONu se uloží lokální
// cesta.
//
// Proč se obrázky stahují: Notion u nahraných souborů vrací podepsanou URL na
// S3, která platí jen hodinu. Web je statický export, takže by se taková URL
// zapekla do HTML a po hodině by obrázek zmizel (403). Stažená kopie tenhle
// problém odstraňuje úplně a přežije i výpadek Notionu.
//
// Spouští se automaticky před `npm run dev`/`npm run build` (viz package.json).
// Bez klíče/ID nebo při chybě sítě jen vypíše varování a ponechá naposledy
// commitnutou verzi JSONu i obrázků — dev/build kvůli tomu nespadne.

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = join(ROOT, "src/generated/news.json");
const IMAGES_DIR = join(ROOT, "public/images/novinky");
const PUBLIC_PREFIX = "/images/novinky";

// Formáty, které prohlížeč spolehlivě zobrazí. Cokoli jiného (typicky HEIC
// z iPhonu) se nestahuje a novinka zůstane bez obrázku — lepší než rozbitá
// ikona.
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);
const SIZE_WARN_BYTES = 2 * 1024 * 1024;

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

// Zastaví zpracování a ponechá commitnutý stav.
function bail(message) {
  console.warn(`[sync-news] ${message} — ponechávám naposledy commitnutou verzi.`);
}

// Dílčí potíž, která nezastaví celý sync.
function note(message) {
  console.warn(`[sync-news] ${message}`);
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

// Vrátí { url, isUpload } — u vloženého odkazu (external) se nic nestahuje,
// ta URL je trvalá.
function readFirstFile(prop) {
  const first = prop?.files?.[0];
  if (!first) return null;
  if (first.type === "external") {
    return first.external?.url ? { url: first.external.url, isUpload: false } : null;
  }
  return first.file?.url ? { url: first.file.url, isUpload: true } : null;
}

// Název lokálního souboru. Podepsaná URL má tvar
// .../<workspace-id>/<id-přílohy>/<původní-název.jpg>?X-Amz-... — id přílohy je
// stabilní, dokud klient obrázek nevymění, takže se soubor stahuje jen jednou
// a po výměně vznikne nový název (žádné cache potíže).
function localImageName(signedUrl) {
  let pathname;
  try {
    ({ pathname } = new URL(signedUrl));
  } catch {
    return null;
  }
  const segments = pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
  const fileName = segments.at(-1) ?? "";
  const ext = (fileName.match(/\.([a-zA-Z0-9]+)$/)?.[1] ?? "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  const rawId = segments.at(-2) ?? createHash("sha1").update(pathname).digest("hex").slice(0, 16);
  const id = rawId.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 60) || "obrazek";
  return `${id}.${ext}`;
}

async function ensureLocalImage(signedUrl, title) {
  const name = localImageName(signedUrl);
  if (!name) {
    note(`novinka "${title}": nepodporovaný formát obrázku, zůstane bez obrázku`);
    return null;
  }

  const target = join(IMAGES_DIR, name);
  const publicPath = `${PUBLIC_PREFIX}/${name}`;
  if (existsSync(target)) return publicPath;

  try {
    const res = await fetch(signedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    mkdirSync(IMAGES_DIR, { recursive: true });
    writeFileSync(target, buffer);
    if (buffer.byteLength > SIZE_WARN_BYTES) {
      const mb = (buffer.byteLength / 1024 / 1024).toFixed(1);
      note(`obrázek ${name} má ${mb} MB — zvaž menší soubor, tohle poroste v repozitáři`);
    }
    console.log(`[sync-news] stažen obrázek ${name}`);
    return publicPath;
  } catch (err) {
    note(`novinka "${title}": nepodařilo se stáhnout obrázek (${err.message}), zůstane bez obrázku`);
    return null;
  }
}

// Smaže stažené obrázky, na které už žádná novinka neodkazuje.
function pruneUnusedImages(usedNames) {
  if (!existsSync(IMAGES_DIR)) return;
  for (const file of readdirSync(IMAGES_DIR)) {
    if (usedNames.has(file)) continue;
    try {
      unlinkSync(join(IMAGES_DIR, file));
      console.log(`[sync-news] smazán nepoužívaný obrázek ${file}`);
    } catch (err) {
      note(`nepodařilo se smazat nepoužívaný obrázek ${file} (${err.message})`);
    }
  }
}

async function main() {
  if (!API_KEY || !DATA_SOURCE_ID) {
    bail("chybí NOTION_API_KEY nebo NOTION_NEWS_DATA_SOURCE_ID");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: API_KEY });

  let rows;
  try {
    let cursor;
    rows = [];
    do {
      const res = await notion.dataSources.query({
        data_source_id: DATA_SOURCE_ID,
        sorts: [{ property: "Datum", direction: "descending" }],
        start_cursor: cursor,
      });
      rows.push(...res.results);
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch (err) {
    bail(`nepodařilo se stáhnout data z Notionu (${err.message})`);
    return;
  }

  const items = [];
  const usedImageNames = new Set();

  for (const page of rows) {
    if (!("properties" in page)) continue;
    const props = page.properties;
    if (readCheckbox(props["Skrýt"])) continue;
    const title = readTitle(props["Název"]);
    if (!title) continue;

    const file = readFirstFile(props["Obrázek"]);
    let imageUrl = null;
    if (file && file.isUpload) {
      imageUrl = await ensureLocalImage(file.url, title);
      if (imageUrl) usedImageNames.add(imageUrl.slice(PUBLIC_PREFIX.length + 1));
    } else if (file) {
      // Vložený odkaz — trvalá URL, není co stahovat.
      imageUrl = file.url;
    }

    items.push({
      id: page.id,
      title,
      date: readDate(props["Datum"]),
      text: readRichText(props["Text"]),
      imageUrl,
      link: readUrl(props["Odkaz"]),
      linkText: readRichText(props["Text odkazu"]) || null,
    });
  }

  pruneUnusedImages(usedImageNames);

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(items, null, 2) + "\n", "utf8");
  console.log(`[sync-news] hotovo — ${items.length} novinek zapsáno do src/generated/news.json`);
}

await main();
