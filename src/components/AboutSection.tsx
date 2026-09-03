"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";

const PHOTOS = [
  { src: "/images/carousel-1.jpg", alt: "Jídelní stůl z masivního dřeva s výhledem do krajiny" },
  { src: "/images/carousel-2.png", alt: "Obývací pokoj s křesly a dřevěnými trámy" },
  { src: "/images/carousel-3.jpg", alt: "Otevřená kuchyně a obývací část roubenky" },
  { src: "/images/food-bread.jpg", alt: "Čerstvý domácí chléb na dřevěném prkénku" },
];

// Photos are duplicated so the track can keep sliding forward past the last
// one — it lands on a visual clone of photo #1, then silently resets to the
// real photo #1 (transition duration 0) for a seamless, never-skipping loop.
const LOOP_PHOTOS = [...PHOTOS, ...PHOTOS];
const COUNT = PHOTOS.length;
const GAP = 12;
const AUTOPLAY_MS = 5000;
const SLIDE_TRANSITION = { duration: 0.8, ease: [0.65, 0, 0.35, 1] as const };

function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [instant, setInstant] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref, ne state — než doběhne aktuální přechod (nebo dokud netrhne drag),
  // se každý další "další/předchozí" prostě ignoruje. Díky tomu se ze
  // zběsilého klikání nikdy nemůže stát překrývající se/rozhozená animace.
  const animatingRef = useRef(false);

  useEffect(() => {
    const measure = () => {
      const item = trackRef.current?.children[0] as HTMLElement | undefined;
      if (item) setStep(item.getBoundingClientRect().width + GAP);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      setIndex((i) => Math.min(i + 1, LOOP_PHOTOS.length - 1));
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    if (step > 0) startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const go = (dir: 1 | -1) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIndex((i) => Math.min(Math.max(i + dir, 0), LOOP_PHOTOS.length - 1));
    startAutoplay();
  };

  const handleDragStart = () => {
    stopAutoplay();
    // Drag přebírá kontrolu okamžitě, takže i kdyby předchozí animace
    // nestihla dokončit svůj callback, klikání po skončení tažení nezůstane
    // navždy zablokované.
    animatingRef.current = false;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = step / 4;
    if (info.offset.x < -threshold || info.velocity.x < -500) go(1);
    else if (info.offset.x > threshold || info.velocity.x > 500) go(-1);
    else startAutoplay();
  };

  const handleAnimationComplete = () => {
    setIndex((current) => {
      if (current < COUNT) {
        animatingRef.current = false;
        return current;
      }
      // Na konci smyčky – neviditelný skok zpět na skutečnou fotku #1
      // (transition duration 0), přechody se zase povolí až na dalším snímku.
      setInstant(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setInstant(false);
          animatingRef.current = false;
        })
      );
      return current % COUNT;
    });
  };

  const activeDot = ((index % COUNT) + COUNT) % COUNT;

  return (
    <div
      className="relative w-full overflow-hidden lg:w-[656px]"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <motion.div
        ref={trackRef}
        className="flex gap-3"
        drag={step > 0 ? "x" : false}
        dragConstraints={{ left: -(LOOP_PHOTOS.length - 1) * step, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: -index * step }}
        transition={instant ? { duration: 0 } : SLIDE_TRANSITION}
        onAnimationComplete={handleAnimationComplete}
      >
        {LOOP_PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="relative aspect-[290/480] w-[78%] shrink-0 overflow-hidden rounded-md sm:w-[46%] lg:w-[290px]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              draggable={false}
              sizes="(min-width: 1024px) 290px, 46vw"
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Předchozí fotka"
        className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#1f150c] shadow-md"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Další fotka"
        className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#1f150c] shadow-md"
      >
        ›
      </button>

      <div className="mt-4 flex justify-center gap-2">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => {
              setIndex(i);
              startAutoplay();
            }}
            aria-label={`Zobrazit fotku ${i + 1}`}
            className="relative flex h-[10px] w-[10px] items-center justify-center"
          >
            <motion.span
              animate={{ scale: activeDot === i ? 1 : 0.7, opacity: activeDot === i ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className="size-[10px] rounded-full bg-brand"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="o-nas" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[120px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[488px]"
        >
          <div className="flex flex-col gap-[5px]">
            <p className="text-[14px] font-semibold tracking-[2.34px] text-brand">O NÁS</p>
            <div className="h-[2px] w-11 bg-brand-gradient" />
          </div>
          <h2 className="mt-5 font-serif text-[36px] font-bold italic leading-[1.05] text-ink sm:text-[52px] lg:text-[68px]">
            Místo, kde čas
            <br />
            plyne pomaleji
          </h2>
          <p className="mt-6 text-lg leading-[1.7] text-clay sm:text-xl">
            Útulné ubytování v podhůří Krkonoš — pro rodiny, páry i skupiny přátel. Celý objekt
            jen pro vás, zahrada s grilem a krb pro večerní pohodu.
          </p>
          <a
            href="#vyhody"
            className="text-gradient mt-7 inline-block rounded border-[1.8px] border-clay px-[22px] py-3 text-[15px] font-semibold"
          >
            Více o roubence →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full"
        >
          <Carousel />
        </motion.div>
      </div>
    </section>
  );
}
