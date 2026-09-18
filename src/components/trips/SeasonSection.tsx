import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import TripRow, { type Trip } from "./TripRow";

export type Season = "winter" | "summer" | "food";

// Každé období má vlastní akcent: zima ledově tyrkysová, léto slunečně
// okrová, restaurace ořechově hnědá.
const THEMES: Record<Season, { iconWrap: string; eyebrow: string; rule: string }> = {
  winter: { iconWrap: "bg-pec-light text-pec-dark", eyebrow: "text-pec-dark", rule: "bg-pec" },
  summer: { iconWrap: "bg-[#f6e5c3] text-[#94601a]", eyebrow: "text-[#94601a]", rule: "bg-[#94601a]" },
  food: { iconWrap: "bg-parchment text-brand", eyebrow: "text-brand", rule: "bg-brand" },
};

export default function SeasonSection({
  id,
  icon,
  eyebrow,
  title,
  subtitle,
  trips,
  season,
  bgClassName = "bg-cream",
  extraLink,
  locale = "cs",
}: {
  id: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  trips: Trip[];
  season: Season;
  bgClassName?: string;
  extraLink?: { label: string; href: string };
  locale?: "cs" | "en";
}) {
  const theme = THEMES[season];

  return (
    <section id={id} className={`relative ${bgClassName} px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px]`}>
      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ${theme.iconWrap}`}>
            {icon}
          </span>
          <div className="flex flex-col gap-[5px]">
            <p className={`${theme.eyebrow} text-[13px] font-semibold tracking-[2px]`}>{eyebrow}</p>
            <div className={`h-[2px] w-7 ${theme.rule}`} />
          </div>
        </div>
        <h2 className="mt-4 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">{title}</h2>
        <p className="mt-3 max-w-2xl text-[15px] font-medium leading-[1.6] text-clay">{subtitle}</p>

        <div className="mt-4 divide-y divide-border border-t border-border">
          {trips.map((trip, i) => (
            <TripRow key={trip.title} trip={trip} index={i} locale={locale} />
          ))}
        </div>

        {extraLink && (
          <a
            href={extraLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[15px] font-semibold text-brand hover:underline"
          >
            {extraLink.label}
            <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
          </a>
        )}
      </div>
    </section>
  );
}
