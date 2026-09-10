"use client";

import { motion } from "framer-motion";
import { BedDouble, Users, Droplet, Trees, Wifi, SquareParking, Flame, UtensilsCrossed } from "lucide-react";
import { V } from "@/generated/variables";

const OFFER = [
  {
    Icon: BedDouble,
    value: `${V.POCET_LOZNIC} ložnic`,
    text: "Dostatek prostoru pro klidné spaní všech hostů.",
  },
  {
    Icon: Users,
    value: V.KAPACITA,
    text: "Kapacita pro rodiny, páry i skupiny přátel.",
  },
  {
    Icon: Droplet,
    value: `${V.POCET_KOUPELEN} koupelna`,
    text: "Plně vybavená koupelna se sprchovým koutem.",
  },
  {
    Icon: Trees,
    value: `${V.VELIKOST_ZAHRADY} zahrady`,
    text: "Oplocená zahrada s posezením a grilem.",
  },
  {
    Icon: Flame,
    value: "Kachlový krb",
    text: "Vytápí obývací část, ideální na zimní večery.",
  },
  {
    Icon: SquareParking,
    value: `${V.POCET_PARKOVACICH_MIST} parkovací místa`,
    text: "Vlastní parkování přímo u roubenky.",
  },
  {
    Icon: Wifi,
    value: "WiFi zdarma",
    text: "Rychlé připojení v celém objektu.",
  },
  {
    Icon: UtensilsCrossed,
    value: "Vybavená kuchyň",
    text: "Vše potřebné k vaření i pečení pro celou skupinu.",
  },
];

export default function AdvantagesSection() {
  return (
    <section id="vyhody" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">O ROUBENCE</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          Co roubenka nabízí
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-4">
          {OFFER.map((item, i) => (
            <motion.div
              key={item.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-[10px] bg-white p-6 shadow-[0px_6px_20px_0px_rgba(34,25,16,0.1)]"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-cream">
                <item.Icon className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 font-sans text-[19px] font-semibold text-ink">{item.value}</p>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-clay">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
