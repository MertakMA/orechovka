"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { withBasePath } from "@/lib/basePath";
import { texty, type Locale } from "@/lib/texty";
import { fotky } from "@/lib/fotky";
import Radky from "@/components/Radky";

export default function GallerySection({ locale = "cs" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const u = texty("uvod", locale);
  if (!u.sekce("galerie")) return null;

  const eyebrow = u.t("galerie.nadtitulek");
  const heading = u.t("galerie.nadpis");
  const tile = u.t("galerie.dlazdice");
  // První 4 fotky místa "Úvod – galerie" jdou do dlaždic, v lightboxu jsou všechny.
  // Když jich je v Notionu méně, chybějící dlaždice se prostě nevykreslí.
  const photos = fotky("uvod-galerie", locale);
  const slides = photos.map((p) => ({ src: p.src, alt: p.alt }));

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const tileButton = (i: number, className: string, sizes: string) => {
    const photo = photos[i];
    if (!photo) return null;
    return (
      <button type="button" onClick={() => openAt(i)} className={className}>
        <Image
          src={photo.srcSm}
          alt={photo.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform hover:scale-105"
          style={{ objectPosition: photo.pozice }}
        />
      </button>
    );
  };

  return (
    <section id="galerie" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        {eyebrow && (
          <div className="flex flex-col gap-[5px]">
            <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{eyebrow}</p>
            <div className="h-[2px] w-7 bg-brand-gradient" />
          </div>
        )}
        {heading && (
          <h2 className="mt-3 max-w-[514px] font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
            {heading}
          </h2>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-[62px] lg:gap-5"
        >
          {tileButton(0, "relative h-[220px] w-full overflow-hidden rounded-md sm:h-[260px] sm:flex-[400]", "(min-width: 640px) 32vw, 100vw")}

          <div className="flex gap-3 sm:contents">
            {tileButton(1, "relative h-[180px] w-1/2 overflow-hidden rounded-md sm:h-[260px] sm:w-auto sm:flex-[300]", "(min-width: 640px) 24vw, 50vw")}
            {tileButton(2, "relative h-[180px] w-1/2 overflow-hidden rounded-md sm:h-[260px] sm:w-auto sm:flex-[300]", "(min-width: 640px) 24vw, 50vw")}
          </div>

          <div className="flex gap-3 sm:flex sm:flex-col sm:flex-[136]">
            {tileButton(3, "relative h-[100px] w-1/2 overflow-hidden rounded-md sm:h-[124px] sm:w-full", "(min-width: 640px) 11vw, 50vw")}
            {tile && (
              <Link
                href={locale === "cs" ? "/galerie" : "/en/galerie"}
                className="group relative block h-[100px] w-1/2 overflow-hidden rounded-md bg-espresso sm:h-[124px] sm:w-full"
              >
                <Image
                  src={withBasePath("/images/gallery-tile-bg.png")}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 11vw, 50vw"
                  className="object-cover opacity-35 transition-transform group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold leading-tight text-white">
                  <Radky text={tile} />
                </span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </section>
  );
}
