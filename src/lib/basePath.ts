// V buildu pro GitHub Pages (viz next.config.mjs, proměnná GITHUB_PAGES) běží
// web v podadresáři "/orechovka". next/image u neoptimalizovaných obrázků
// (images.unoptimized) tenhle basePath do `src` automaticky nepřidává — jen
// pro interní `next/link` a "loaderem" generované URL. Cesty do /public si
// proto musíme prefixovat sami přes tuhle funkci.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
