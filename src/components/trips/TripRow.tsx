"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { texty, type Locale } from "@/lib/texty";

export type Trip = {
  title: string;
  description: string;
  distance: string | null;
  image: string;
  mapQuery: string;
  moreHref?: string;
};

function TripLink({
  href,
  className = "text-brand hover:text-brand-dark",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative z-10 inline-flex items-center gap-0.5 text-[13px] font-semibold transition-colors ${className}`}
    >
      {children}
      <ArrowUpRight className="size-3.5" strokeWidth={2.5} aria-hidden />
    </a>
  );
}

const ARTICLE_LABEL: Record<Locale, string> = { cs: "celý článek", en: "full article" };

export default function TripRow({
  trip,
  index = 0,
  locale = "cs",
}: {
  trip: Trip;
  index?: number;
  locale?: Locale;
}) {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.mapQuery)}`;
  const v = texty("vylety", locale);
  const distanceLabel = v.t("vylet.vzdalenost");
  const mapLabel = v.t("vylet.mapa");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }}
      className="group relative flex flex-col gap-5 py-10 sm:flex-row sm:gap-8"
    >
      {/* Celá karta je odkaz na plný článek — žádný samostatný "více" odkaz
          v rohu. Leží jako neviditelná vrstva přes celý řádek (proto z-index
          nižší než u Mapy níž), takže se dá kliknout kamkoli na fotku i text. */}
      {trip.moreHref && (
        <a
          href={trip.moreHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${trip.title} — ${ARTICLE_LABEL[locale]}`}
          className="absolute inset-0 z-[1]"
        />
      )}

      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_20px_-8px_rgba(0,0,0,0.18)] sm:aspect-square sm:w-[220px] lg:w-[260px]">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="max-w-xl">
          <h3 className="inline-flex items-center gap-1.5 font-subhead text-[20px] font-bold text-ink transition-colors sm:text-[24px] group-hover:text-brand">
            {trip.title}
            {trip.moreHref && (
              <ArrowUpRight
                className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
                strokeWidth={2.5}
                aria-hidden
              />
            )}
          </h3>
          {trip.description && (
            <p className="mt-2 text-[15px] font-medium leading-[1.7] text-clay sm:text-[16px]">{trip.description}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end sm:text-right">
          {trip.distance && (
            <>
              {distanceLabel && <p className="text-[11px] font-bold tracking-[1.5px] text-stone">{distanceLabel}</p>}
              <p className="font-subhead text-[20px] font-bold text-ink">{trip.distance}</p>
            </>
          )}
          {mapLabel && (
            <div className="mt-2 flex flex-col items-start gap-1.5 sm:items-end">
              <TripLink href={mapHref} className="text-green-700 hover:text-green-800">
                {mapLabel}
              </TripLink>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
