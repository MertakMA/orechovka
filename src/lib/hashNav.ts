import type { MouseEvent } from "react";

/**
 * next/link u odkazů typu "/#tipy" spolehlivě naviguje a doscrolluje jen
 * tehdy, když se skutečně mění cesta (přechod z jiné podstránky). Je-li
 * uživatel už na cílové stránce, Next hash-only "navigaci" potichu přeskočí
 * a nikam nedoscrolluje — proto v tom případě scroll doděláme ručně.
 *
 * `pathname` je hodnota z next/navigation usePathname() (bez basePath).
 */
export function handleHashNavClick(e: MouseEvent<HTMLAnchorElement>, href: string, pathname: string | null) {
  if (!href.includes("#")) return;

  const [path, hash] = href.split("#");
  const targetPath = path || "/";
  if (pathname !== targetPath) return;

  e.preventDefault();
  const el = document.getElementById(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `${targetPath}#${hash}`);
}
