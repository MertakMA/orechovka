"use client";

import { Check } from "lucide-react";
import { V } from "@/generated/variables";

export type PriceCardProps = {
  season: string;
  price: string;
  dateRange: string;
  features: string[];
  featured?: boolean;
  badge?: string;
  buttonHref?: string;
};

export default function PriceCard({
  season,
  price,
  dateRange,
  features,
  featured = false,
  badge = "★ Nejoblíbenější",
  buttonHref = V.BOOKING_URL,
}: PriceCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-xl border bg-white p-6 transition-colors duration-300 hover:bg-brand sm:p-7 ${
        featured
          ? "border-[2.5px] border-brand shadow-[0_20px_45px_rgba(95,140,122,0.28)] lg:-mt-5"
          : "border-[1.5px] border-brand/60"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-[#2e4238] px-3 py-1 text-[11px] font-semibold text-[#e5faf0]">
          {badge}
        </span>
      )}

      <p className="text-[14px] font-semibold text-ink transition-colors duration-300 group-hover:text-white">
        {season}
      </p>
      <p className="mt-2 font-serif text-[30px] font-bold text-ink transition-colors duration-300 group-hover:text-white">
        {price}
      </p>
      <p className="text-[13px] text-clay transition-colors duration-300 group-hover:text-white/80">za noc</p>
      <p className="mt-1 text-[12px] leading-[1.5] text-clay transition-colors duration-300 group-hover:text-white/80">
        {dateRange}
      </p>

      <div className="my-5 border-t border-border transition-colors duration-300 group-hover:border-white/25" />

      <ul className="flex flex-1 flex-col gap-[7px]">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-[13px] text-clay transition-colors duration-300 group-hover:text-white/90"
          >
            <Check
              className="mt-[2px] size-[14px] shrink-0 text-brand transition-colors duration-300 group-hover:text-white"
              strokeWidth={2.5}
              aria-hidden
            />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-lg bg-brand py-3 text-center text-[14px] font-semibold text-white transition-colors duration-300 group-hover:bg-[#2e4238]"
      >
        Rezervovat přes Booking
      </a>
    </div>
  );
}
