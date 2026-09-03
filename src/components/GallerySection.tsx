"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const GALLERY = [
  { src: "/images/gallery-1.jpg", alt: "Roubenka Ořechovka zvenčí" },
  { src: "/images/gallery-2.jpg", alt: "Kachlový krb s posezením" },
  { src: "/images/gallery-3.jpg", alt: "Kuchyně s výhledem do zahrady" },
  { src: "/images/gallery-4.png", alt: "Podkrovní ložnice s vikýřem" },
  { src: "/images/carousel-1.jpg", alt: "Jídelní stůl z masivního dřeva" },
  { src: "/images/carousel-2.png", alt: "Obývací pokoj s křesly" },
  { src: "/images/adv-soukromi.png", alt: "Zahrada s kamennou zídkou" },
];

export default function GallerySection() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <section id="galerie" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">GALERIE</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 max-w-[514px] font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          Nahlédněte do roubenky
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-[62px] lg:gap-5"
        >
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative h-[220px] w-full overflow-hidden rounded-md sm:h-[260px] sm:flex-[400]"
          >
            <Image src={GALLERY[0].src} alt={GALLERY[0].alt} fill sizes="(min-width: 640px) 32vw, 100vw" className="object-cover transition-transform hover:scale-105" />
          </button>

          <div className="flex gap-3 sm:contents">
            <button
              type="button"
              onClick={() => openAt(1)}
              className="relative h-[180px] w-1/2 overflow-hidden rounded-md sm:h-[260px] sm:w-auto sm:flex-[300]"
            >
              <Image src={GALLERY[1].src} alt={GALLERY[1].alt} fill sizes="(min-width: 640px) 24vw, 50vw" className="object-cover transition-transform hover:scale-105" />
            </button>
            <button
              type="button"
              onClick={() => openAt(2)}
              className="relative h-[180px] w-1/2 overflow-hidden rounded-md sm:h-[260px] sm:w-auto sm:flex-[300]"
            >
              <Image src={GALLERY[2].src} alt={GALLERY[2].alt} fill sizes="(min-width: 640px) 24vw, 50vw" className="object-cover transition-transform hover:scale-105" />
            </button>
          </div>

          <div className="flex gap-3 sm:flex sm:flex-col sm:flex-[136]">
            <button
              type="button"
              onClick={() => openAt(3)}
              className="relative h-[100px] w-1/2 overflow-hidden rounded-md sm:h-[124px] sm:w-full"
            >
              <Image src={GALLERY[3].src} alt={GALLERY[3].alt} fill sizes="(min-width: 640px) 11vw, 50vw" className="object-cover transition-transform hover:scale-105" />
            </button>
            <a
              href="/galerie"
              className="group relative block h-[100px] w-1/2 overflow-hidden rounded-md bg-espresso sm:h-[124px] sm:w-full"
            >
              <Image
                src="/images/gallery-tile-bg.png"
                alt=""
                fill
                sizes="(min-width: 640px) 11vw, 50vw"
                className="object-cover opacity-35 transition-transform group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold leading-tight text-white">
                Celá
                <br />
                galerie →
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={GALLERY.map((g) => ({ src: g.src, alt: g.alt }))}
      />
    </section>
  );
}
