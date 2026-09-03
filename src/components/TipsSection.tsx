"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";

// TODO: nahradit reálnými fotkami výletních cílů, nyní jde o neutrální placeholdery z Picsum.
// TODO: ověřit/upřesnit odkazy s klientem — teď míří na oficiální/rozumně
// důvěryhodné stránky daného místa.
const TIPS = [
  {
    src: "https://picsum.photos/seed/snezka-krkonose/500/400",
    title: "Sněžka",
    distance: "20 km",
    rotate: -6,
    clip: "#5f8c7a",
    href: "https://www.snezka.cz",
  },
  {
    src: "https://picsum.photos/seed/zoo-dvur-kralove/500/400",
    title: "Zoo Dvůr Králové",
    distance: "20 km",
    rotate: 4,
    clip: "#d4915c",
    href: "https://safaripark.cz",
  },
  {
    src: "https://picsum.photos/seed/rychory-prirodni-rezervace/500/400",
    title: "Rýchory",
    distance: "3 km",
    rotate: -4,
    clip: "#c9a45c",
    href: "https://cs.wikipedia.org/wiki/R%C3%BDchory",
  },
  {
    src: "https://picsum.photos/seed/adrspassko-teplicke-skaly/500/400",
    title: "Adršpašské skály",
    distance: "30 km",
    rotate: 7,
    clip: "#b0665a",
    href: "https://www.adrspach.cz",
  },
];

// Poryv "větru" kolem padajícího polaroidu — pár krátkých čárek, co
// prolítnou zprava doleva s mírně rozhozeným zpožděním pro dojem gusta.
const WIND_PARTICLES = [
  { y: 10, drift: -70, angle: -10, delay: 0 },
  { y: 45, drift: -90, angle: -6, delay: 0.06 },
  { y: 80, drift: -60, angle: -14, delay: 0.03 },
  { y: 115, drift: -85, angle: -8, delay: 0.1 },
  { y: 150, drift: -55, angle: -12, delay: 0.08 },
];

const FALL_DURATION_MS = 750;

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
  // Poryv větru odfoukne padající polaroid na tu stranu, kam už je nakloněný.
  const fallDrift = tip.rotate >= 0 ? 70 : -70;

  const [isFalling, setIsFalling] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift-klik nebo prostřední tlačítko (otevření na pozadí,
    // "otevřít v novém okně" apod.) neschováváme za animaci — necháme
    // prohlížeč, ať to zpracuje sám a rovnou.
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;

    // Normální klik by prohlížeč hned přesměroval do nové karty a přepnul
    // na ni fokus — pád polaroidu by tak nikdy nebylo vidět. Proto klik
    // schválně zpozdíme: animace nejdřív doběhne (spadne a vrátí se na
    // kolíček) a teprve pak otevřeme cílovou stránku v nové kartě.
    e.preventDefault();
    setIsFalling(true);
    window.setTimeout(() => {
      setIsFalling(false);
      window.open(tip.href, "_blank", "noopener,noreferrer");
    }, FALL_DURATION_MS);
  };

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
        {/* Vrstva 2: interaktivní naklonění/zvětšení při hoveru + pád po
            kliknutí, přičítá se k pohupování z vrstvy 1. V klidu se otáčí
            kolem stejného bodu (origin-top) jako vrstva 1, takže kolíček
            zůstává na místě na šňůře — při pádu se to pravidlo záměrně
            poruší (spadl by přece z kolíčku, ne kolem něj). */}
        <motion.a
          href={tip.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${tip.title} — otevřít v nové kartě`}
          onClick={handleClick}
          whileHover={isFalling ? undefined : { rotate: kick, scale: 1.06 }}
          animate={
            isFalling
              ? { y: 420, x: fallDrift, rotate: kick * 5, opacity: 0 }
              : { y: 0, x: 0, rotate: 0, opacity: 1 }
          }
          transition={
            isFalling
              ? { duration: FALL_DURATION_MS / 1000, ease: [0.55, 0, 1, 0.45] }
              : { type: "spring", stiffness: 300, damping: 14 }
          }
          className="origin-top relative block cursor-pointer rounded-[2px] bg-[#fdfbf7] p-3 pb-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.07),2px_4px_12px_0px_rgba(0,0,0,0.18)]"
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

          {isFalling && (
            <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
              {WIND_PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 16, y: p.y }}
                  animate={{ opacity: [0, 1, 0], x: p.drift, y: p.y + 14 }}
                  transition={{ duration: 0.55, delay: p.delay, ease: "easeOut" }}
                  style={{ rotate: `${p.angle}deg` }}
                  className="absolute right-0 h-[2px] w-8 rounded-full bg-white/80"
                />
              ))}
            </div>
          )}
        </motion.a>
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
