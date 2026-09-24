import { V } from "@/generated/variables";
import { commonsFile } from "./commonsImage";

// Stejné čtyři tipy, co se na /vylety zvýrazňují v sekci Léto/Zima — homepage
// tak neukazuje jiná místa ani jiné fotky než podstránka Tipy na výlety.
// Fotky jsou zatím ilustrační z Wikimedia Commons (viz lib/commonsImage.ts —
// vyžadují atribuci autora, než půjde web naostro), dokud klient nedodá
// vlastní fotky těchto míst. Název a vzdálenost jsou v Notionu (Texty → Úvod, ID `id`).
export const TIPS = [
  {
    id: "tipy.snezka",
    src: commonsFile("Sněžka a Obří důl.jpg"),
    rotate: -6,
    clip: "#559895",
    href: V.TIP_SNEZKA_URL,
  },
  {
    id: "tipy.zoo",
    src: commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG"),
    rotate: 4,
    clip: "#d4915c",
    href: V.TIP_ZOO_DVUR_KRALOVE_URL,
  },
  {
    id: "tipy.mlade-buky",
    src: commonsFile("Ansicht kreuzberg abfahrten 2009.jpg"),
    rotate: -4,
    clip: "#c9a45c",
    href: "https://mladebuky.cz",
  },
  {
    id: "tipy.adrspach",
    src: commonsFile("Adršpašskoteplické skály 02.JPG"),
    rotate: 7,
    clip: "#b0665a",
    href: V.TIP_ADRSPACH_URL,
  },
];
