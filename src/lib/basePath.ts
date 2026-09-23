// Web se servíruje z kořene vlastní domény (viz next.config.mjs), takže
// BASE_PATH je teď prázdný — funkce je no-op. Zůstává tu pro případ, že by
// se web v budoucnu znovu stěhoval pod podadresář (basePath by se pak zase
// nastavil v next.config.mjs). next/image u neoptimalizovaných obrázků
// (images.unoptimized) totiž basePath do `src` automaticky nepřidává — jen
// pro interní `next/link` a "loaderem" generované URL — cesty do /public se
// proto musí prefixovat ručně přes tuhle funkci.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
