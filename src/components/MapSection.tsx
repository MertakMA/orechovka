"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MAP_EMBED_SRC } from "@/lib/mapa";
import { texty, type Locale } from "@/lib/texty";
import Radky from "@/components/Radky";

export default function MapSection({ locale = "cs" }: { locale?: Locale }) {
  const u = texty("uvod", locale);
  if (!u.sekce("mapa")) return null;

  const eyebrow = u.t("mapa.nadtitulek");
  const heading = u.t("mapa.nadpis");
  const address = u.t("mapa.adresa");
  const distances = u.t("mapa.vzdalenosti");
  const link = u.t("mapa.odkaz");
  return (
    <section id="mapa" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[380px] shrink-0"
        >
          {eyebrow && (
            <div className="flex flex-col gap-[5px]">
              <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{eyebrow}</p>
              <div className="h-[2px] w-7 bg-brand-gradient" />
            </div>
          )}
          {heading && (
            <h2 className="mt-[26px] font-serif text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
              <Radky text={heading} />
            </h2>
          )}
          {(address || distances) && (
            <p className="mt-6 text-[15px] leading-[1.7] text-clay">
              {address && <Radky text={address} />}
              {address && distances && (
                <>
                  <br />
                  <br />
                </>
              )}
              {distances && <Radky text={distances} />}
            </p>
          )}
          {link && (
            <Link
              href={locale === "cs" ? "/kontakt" : "/en/kontakt"}
              className="text-bark mt-6 inline-block text-[14px] font-semibold hover:underline"
            >
              {link}
            </Link>
          )}
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
            title={texty("spolecne", locale).vzdy("mapa.titulek")}
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
