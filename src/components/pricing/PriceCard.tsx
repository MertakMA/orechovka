"use client";

import { Check } from "lucide-react";
import { reservationHref } from "@/lib/rezervace";

export type PriceCardProps = {
  season: string;
  periods: { name: string; dates: string }[];
  stays: { name: string; price: string; details: string[] }[];
  includedHeading: string | null;
  features: string[];
  featured?: boolean;
  badge: string | null;
  buttonHref?: string;
  buttonLabel: string | null;
  // Úvodní stránka: jen hlavička a typy pobytů s cenou (bez sezón, dnů a „Cena zahrnuje“).
  compact?: boolean;
};

export default function PriceCard({
  season,
  periods,
  stays,
  includedHeading,
  features,
  featured = false,
  badge,
  buttonHref = reservationHref("cs"),
  buttonLabel,
  compact = false,
}: PriceCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-xl border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_16px_36px_rgba(107,74,50,0.18)] sm:p-7 ${
        featured
          ? "border-[2.5px] border-brand shadow-[0_20px_45px_rgba(107,74,50,0.28)] lg:-mt-5"
          : "border-[1.5px] border-brand/60"
      }`}
    >
      {featured && badge && (
        <span className="absolute -top-3 left-7 rounded-full bg-pec-dark px-3 py-1 text-[11px] font-semibold text-cream">
          {badge}
        </span>
      )}

      <p className="text-[14px] font-semibold text-ink">{season}</p>

      {!compact && periods.length > 0 && (
        <div
          className="mt-4 grid divide-x divide-border rounded-lg bg-cream py-3"
          style={{ gridTemplateColumns: `repeat(${periods.length}, minmax(0, 1fr))` }}
        >
          {periods.map((period) => (
            <div key={period.name} className="px-3 text-center">
              <p className="text-[13px] font-semibold text-ink">{period.name}</p>
              {period.dates && <p className="mt-0.5 text-[12px] leading-[1.4] text-clay">{period.dates}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="my-5 border-t border-border" />

      <ul className={`flex flex-col ${compact ? "flex-1 gap-[9px]" : "gap-4"}`}>
        {stays.map((stay) => (
          <li key={stay.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-ink ${compact ? "text-[13px]" : "text-[14px] font-semibold"}`}>{stay.name}</span>
              <span className={`shrink-0 text-right font-semibold text-ink ${compact ? "text-[13px]" : "text-[14px]"}`}>
                {stay.price}
              </span>
            </div>
            {!compact &&
              stay.details.map((detail) => (
                <p key={detail} className="mt-0.5 text-[12px] leading-[1.45] text-clay">
                  {detail}
                </p>
              ))}
          </li>
        ))}
      </ul>

      {!compact && features.length > 0 && (
        <>
          <div className="my-5 border-t border-border" />
          {includedHeading && <p className="mb-3 text-[13px] font-semibold text-ink">{includedHeading}</p>}
          <ul className="flex flex-1 flex-col gap-[7px]">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-[13px] text-clay">
                <Check className="mt-[2px] size-[14px] shrink-0 text-pec" strokeWidth={2.5} aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </>
      )}

      {buttonLabel && (
        <a
          href={buttonHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-lg bg-brand py-3 text-center text-[14px] font-semibold text-cream transition-colors duration-300 hover:bg-brand-dark"
        >
          {buttonLabel}
        </a>
      )}
    </div>
  );
}
