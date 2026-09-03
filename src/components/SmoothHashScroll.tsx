"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Když se přijde na stránku s odkazem obsahujícím #hash (typicky z jiné
 * podstránky, např. Footer odkaz "/#o-nas"), doscrollujeme na cílový prvek
 * plynule. Odkazy s hashem mají v Navbaru/Footeru `scroll={false}`, takže
 * Next.js po navigaci sám neskočí nahoru — díky tomu jede jen tahle jedna
 * plynulá animace bez viditelného "skoku nahoru a pak zpátky dolů".
 *
 * Efekt běží znovu při každé změně `pathname`, ne jen při prvním načtení
 * appky — jinak by se u navigace mezi podstránkami (SPA přechod) vůbec
 * nespustil podruhé.
 */
export default function SmoothHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.querySelector(hash);
    if (!el) return;

    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
