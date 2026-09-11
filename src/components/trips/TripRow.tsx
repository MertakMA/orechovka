"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type Trip = {
  title: string;
  description: string;
  distance: string;
  image: string;
  mapQuery: string;
  moreHref?: string;
};

function TripLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-brand transition-colors hover:text-brand-light"
    >
      {children}
      <ArrowUpRight className="size-3.5" strokeWidth={2.5} aria-hidden />
    </a>
  );
}

export default function TripRow({ trip, index = 0 }: { trip: Trip; index?: number }) {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.mapQuery)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }}
      className="group flex flex-col gap-5 py-10 sm:flex-row sm:gap-8"
    >
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
          <h3 className="font-serif text-[20px] font-bold text-ink sm:text-[24px]">{trip.title}</h3>
          <p className="mt-2 text-[14px] leading-[1.7] text-clay">{trip.description}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end sm:text-right">
          <p className="text-[11px] font-semibold tracking-[1.5px] text-stone">VZDÁLENOST</p>
          <p className="font-serif text-[20px] font-bold text-ink">{trip.distance}</p>
          <div className="mt-2 flex flex-col items-start gap-1.5 sm:items-end">
            <TripLink href={mapHref}>Mapa</TripLink>
            {trip.moreHref && <TripLink href={trip.moreHref}>Více</TripLink>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
