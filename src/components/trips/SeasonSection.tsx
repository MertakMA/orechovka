import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import TripRow, { type Trip } from "./TripRow";

export default function SeasonSection({
  id,
  icon,
  eyebrow,
  title,
  subtitle,
  trips,
  bgClassName = "bg-white",
  extraLink,
}: {
  id: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  trips: Trip[];
  bgClassName?: string;
  extraLink?: { label: string; href: string };
}) {
  return (
    <section id={id} className={`${bgClassName} px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px]`}>
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand shadow-sm">
            {icon}
          </span>
          <div className="flex flex-col gap-[5px]">
            <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{eyebrow}</p>
            <div className="h-[2px] w-7 bg-brand-gradient" />
          </div>
        </div>
        <h2 className="mt-4 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">{title}</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-clay">{subtitle}</p>

        <div className="mt-4 divide-y divide-border border-t border-border">
          {trips.map((trip, i) => (
            <TripRow key={trip.title} trip={trip} index={i} />
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
