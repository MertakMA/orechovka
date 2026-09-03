import { BedDouble, Users, Droplet, Trees, Wifi, SquareParking } from "lucide-react";

// TODO: upřesnit reálné údaje o roubence (počet ložnic, koupelen, m² zahrady) od klienta.
const STATS = [
  { value: "3", label: "Ložnice", Icon: BedDouble },
  { value: "8 osob", label: "Kapacita", Icon: Users },
  { value: "1", label: "Koupelna", Icon: Droplet },
  { value: "500 m²", label: "Zahrada", Icon: Trees },
  { value: "WiFi", label: "Internet zdarma", Icon: Wifi },
  { value: "Zdarma", label: "Parkování", Icon: SquareParking },
];

export default function Stats() {
  return (
    <div className="border-b border-border bg-bark">
      <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-x-3 gap-y-3 px-6 py-3 sm:grid-cols-6 md:px-10 lg:flex lg:items-stretch lg:justify-center lg:gap-0 lg:px-[100px] lg:py-0">
        {STATS.map(({ value, label, Icon }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-0.5 text-center lg:flex-1 lg:justify-center lg:border-white/20 lg:px-3 lg:py-2.5 ${
              i > 0 ? "lg:border-l lg:border-dotted" : ""
            }`}
          >
            <Icon className="size-3.5 text-white" strokeWidth={1.5} aria-hidden />
            <p className="mt-0.5 text-[12px] font-semibold text-white">{value}</p>
            <p className="text-[9px] text-white/60">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
