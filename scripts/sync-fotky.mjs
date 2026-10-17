#!/usr/bin/env node
// Stáhne databázi "Fotky" z Notionu a zapíše src/generated/fotky.json. Fotky
// nahrané v Notionu se stáhnou, zmenší a převedou na WebP do public/images/notion/.
//
// Proč stahovat: Notion u nahraných souborů vrací podepsanou URL platnou jen
// hodinu — ve statickém exportu by obrázek po hodině zmizel (stejně jako u
// Novinek, viz sync-news.mjs). Vložený odkaz (external) se nestahuje.
//
// Proč zmenšovat: fotky z mobilu mají 5–10 MB; web by se načítal pomalu
// a repozitář by bobtnal. Ukládá se velká verze (max 1920 px) a malá
// pro dlaždice (max 900 px).
//
// Bez klíče/ID nebo při výpadku jen varování — zůstane commitnutá verze.
// --strict: neznámé Místo nebo nepodporovaný soubor skončí chybou.

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = join(ROOT, "src/generated/fotky.json");
const IMAGES_DIR = join(ROOT, "public/images/notion");
const PUBLIC_PREFIX = "/images/notion";
const STRICT = process.argv.includes("--strict");

const VELKA = 1920;
const MALA = 900;
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "tif", "tiff"]);

// Hodnota sloupce "Místo" v Notionu → klíč v kódu (src/lib/fotky.ts).
export const MISTA = {
  "Úvod – hlavní fotka": "uvod-hero",
  "Úvod – O nás (kolotoč)": "uvod-kolotoc",
  "Úvod – galerie": "uvod-galerie",
  "Úvod – fotka u Co roubenka nabízí": "uvod-vyhody",
  "Úvod – tipy na výlety": "uvod-tipy",
  "Galerie – Exteriér": "galerie-exterier",
  "Galerie – Interiér": "galerie-interier",
  "Galerie – Okolí a výlety": "galerie-okoli",
  "Výlety – tipy": "vylety-tipy",
  "Ceník – úvodní fotka": "cenik-hero",
  "Galerie – úvodní fotka": "galerie-hero",
  "Výlety – úvodní fotka": "vylety-hero",
  "Kontakt – úvodní fotka": "kontakt-hero",
};

const OREZ = { "Nahoře": "50% 20%", "Uprostřed": "50% 50%", "Dole": "50% 80%" };

function loadDotEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].trim();
  }
}

const bail = (message) => console.warn(`[sync-fotky] ${message} — ponechávám naposledy commitnutou verzi.`);
const note = (message) => console.warn(`[sync-fotky] ${message}`);

const readTitle = (p) => p?.title?.map((t) => t.plain_text).join("") ?? "";
const readRichText = (p) => p?.rich_text?.map((t) => t.plain_text).join("") ?? "";
const readSelect = (p) => p?.select?.name ?? "";
const readCheckbox = (p) => p?.checkbox ?? false;
const readNumber = (p) => (typeof p?.number === "number" ? p.number : null);

function readFirstFile(prop) {
  const first = prop?.files?.[0];
  if (!first) return null;
  if (first.type === "external") return first.external?.url ? { url: first.external.url, isUpload: false } : null;
  return first.file?.url ? { url: first.file.url, isUpload: true, name: first.name } : null;
}

// Podepsaná URL: .../<workspace>/<id-přílohy>/<soubor.jpg>?X-Amz-... — id přílohy
// je stabilní, dokud klient fotku nevymění, takže se stahuje jen nová fotka.
function localBaseName(signedUrl, fileName) {
  let pathname;
  try {
    ({ pathname } = new URL(signedUrl));
  } catch {
    return null;
  }
  const segments = pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
  const ext = ((fileName || segments.at(-1) || "").match(/\.([a-zA-Z0-9]+)$/)?.[1] ?? "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return { unsupported: ext || "?" };
  const rawId = segments.at(-2) ?? createHash("sha1").update(pathname).digest("hex").slice(0, 16);
  return { base: rawId.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 60) || "fotka" };
}

