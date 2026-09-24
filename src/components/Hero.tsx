"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/basePath";
import { texty, type Locale } from "@/lib/texty";

export default function Hero({ locale = "cs" }: { locale?: Locale }) {
  const u = texty("uvod", locale);
  const title = u.t("hero.nadpis");
  const subtitle = u.t("hero.podnadpis");
  const gallery = u.t("hero.tlacitko");
  return (
    <section
      id="hero"
      className="relative flex h-[calc(100svh-6rem)] max-h-[calc(900px-6rem)] min-h-[440px] items-end overflow-hidden"
    >
      <Image
        src={withBasePath("/images/hero-2.jpg")}
        alt={u.vzdy("hero.foto")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_65%] [filter:sepia(0.16)_saturate(1.06)]"
      />
      {/* Teplý závoj přes fotku — modrá obloha jinak působí chladně a klientka
          chce, aby web na první dobrou působil hřejivě. */}
      <div className="absolute inset-0 bg-[#8a5426] opacity-[0.08] mix-blend-soft-light" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(16,10,5,0) 0%, rgba(42,26,12,0.28) 40%, rgba(30,18,8,0.8) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full px-6 pb-28 sm:px-10 sm:pb-32 lg:px-[100px] lg:pb-[140px]"
      >
        {(title || subtitle) && (
          <h1 className="font-serif text-white">
            {title && (
              <span className="block whitespace-nowrap text-[clamp(26px,8vw,40px)] font-bold leading-[1.05] tracking-[-0.5px] sm:text-[56px] lg:text-[84px] lg:leading-[80px] lg:tracking-[-1.2px]">
                {title}
              </span>
            )}
            {subtitle && (
              <span className="mt-1 block text-[16px] font-medium uppercase leading-[1.2] tracking-[0.5px] sm:mt-2 sm:text-[22px] lg:mt-3 lg:text-[32px] lg:leading-[1.15]">
                {subtitle}
              </span>
            )}
          </h1>
        )}

        <div className="mt-6 h-[2.5px] w-14 rounded bg-brand-gradient sm:mt-8" />
        {gallery && (
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href={locale === "cs" ? "/galerie" : "/en/galerie"}
              className="rounded bg-brand px-8 py-4 text-center text-[15px] font-semibold text-cream transition-colors hover:bg-brand-dark"
            >
              {gallery}
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
