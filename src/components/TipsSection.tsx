"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// TODO: nahradit reálnými fotkami výletních cílů, nyní jde o neutrální placeholdery z Picsum.
const TIPS = [
  {
    src: "https://picsum.photos/seed/snezka-krkonose/500/400",
    title: "Sněžka",
    distance: "20 km",
    rotate: -6,
    clip: "#5f8c7a",
  },
  {
    src: "https://picsum.photos/seed/zoo-dvur-kralove/500/400",
    title: "Zoo Dvůr Králové",
    distance: "20 km",
    rotate: 4,
    clip: "#d4915c",
  },
  {
    src: "https://picsum.photos/seed/rychory-prirodni-rezervace/500/400",
    title: "Rýchory",
    distance: "3 km",
    rotate: -4,
    clip: "#c9a45c",
  },
  {
    src: "https://picsum.photos/seed/adrspassko-teplicke-skaly/500/400",
    title: "Adršpašské skály",
    distance: "30 km",
    rotate: 7,
    clip: "#b0665a",
  },
];

function Clip({ color }: { color: string }) {
  return (
    <div
      className="absolute -top-3 left-1/2 z-10 h-5 w-3 -translate-x-1/2 rounded-[1px] shadow-[0px_2px_3px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/25" />
      <div className="absolute left-1/2 top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/25" />
    </div>
  );
}

function PolaroidCard({
  tip,
  index,
}: {
  tip: (typeof TIPS)[number];
  index: number;
}) {
  const kick = tip.rotate >= 0 ? 7 : -7;
  const sway = 2.2;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 160, damping: 10, delay: index * 0.12 }}
      className="mx-auto w-full max-w-[260px]"
    >
      {/* Vrstva 1: nekonečné pohupování přes čisté CSS — nezávislé na hoveru,
          takže se s ním nikdy nepere a nic "necuká". Otáčí se kolem horního
          okraje (origin-top), kde visí kolíček na šňůře. */}
      <div
        className="origin-top animate-polaroid-sway"
        style={
          {
            "--sway-from": `${tip.rotate - sway}deg`,
            "--sway-to": `${tip.rotate + sway}deg`,
            animationDuration: `${4.5 + index * 0.5}s`,
          } as React.CSSProperties
        }
      >
        {/* Vrstva 2: interaktivní naklonění/zvětšení při hoveru, přičítá se
            k pohupování z vrstvy 1. Otáčí se kolem stejného bodu (origin-top),
            takže kolíček zůstává na místě na šňůře. */}
        <motion.div
          whileHover={{ rotate: kick, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="origin-top relative cursor-default rounded-[2px] bg-[#fdfbf7] p-3 pb-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.07),2px_4px_12px_0px_rgba(0,0,0,0.18)]"
        >
          <Clip color={tip.clip} />
          <div className="relative aspect-[232/188] w-full overflow-hidden">
            <Image
              src={tip.src}
              alt={tip.title}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw"
              className="object-cover"
              unoptimized
            />
            <span className="absolute right-2 top-2 rounded-full bg-[#333333]/72 px-[10px] py-1 text-[11px] font-bold text-white">
              {tip.distance}
            </span>
          </div>
          <p className="mt-3 pl-0.5 font-serif text-[15px] font-bold italic text-[#2c2c2c]">{tip.title}</p>
          <p className="mt-1 pl-0.5 text-[11px] text-brand">{tip.distance} od roubenky</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function TipsSection() {
  return (
    <section id="tipy" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">TIPY NA VÝLETY</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          V okolí je toho hodně
        </h2>

        <div className="relative mt-14 lg:mt-20">
          {/* pověšená šňůra – jen na velké obrazovce, kde jsou karty v jedné řadě */}
          <svg
            className="pointer-events-none absolute -top-8 left-0 hidden h-9 w-full lg:block"
            viewBox="0 0 100 28"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* Mírný, rovnoměrný průhyb – schválně blízko úrovně kolíčků (-top-3
                na kartě), aby šňůra procházela přesně tam, kde na ní karty visí,
                a ne jen dekorativně "kolem". */}
            <path
              d="M0,15 Q50,17 100,15"
              stroke="#8b6f4e"
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
              opacity="0.55"
            />
          </svg>

          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {TIPS.map((tip, i) => (
              <PolaroidCard key={tip.title} tip={tip} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
