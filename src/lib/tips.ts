import { V } from "@/generated/variables";

// Stejné čtyři tipy, co se na /vylety zvýrazňují v sekci Léto/Zima. Název
// a vzdálenost jsou v Notionu (Texty → Úvod, ID `id`), fotka v databázi Fotky
// (místo „Úvod – tipy na výlety“, stejné ID).
export const TIPS = [
  {
    id: "tipy.snezka",
    rotate: -6,
    clip: "#559895",
    href: V.TIP_SNEZKA_URL,
  },
  {
    id: "tipy.zoo",
    rotate: 4,
    clip: "#d4915c",
    href: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    id: "tipy.mlade-buky",
    rotate: -4,
    clip: "#c9a45c",
    href: "https://mladebuky.cz",
  },
  {
    id: "tipy.adrspach",
    rotate: 7,
    clip: "#b0665a",
    href: V.TIP_ADRSPACH_URL,
  },
];
