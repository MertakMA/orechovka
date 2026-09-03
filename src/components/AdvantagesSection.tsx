"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ADVANTAGES = [
  {
    src: "/images/adv-priroda.jpg",
    alt: "Roubenka obklopená zelení a stromy",
    title: "Příroda & lesy",
    text: "Lesy a stráně Krkonoš přímo u prahu. Turistika i MTB trasy.",
    objectPosition: "object-top",
  },
  {
    src: "/images/adv-krb.jpg",
    alt: "Kachlový krb s posezením v roubence",
    title: "Krb & útulnost",
    text: "Kachlový krb, dřevěné trámy — teplo a domácí pohoda.",
  },
  {
    src: "/images/adv-soukromi.png",
    alt: "Oplocená zahrada s kamennou zídkou",
    title: "Soukromí",
    text: "Celý objekt jen pro vás. Oplocená zahrada s grilem.",
  },
  {
    src: "/images/adv-poloha.jpg",
    alt: "Výhled na okolní krajinu Krkonoš",
    title: "Poloha",
    text: "5 km Trutnov · 20 km Sněžka · 20 km Zoo Dvůr Králové",
  },
];

export default function AdvantagesSection() {
  return (
    <section id="vyhody" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">PROČ SI VYBRAT OŘECHOVKU</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          Co vás čeká
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-4">
          {ADVANTAGES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="overflow-hidden rounded-[10px] bg-white shadow-[0px_6px_20px_0px_rgba(34,25,16,0.1)]"
            >
              <div className="relative h-[165px] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${item.objectPosition ?? ""}`}
                />
              </div>
              <div className="p-[18px]">
                <h3 className="text-[19px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-clay">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
