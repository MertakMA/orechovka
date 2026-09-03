"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Doscrolluje na cílovou sekci, když se na stránku přijde s #hash v URL
 * (přímý odkaz zvenčí, nebo plná navigace z handleHashNavClick — viz
 * hashNav.ts). Efekt běží při každé změně `pathname`, ne jen jednou při
 * prvním načtení appky.
 */
export default function SmoothHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
