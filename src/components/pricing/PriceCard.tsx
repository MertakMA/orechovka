"use client";

import { Check } from "lucide-react";
import { V } from "@/generated/variables";

export type PriceCardProps = {
  season: string;
  price: string;
  dateRange: string;
  features: string[];
  featured?: boolean;
  badge: string | null;
  buttonHref?: string;
  perNightLabel: string | null;
  buttonLabel: string | null;
};

export default function PriceCard({
  season,
  price,
  dateRange,
  features,
  featured = false,
  badge,
  buttonHref = V.BOOKING_URL,
  perNightLabel,
  buttonLabel,
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
      <p className="mt-2 font-serif text-[30px] font-bold text-ink">{price}</p>
      {perNightLabel && <p className="text-[13px] text-clay">{perNightLabel}</p>}
      <p className="mt-1 text-[13px] leading-[1.5] text-clay">{dateRange}</p>

      <div className="my-5 border-t border-border" />

      <ul className="flex flex-1 flex-col gap-[7px]">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[13px] text-clay">
            <Check className="mt-[2px] size-[14px] shrink-0 text-pec" strokeWidth={2.5} aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

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
