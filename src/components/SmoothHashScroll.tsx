"use client";

import { useEffect } from "react";

/**
 * Když se na stránku přijde s odkazem obsahujícím #hash (typicky z jiné
 * podstránky, např. Footer odkaz "/#o-nas"), prohlížeč tam standardně
 * skočí okamžitě bez ohledu na `scroll-behavior: smooth`. Tahle komponenta
 * to dožene plynulým doscrollováním, aby i mezistránkové odkazy působily hladce.
 */
export default function SmoothHashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.querySelector(hash);
    if (!el) return;

    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
