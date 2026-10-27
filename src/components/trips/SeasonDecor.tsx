import type { CSSProperties } from "react";
import { Coffee, CookingPot, Croissant, Leaf, Wine } from "lucide-react";

export type Season = "winter" | "summer" | "food";

// Dekorace sekcí na stránce Tipy na výlety. Všechno leží v pozadí
// (pointer-events-none, aria-hidden) a drží se hlavně v pravém horním rohu,
// kde je vedle nadpisu volné místo, aby nerušilo čtení tipů.

function Flake({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="-12 -12 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      className={className}
      style={style}
    >
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <g key={r} transform={`rotate(${r})`}>
          <path d="M0 0V-10.5M0 -6.2L-3 -9.2M0 -6.2L3 -9.2M0 -2.8L-1.8 -4.5M0 -2.8L1.8 -4.5" />
        </g>
      ))}
    </svg>
  );
}

function WinterDecor() {
  return (
    <>
      {/* ledový opar a jemné "sněžení" teček v rohu */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 88% 0%, rgba(95,155,152,0.16), transparent 58%)" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[460px]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(95,155,152,0.32) 1.3px, transparent 1.7px), radial-gradient(rgba(95,155,152,0.2) 1px, transparent 1.4px)",
          backgroundSize: "36px 36px, 36px 36px",
          backgroundPosition: "0 0, 18px 18px",
          maskImage: "radial-gradient(ellipse at 86% 0%, black 0%, transparent 62%)",
          WebkitMaskImage: "radial-gradient(ellipse at 86% 0%, black 0%, transparent 62%)",
        }}
      />
      <div className="text-pec">
        <Flake className="animate-snow-drift absolute right-[5%] top-8 size-16 opacity-30 sm:size-24" />
        <Flake
          className="animate-snow-drift absolute right-[20%] top-24 hidden size-10 opacity-40 sm:block"
          style={{ animationDelay: "-3s", animationDuration: "11s" }}
        />
        <Flake
          className="animate-snow-drift absolute right-[3%] top-40 hidden size-12 opacity-25 sm:block"
          style={{ animationDelay: "-6s", animationDuration: "13s" }}
        />
        <Flake
          className="animate-snow-drift absolute right-[28%] top-6 hidden size-7 opacity-35 lg:block"
          style={{ animationDelay: "-1.5s", animationDuration: "10s" }}
        />
        <Flake
          className="animate-snow-drift absolute right-[13%] top-60 hidden size-6 opacity-35 lg:block"
          style={{ animationDelay: "-4.5s" }}
        />
        <Flake
          className="animate-snow-drift absolute right-[22%] top-3 size-5 opacity-35 sm:hidden"
          style={{ animationDelay: "-2s" }}
        />
      </div>
    </>
  );
}

// Tráva na spodní hraně letní sekce — deterministicky "náhodná" stébla,
// ať se při každém buildu vykreslí stejně.
const GRASS_PATH = (() => {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  let d = "M0 60";
  for (let x = 0; x <= 1440; x += 9) {
    const h = 16 + rnd() * 30;
    const lean = (rnd() - 0.5) * 12;
    d += ` L${x} 60 Q${(x + 2 + lean / 2).toFixed(1)} ${(60 - h / 2).toFixed(1)} ${(x + 4 + lean).toFixed(1)} ${(60 - h).toFixed(1)} Q${x + 5} ${(60 - h / 2).toFixed(1)} ${x + 8} 60`;
  }
  return `${d} L1440 60 Z`;
})();

function Bird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 6" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" className={className}>
      <path d="M1 5 Q4 1 7 4 Q10 1 13 5" />
    </svg>
  );
}

function SummerDecor() {
  return (
    <>
      {/* hřejivé sluneční světlo z rohu */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 88% 0%, rgba(217,165,74,0.24), transparent 58%)" }}
      />
      {/* slunce: paprsky se velmi pomalu otáčejí */}
      <div className="absolute right-[4%] top-6 size-24 sm:right-[6%] sm:top-8 sm:size-40 lg:size-48">
        <svg viewBox="-100 -100 200 200" className="animate-sun-spin absolute inset-0 size-full text-[#d9a54a] opacity-50">
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1="0"
              y1={i % 2 ? -52 : -50}
              x2="0"
              y2={i % 2 ? -66 : -78}
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${i * 30})`}
            />
          ))}
        </svg>
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full">
          <circle r="36" fill="#e3b25a" opacity="0.42" />
          <circle r="26" fill="#edc77a" opacity="0.4" />
        </svg>
      </div>
      <div className="text-bark">
        <Bird className="absolute right-[24%] top-14 hidden w-5 opacity-35 sm:block" />
        <Bird className="absolute right-[27%] top-20 hidden w-3.5 opacity-30 sm:block" />
        <Bird className="absolute right-[21%] top-24 hidden w-4 opacity-25 lg:block" />
      </div>
      {/* lístky a louka při spodní hraně */}
      <Leaf
        className="absolute bottom-10 right-[6%] hidden size-12 rotate-[28deg] text-olive opacity-20 sm:block"
        strokeWidth={1.4}
      />
      <Leaf
        className="absolute bottom-16 right-[11%] hidden size-7 -rotate-12 text-olive opacity-20 lg:block"
        strokeWidth={1.6}
      />
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-7 w-full text-olive opacity-[0.16] sm:h-10"
      >
        <path fill="currentColor" d={GRASS_PATH} />
      </svg>
    </>
  );
}

function Steam({ className, delay }: { className?: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 10 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      className={`animate-steam ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <path d="M5 23 C1 18 9 14 5 9 C2 5 7 3 5 1" />
    </svg>
  );
}

function FoodDecor() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 88% 0%, rgba(138,101,71,0.13), transparent 58%)" }}
      />
      <div className="text-brand">
        {/* hrnek s kouřící párou */}
        <div className="absolute right-[6%] top-10 opacity-25 sm:right-[8%] sm:top-12">
          <div className="absolute -top-6 left-2 flex gap-1.5 sm:-top-8 sm:left-3">
            <Steam className="h-5 w-2 sm:h-7 sm:w-2.5" delay="0s" />
            <Steam className="h-5 w-2 sm:h-7 sm:w-2.5" delay="-1.2s" />
            <Steam className="h-5 w-2 sm:h-7 sm:w-2.5" delay="-2.4s" />
          </div>
          <Coffee className="size-10 sm:size-16" strokeWidth={1.3} />
        </div>
        <Wine className="absolute right-[22%] top-16 hidden size-11 rotate-[10deg] opacity-[0.18] sm:block" strokeWidth={1.3} />
        <CookingPot className="absolute right-[3%] top-44 hidden size-12 -rotate-6 opacity-[0.16] sm:block" strokeWidth={1.3} />
        <Croissant className="absolute right-[16%] top-52 hidden size-9 rotate-12 opacity-[0.16] lg:block" strokeWidth={1.3} />
      </div>
    </>
  );
}

export default function SeasonDecor({ season }: { season: Season }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {season === "winter" && <WinterDecor />}
      {season === "summer" && <SummerDecor />}
      {season === "food" && <FoodDecor />}
    </div>
  );
}
