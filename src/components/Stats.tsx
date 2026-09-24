import { texty, type Locale } from "@/lib/texty";
import { ikona } from "@/lib/ikony";

export default function Stats({ locale = "cs" }: { locale?: Locale }) {
  const u = texty("uvod", locale);
  const stats = u.seznam("statistiky.polozky");
  if (!u.sekce("statistiky") || stats.length === 0) return null;

  return (
    <div className="border-b border-border bg-sand">
      <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-x-3 gap-y-2 px-6 py-2 sm:grid-cols-6 md:px-10 lg:flex lg:items-stretch lg:justify-center lg:gap-0 lg:px-[100px] lg:py-0">
        {stats.map((stat, i) => {
          const Icon = ikona(stat.i);
          return (
            <div
              key={`${stat.t}-${stat.p}`}
              className={`flex flex-col items-center gap-0 text-center lg:flex-1 lg:justify-center lg:border-border lg:px-3 lg:py-2 ${
                i > 0 ? "lg:border-l lg:border-dotted" : ""
              }`}
            >
              <Icon className="size-3.5 text-pec" strokeWidth={1.5} aria-hidden />
              <p className="mt-0.5 text-[15px] font-bold text-ink">{stat.t}</p>
              {stat.p && <p className="text-[13px] font-semibold text-clay">{stat.p}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
