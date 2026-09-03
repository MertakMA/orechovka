"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PlaceholderTile from "./PlaceholderTile";
import { withBasePath } from "@/lib/basePath";

type Photo = { src: string; alt: string };

type Filter = "vse" | "exterier" | "interier" | "okoli";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "vse", label: "Vše" },
  { key: "exterier", label: "Exteriér" },
  { key: "interier", label: "Interiér" },
  { key: "okoli", label: "Okolí & Výlety" },
];

// TODO: nahradit placeholdery reálnými exteriérovými fotkami roubenky.
const EXTERIER: (Photo | null)[] = [
  { src: withBasePath("/images/hero.jpg"), alt: "Roubenka Ořechovka zvenčí v létě" },
  { src: withBasePath("/images/adv-priroda.jpg"), alt: "Pohled na roubenku a okolní krajinu" },
  null,
  { src: withBasePath("/images/adv-soukromi.png"), alt: "Oplocená zahrada s kamennou zídkou" },
  null,
  null,
  null,
  null,
  null,
];

const INTERIER: Photo[] = [
  { src: withBasePath("/images/carousel-3.jpg"), alt: "Otevřená kuchyně a obývací část roubenky" },
  { src: withBasePath("/images/carousel-1.jpg"), alt: "Jídelní stůl z masivního dřeva" },
  { src: withBasePath("/images/adv-krb.jpg"), alt: "Kachlový krb s posezením" },
  { src: withBasePath("/images/gallery-3.jpg"), alt: "Kuchyně s výhledem do zahrady" },
  { src: withBasePath("/images/carousel-2.png"), alt: "Obývací pokoj s křesly" },
];

// TODO: nahradit reálnými fotkami okolí a výletních cílů, nyní jde o neutrální placeholdery.
const OKOLI: Photo[] = [
  { src: "https://picsum.photos/seed/snezka-krkonose/500/500", alt: "Sněžka" },
  { src: "https://picsum.photos/seed/zoo-dvur-kralove/500/500", alt: "Zoo Dvůr Králové" },
  { src: "https://picsum.photos/seed/rychory-prirodni-rezervace/500/500", alt: "Rýchory" },
  { src: "https://picsum.photos/seed/adrspassko-teplicke-skaly/500/500", alt: "Adršpašské skály" },
  { src: "https://picsum.photos/seed/krkonose-panorama/500/500", alt: "Krkonoše" },
];

const ALL_PHOTOS: Photo[] = [
  ...EXTERIER.filter((p): p is Photo => Boolean(p)),
  ...INTERIER,
  ...OKOLI,
];

function Tile({
  photo,
  className,
  sizes,
  onOpen,
}: {
  photo: Photo | null;
  className?: string;
  sizes: string;
  onOpen: (photo: Photo) => void;
}) {
  if (!photo) {
    return <PlaceholderTile className={className} />;
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      className={`group relative overflow-hidden rounded-lg ${className ?? ""}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        unoptimized={photo.src.startsWith("https://picsum.photos")}
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  );
}

function CategoryLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-[#82a396]">{children}</h3>;
}

export default function GalleryFilterGrid() {
  const [filter, setFilter] = useState<Filter>("vse");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openPhoto = (photo: Photo) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.src === photo.src);
    setLightboxIndex(idx === -1 ? 0 : idx);
  };

  const showExterier = filter === "vse" || filter === "exterier";
  const showInterier = filter === "vse" || filter === "interier";
  const showOkoli = filter === "vse" || filter === "okoli";

  const sizesWide = "(min-width: 1024px) 45vw, (min-width: 640px) 46vw, 100vw";
  const sizesQuarter = "(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw";

  return (
    <div>
      <div className="sticky top-24 z-30 -mx-6 flex flex-wrap gap-2 border-b border-border bg-[#fafaf8] px-6 py-4 sm:-mx-10 sm:px-10 lg:-mx-[100px] lg:px-[100px]">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-[10px] text-[13px] font-semibold transition-colors ${
              filter === f.key
                ? "bg-brand text-white"
                : "border border-border bg-white text-ink hover:border-brand"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-14 py-10 sm:py-12"
        >
          {showExterier && (
            <section className="flex flex-col gap-5">
              <CategoryLabel>Exteriér</CategoryLabel>

              <div className="hidden lg:grid lg:h-[340px] lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
                <Tile photo={EXTERIER[0]} onOpen={openPhoto} sizes={sizesWide} className="col-span-2 row-span-2 h-full w-full" />
                <Tile photo={EXTERIER[1]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-3 row-start-1 h-full w-full" />
                <Tile photo={EXTERIER[2]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-3 row-start-2 h-full w-full" />
                <Tile photo={EXTERIER[3]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-4 row-start-1 h-full w-full" />
                <Tile photo={EXTERIER[4]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-4 row-start-2 h-full w-full" />
              </div>
              <div className="hidden lg:grid lg:h-[200px] lg:grid-cols-4 lg:gap-4">
                {EXTERIER.slice(5, 9).map((photo, i) => (
                  <Tile key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
                {EXTERIER.map((photo, i) => (
                  <Tile key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3]" />
                ))}
              </div>
            </section>
          )}

          {showInterier && (
            <section className="flex flex-col gap-5">
              <CategoryLabel>Interiér</CategoryLabel>

              <div className="hidden lg:grid lg:h-[240px] lg:grid-cols-4 lg:gap-4">
                <Tile photo={INTERIER[0]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                <Tile photo={INTERIER[1]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                <div className="flex h-full flex-col gap-4">
                  <Tile photo={INTERIER[2]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full flex-1" />
                  <Tile photo={INTERIER[3]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full flex-1" />
                </div>
                <Tile photo={INTERIER[4]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
                {INTERIER.map((photo, i) => (
                  <Tile key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3]" />
                ))}
              </div>
            </section>
          )}

          {showOkoli && (
            <section className="flex flex-col gap-5">
              <CategoryLabel>Okolí &amp; Výlety</CategoryLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                {OKOLI.map((photo, i) => (
                  <Tile key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3] lg:aspect-auto lg:h-[200px]" />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <Lightbox
        open={lightboxIndex !== null}
        close={() => setLightboxIndex(null)}
        index={lightboxIndex ?? 0}
        slides={ALL_PHOTOS.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </div>
  );
}
