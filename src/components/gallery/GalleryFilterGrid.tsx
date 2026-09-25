"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PlaceholderTile from "./PlaceholderTile";
import { withBasePath } from "@/lib/basePath";
import { commonsFile } from "@/lib/commonsImage";
import { texty, type Locale } from "@/lib/texty";

type Photo = { src: string; alt: string };
// altId = řádek s popisem fotky v Notionu (spolecne.* sdílené s úvodní stránkou, galerie.* jen tady).
type PhotoDef = { src: string; altId: string; stranka: "spolecne" | "galerie" };

type Filter = "vse" | "exterier" | "interier" | "okoli";
type Category = Exclude<Filter, "vse">;

const shared = (src: string, altId: string): PhotoDef => ({ src, altId, stranka: "spolecne" });

// TODO: nahradit placeholdery reálnými exteriérovými fotkami roubenky.
const EXTERIER: (PhotoDef | null)[] = [
  shared(withBasePath("/images/hero.jpg"), "foto.hero"),
  shared(withBasePath("/images/adv-priroda.jpg"), "foto.adv-priroda"),
  null,
  shared(withBasePath("/images/adv-soukromi.png"), "foto.adv-soukromi"),
  null,
  null,
  null,
  null,
  null,
];

const INTERIER: PhotoDef[] = [
  shared(withBasePath("/images/carousel-3.jpg"), "foto.carousel-3"),
  shared(withBasePath("/images/carousel-1.jpg"), "foto.carousel-1"),
  shared(withBasePath("/images/adv-krb.jpg"), "foto.adv-krb"),
  shared(withBasePath("/images/gallery-3.jpg"), "foto.gallery-3"),
  shared(withBasePath("/images/carousel-2.png"), "foto.carousel-2"),
];

// Stejné ilustrační fotky (Wikimedia Commons, viz lib/commonsImage.ts) jako
// na podstránce Tipy na výlety — dokud klient nedodá vlastní fotky míst
// v okolí, ukazujeme aspoň reálná místa místo neutrálních Picsum placeholderů.
const OKOLI: PhotoDef[] = [
  { src: commonsFile("Sněžka a Obří důl.jpg"), altId: "foto.okoli.snezka", stranka: "galerie" },
  { src: commonsFile("ZOO Dvůr Králové, vyhlídka v safari.JPG"), altId: "foto.okoli.zoo", stranka: "galerie" },
  { src: commonsFile("Adršpašskoteplické skály 02.JPG"), altId: "foto.okoli.adrspach", stranka: "galerie" },
  { src: commonsFile("Ansicht kreuzberg abfahrten 2009.jpg"), altId: "foto.okoli.mlade-buky", stranka: "galerie" },
  { src: commonsFile("Stezka korunami stromů Krkonoše 2024.jpg"), altId: "foto.okoli.stezka", stranka: "galerie" },
];

function Tile({
  photo,
  className,
  sizes,
  onOpen,
  placeholder,
}: {
  photo: Photo | null;
  className?: string;
  sizes: string;
  onOpen: (photo: Photo) => void;
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
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
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
  const s = texty("spolecne", locale);
  const resolve = (def: PhotoDef): Photo => ({ src: def.src, alt: (def.stranka === "galerie" ? g : s).vzdy(def.altId) });
  const exterier = EXTERIER.map((def) => (def ? resolve(def) : null));
  const interier = INTERIER.map(resolve);
  const okoli = OKOLI.map(resolve);
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
  const allPhotos: Photo[] = [
    ...(labels.exterier ? exterier.filter((p): p is Photo => Boolean(p)) : []),
    ...(labels.interier ? interier : []),
    ...(labels.okoli ? okoli : []),
  ];

  const openPhoto = (photo: Photo) => {
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
              <div className="hidden lg:grid lg:h-[200px] lg:grid-cols-4 lg:gap-4">
                {exterier.slice(5, 9).map((photo, i) => (
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
        slides={allPhotos}
      />
    </div>
  );
}