async function ensureLocal(sharp, signedUrl, base, label) {
  const big = join(IMAGES_DIR, `${base}.webp`);
  const small = join(IMAGES_DIR, `${base}-sm.webp`);
  const paths = { src: `${PUBLIC_PREFIX}/${base}.webp`, srcSm: `${PUBLIC_PREFIX}/${base}-sm.webp` };
  if (existsSync(big) && existsSync(small)) return paths;
  try {
    const res = await fetch(signedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    mkdirSync(IMAGES_DIR, { recursive: true });
    // rotate() bez argumentu otočí fotku podle EXIF — fotky z mobilu by jinak ležely na boku.
    await sharp(input).rotate().resize({ width: VELKA, height: VELKA, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(big);
    await sharp(input).rotate().resize({ width: MALA, height: MALA, fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(small);
    console.log(`[sync-fotky] stažena a zmenšena fotka ${label}`);
    return paths;
  } catch (err) {
    note(`fotka ${label}: nepodařilo se stáhnout/zpracovat (${err.message}) — přeskakuji`);
    return null;
  }
}

function pruneUnused(used) {
  if (!existsSync(IMAGES_DIR)) return;
  for (const file of readdirSync(IMAGES_DIR)) {
    if (used.has(file)) continue;
    try {
      unlinkSync(join(IMAGES_DIR, file));
      console.log(`[sync-fotky] smazána nepoužívaná fotka ${file}`);
    } catch (err) {
      note(`nepodařilo se smazat ${file} (${err.message})`);
    }
  }
}

async function main() {
  loadDotEnvLocal();
  // Stejná integrace jako Variables a Texty — k databázi Fotky ji stačí připojit v Notionu.
  const API_KEY = process.env.NOTION_VARIABLES_API_KEY;
  const DATA_SOURCE_ID = process.env.NOTION_FOTKY_DATA_SOURCE_ID;
  if (!API_KEY || !DATA_SOURCE_ID) {
    bail("chybí NOTION_VARIABLES_API_KEY nebo NOTION_FOTKY_DATA_SOURCE_ID");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const sharp = (await import("sharp")).default;
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
    bail(`nepodařilo se stáhnout data z Notionu (${err.message})`);
    return;
  }

  const rows = pages
    .filter((page) => "properties" in page)
    .map((page, index) => ({ page, index, poradi: readNumber(page.properties["Pořadí"]) }))
    .sort((a, b) => (a.poradi ?? Infinity) - (b.poradi ?? Infinity) || a.index - b.index);

  const problems = [];
  const mista = {};
  const used = new Set();

  for (const { page } of rows) {
    const p = page.properties;
    const label = `"${readTitle(p["Název"]) || page.id}"`;
    if (readCheckbox(p["Skrýt"])) continue;
    const slug = MISTA[readSelect(p["Místo"])];
    if (!slug) {
      problems.push(`řádek ${label} má neznámé Místo "${readSelect(p["Místo"])}"`);
      continue;
    }
    const file = readFirstFile(p["Soubor"]);
    if (!file) continue;

    let paths;
    if (file.isUpload) {
      const local = localBaseName(file.url, file.name);
      if (!local || local.unsupported) {
        problems.push(`řádek ${label}: nepodporovaný formát (${local?.unsupported ?? "?"}) — nahrajte JPG nebo PNG`);
        continue;
      }
      paths = await ensureLocal(sharp, file.url, local.base, label);
      if (!paths) continue;
      used.add(`${local.base}.webp`).add(`${local.base}-sm.webp`);
    } else {
      paths = { src: file.url, srcSm: file.url };
    }

    const altCs = readRichText(p["Popisek CZ"]);
    const foto = {
      ...paths,
      alt: { cs: altCs, en: readRichText(p["Popisek EN"]) || altCs },
    };
    const id = readRichText(p["ID"]).trim();
    if (id) foto.id = id;
    const pozice = OREZ[readSelect(p["Ořez"])];
    if (pozice) foto.pozice = pozice;
    (mista[slug] ??= []).push(foto);
  }

  for (const message of problems) note(message);
  if (STRICT && problems.length > 0) process.exit(1);

  pruneUnused(used);
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  const sorted = Object.fromEntries(Object.keys(mista).sort().map((k) => [k, mista[k]]));
  writeFileSync(OUT_FILE, JSON.stringify({ mista: sorted }, null, 2) + "\n", "utf8");
  const count = Object.values(mista).reduce((n, list) => n + list.length, 0);
  console.log(`[sync-fotky] hotovo — ${count} fotek zapsáno do src/generated/fotky.json`);
}

await main();
