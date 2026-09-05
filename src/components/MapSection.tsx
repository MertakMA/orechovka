"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { V } from "@/generated/variables";

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(V.MAPA_QUERY)}&output=embed`;

export default function MapSection() {
  return (
    <section id="mapa" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[380px] shrink-0"
        >
          <div className="flex flex-col gap-[5px]">
            <p className="text-gradient text-[13px] font-semibold tracking-[2px]">KDE NÁS NAJDETE</p>
            <div className="h-[2px] w-7 bg-brand-gradient" />
          </div>
          <h2 className="mt-[26px] font-serif text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
            Mladé Buky,
            <br />
            Krkonoše
          </h2>
          <p className="mt-6 text-[15px] leading-[1.7] text-clay">
            {V.ADRESA_RADEK_1}
            <br />
            {V.ADRESA_RADEK_2}
            <br />
            <br />
            {V.VZDALENOST_TRUTNOV_MIN} Trutnov
            <br />
            {V.VZDALENOST_HRADEC_KRALOVE} Hradec Králové · {V.VZDALENOST_PEC_POD_SNEZKOU} Pec pod Sněžkou
          </p>
          <Link
            href="/kontakt"
            className="text-gradient mt-6 inline-block text-[14px] font-semibold hover:underline"
          >
            Kontaktní údaje a formulář →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-[320px] w-full overflow-hidden rounded-[10px] border border-border sm:h-[400px] lg:h-[440px]"
        >
          <iframe
            src={MAP_EMBED_SRC}
            title="Mapa – Mladé Buky"
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
