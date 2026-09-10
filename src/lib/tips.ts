import { V } from "@/generated/variables";

// TODO: nahradit reálnými fotkami výletních cílů (nyní neutrální placeholdery
// z Picsum) a texty od klienta (nyní jde o obecné popisky).
export const TIPS = [
  {
    src: "https://picsum.photos/seed/snezka-krkonose/500/400",
    title: "Sněžka",
    distance: V.VZDALENOST_SNEZKA,
    rotate: -6,
    clip: "#5f8c7a",
    href: V.TIP_SNEZKA_URL,
    description:
      "Nejvyšší hora České republiky a symbol Krkonoš. Na vrchol se dostanete pěšky po značených stezkách, lanovkou z Pece pod Sněžkou, nebo kombinací obojího. Odměnou je výhled do Polska i daleko do českého vnitrozemí.",
  },
  {
    src: "https://picsum.photos/seed/zoo-dvur-kralove/500/400",
    title: "Zoo Dvůr Králové",
    distance: V.VZDALENOST_ZOO_DVUR_KRALOVE,
    rotate: 4,
    clip: "#d4915c",
    href: V.TIP_ZOO_DVUR_KRALOVE_URL,
    description:
      "Jedna z nejznámějších zoologických zahrad v Česku, proslulá africkou expozicí a safari okruhem. Skvělý celodenní výlet pro rodiny s dětmi, dojezd z roubenky autem během chvilky.",
  },
  {
    src: "https://picsum.photos/seed/rychory-prirodni-rezervace/500/400",
    title: "Rýchory",
    distance: V.VZDALENOST_RYCHORY,
    rotate: -4,
    clip: "#c9a45c",
    href: V.TIP_RYCHORY_URL,
    description:
      "Přírodní rezervace přímo v sousedství roubenky s hřebenovými loukami, vzácnou flórou a klidnými lesními stezkami. Ideální na kratší procházku nebo delší okruh s výhledy do kraje.",
  },
  {
    src: "https://picsum.photos/seed/adrspassko-teplicke-skaly/500/400",
    title: "Adršpašské skály",
    distance: V.VZDALENOST_ADRSPACH,
    rotate: 7,
    clip: "#b0665a",
    href: V.TIP_ADRSPACH_URL,
    description:
      "Impozantní skalní město s pískovcovými věžemi, lesními roklemi a jezírkem, po kterém se lze projet na lodičce. Značené okruhy vyhovují jak rodinám, tak náročnějším turistům.",
  },
];
