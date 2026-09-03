import type { MouseEvent } from "react";
import { BASE_PATH } from "@/lib/basePath";

/**
 * `pathname` je hodnota z next/navigation usePathname() (bez basePath), proto
 * se s ním `targetPath` (odvozený z `href`, taky bez basePath) dá přímo
 * porovnat.
 *
 * Cross-page případ (uživatel je na jiné stránce než cílová) se řeší klasickou
 * plnou navigací (`window.location.href`), ne přes next/link ani router.push:
 * u odkazů typu "/#tipy" v kombinaci s basePath (GitHub Pages build, basePath
 * "/orechovka") next/link vygeneruje href bez lomítka před hashem
 * ("/orechovka#tipy" místo "/orechovka/#tipy") a hash se tak při navigaci
 * ztratí. Navíc router.push na kořenovou "/" tady spadne na tvrdý reload
 * (Next si neumí sám natáhnout data pro cestu "/" pod basePath), takže
 * jakýkoli in-memory stav (např. hash schovaný v JS proměnné do doby, než
 * doběhne přechod) by se stejně ztratil. Plná navigace s ručně sestavenou
 * URL (basePath + cesta + hash) funguje spolehlivě v obou případech.
 */
export function handleHashNavClick(e: MouseEvent<HTMLAnchorElement>, href: string, pathname: string | null) {
  if (!href.includes("#")) return;
  e.preventDefault();

  const [path, hash] = href.split("#");
  const targetPath = path || "/";

  if (pathname === targetPath) {
    const el = document.getElementById(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${BASE_PATH}${targetPath}#${hash}`);
    return;
  }

  window.location.href = `${BASE_PATH}${targetPath}#${hash}`;
}
