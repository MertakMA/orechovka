"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PlaceholderTile from "./PlaceholderTile";
import { texty, type Locale } from "@/lib/texty";
import { fotky, type Fotka } from "@/lib/fotky";

type Filter = "vse" | "exterier" | "interier" | "okoli";
type Category = Exclude<Filter, "vse">;

// Rozvržení na desktopu počítá s aspoň 9 dlaždicemi u exteriéru a 5 u interiéru.
// Když je v Notionu fotek méně, zbytek vyplní zástupná dlaždice "Fotka bude doplněna";
// fotky navíc se přidají do dalších řad po čtyřech.
const MIN_EXTERIER = 9;
const MIN_INTERIER = 5;
const doplnit = (list: Fotka[], min: number): (Fotka | null)[] => [
  ...list,
  ...Array.from({ length: Math.max(0, min - list.length) }, () => null),
];

function Tile({
  photo,
  className,
  sizes,
  onOpen,
  placeholder,
}: {
  photo: Fotka | null;
  className?: string;
  sizes: string;
  onOpen: (photo: Fotka) => void;
  placeholder: string | null;
}) {
  if (!photo) {
    return <PlaceholderTile className={className} label={placeholder} />;
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      className={`group relative overflow-hidden rounded-lg ${className ?? ""}`}
    >
      <Image
        src={photo.srcSm}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ objectPosition: photo.pozice }}
      />
    </button>
  );
}

function CategoryLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="font-sans text-lg font-semibold text-pec-dark">{children}</h3>;
}

export default function GalleryFilterGrid({ locale = "cs" }: { locale?: Locale }) {
  const [filter, setFilter] = useState<Filter>("vse");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const g = texty("galerie", locale);
  const exterier = doplnit(fotky("galerie-exterier", locale), MIN_EXTERIER);
  const interier = doplnit(fotky("galerie-interier", locale), MIN_INTERIER);
  const okoli = fotky("galerie-okoli", locale);
  const placeholder = g.t("zastupna-fotka");

  // Skrytá kategorie v Notionu = zmizí tlačítko filtru i celá skupina fotek.
  const labels: Record<Category, string | null> = {
    exterier: g.t("kategorie.exterier"),
    interier: g.t("kategorie.interier"),
    okoli: g.t("kategorie.okoli"),
  };
  const allLabel = g.t("filtr.vse");
  const filters: { key: Filter; label: string }[] = [
    ...(allLabel ? [{ key: "vse" as const, label: allLabel }] : []),
    ...(Object.keys(labels) as Category[]).flatMap((key) => {
      const label = labels[key];
      return label ? [{ key, label }] : [];
    }),
  ];
  const allPhotos: Fotka[] = [
    ...(labels.exterier ? exterier.filter((p): p is Fotka => Boolean(p)) : []),
    ...(labels.interier ? interier.filter((p): p is Fotka => Boolean(p)) : []),
    ...(labels.okoli ? okoli : []),
  ];

  const openPhoto = (photo: Fotka) => {
    const idx = allPhotos.findIndex((p) => p.src === photo.src);
    setLightboxIndex(idx === -1 ? 0 : idx);
  };

  const showExterier = Boolean(labels.exterier) && (filter === "vse" || filter === "exterier");
  const showInterier = Boolean(labels.interier) && (filter === "vse" || filter === "interier");
  const showOkoli = Boolean(labels.okoli) && (filter === "vse" || filter === "okoli");

  const sizesWide = "(min-width: 1024px) 45vw, (min-width: 640px) 46vw, 100vw";
  const sizesQuarter = "(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw";

  return (
    <div>
      <div className="-mx-6 lg:sticky lg:top-24 lg:z-30 flex flex-wrap gap-2 border-b border-border bg-cream px-6 py-4 sm:-mx-10 sm:px-10 lg:-mx-[100px] lg:px-[100px]">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-[10px] text-[13px] font-semibold transition-colors ${
              filter === f.key
                ? "bg-brand text-white"
                : "border border-border bg-surface text-ink hover:border-brand"
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
              <CategoryLabel>{labels.exterier}</CategoryLabel>

              <div className="hidden lg:grid lg:h-[340px] lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
                <Tile placeholder={placeholder} photo={exterier[0]} onOpen={openPhoto} sizes={sizesWide} className="col-span-2 row-span-2 h-full w-full" />
                <Tile placeholder={placeholder} photo={exterier[1]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-3 row-start-1 h-full w-full" />
                <Tile placeholder={placeholder} photo={exterier[2]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-3 row-start-2 h-full w-full" />
                <Tile placeholder={placeholder} photo={exterier[3]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-4 row-start-1 h-full w-full" />
                <Tile placeholder={placeholder} photo={exterier[4]} onOpen={openPhoto} sizes={sizesQuarter} className="col-start-4 row-start-2 h-full w-full" />
              </div>
              <div className="hidden lg:grid lg:auto-rows-[200px] lg:grid-cols-4 lg:gap-4">
                {exterier.slice(5).map((photo, i) => (
                  <Tile placeholder={placeholder} key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
                {exterier.map((photo, i) => (
                  <Tile placeholder={placeholder} key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3]" />
                ))}
              </div>
            </section>
          )}

          {showInterier && (
            <section className="flex flex-col gap-5">
              <CategoryLabel>{labels.interier}</CategoryLabel>

              <div className="hidden lg:grid lg:h-[240px] lg:grid-cols-4 lg:gap-4">
                <Tile placeholder={placeholder} photo={interier[0]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                <Tile placeholder={placeholder} photo={interier[1]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                <div className="flex h-full flex-col gap-4">
                  <Tile placeholder={placeholder} photo={interier[2]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full flex-1" />
                  <Tile placeholder={placeholder} photo={interier[3]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full flex-1" />
                </div>
                <Tile placeholder={placeholder} photo={interier[4]} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
              </div>
              {interier.length > MIN_INTERIER && (
                <div className="hidden lg:grid lg:auto-rows-[200px] lg:grid-cols-4 lg:gap-4">
                  {interier.slice(MIN_INTERIER).map((photo, i) => (
                    <Tile placeholder={placeholder} key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="h-full w-full" />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
                {interier.map((photo, i) => (
                  <Tile placeholder={placeholder} key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3]" />
                ))}
              </div>
            </section>
          )}

          {showOkoli && (
            <section className="flex flex-col gap-5">
              <CategoryLabel>{labels.okoli}</CategoryLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                {okoli.map((photo, i) => (
                  <Tile placeholder={placeholder} key={i} photo={photo} onOpen={openPhoto} sizes={sizesQuarter} className="aspect-[4/3] lg:aspect-auto lg:h-[200px]" />
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
        slides={allPhotos.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </div>
  );
}
