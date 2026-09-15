import { V } from "@/generated/variables";

// Hnědý pruh dřív končil rovnou čarou proti béžové, což působilo tvrdě.
// Horní i spodní hrana jsou teď měkké hřebeny hor. Nahoře se hnědá zvedá
// do sekce nad sebou (silueta je průhledná, takže sedí na jakémkoli pozadí),
// dole přes několik stále světlejších hřebenů postupně přejde do patičky.
function TopRidge() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-[18px] w-full text-bark sm:h-[26px] lg:h-[34px]"
    >
      <path
        fill="currentColor"
        d="M0 40 L0 30 C120 22 200 10 320 14 C430 18 500 30 610 24 C720 18 790 4 900 6 C1010 8 1080 26 1190 24 C1290 22 1360 12 1440 16 L1440 40 Z"
      />
    </svg>
  );
}

function BottomRidges() {
  // Čtyři hřebeny v teplých odstínech: každý je o stupeň světlejší, takže
  // hnědá plynule přejde až do pískové patičky (bez šedého mezitónu).
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -bottom-px h-[64px] w-full sm:h-[96px] lg:h-[130px]"
    >
      <path
        fill="#644731"
        d="M0 140 L0 62 C100 48 180 30 290 36 C400 42 460 64 570 58 C680 52 740 22 850 18 C930 15 980 30 1060 44 C1150 58 1230 40 1320 34 C1380 30 1420 34 1440 36 L1440 140 Z"
      />
      <path
        fill="#8a6b4d"
        d="M0 140 L0 82 C120 72 210 60 320 66 C440 72 510 90 630 86 C750 82 820 60 940 62 C1050 64 1110 84 1220 82 C1320 80 1390 70 1440 70 L1440 140 Z"
      />
      <path
        fill="#b8a081"
        d="M0 140 L0 100 C130 94 220 86 350 92 C470 98 560 110 690 106 C820 102 900 90 1030 92 C1150 94 1240 106 1350 104 C1395 103 1425 101 1440 100 L1440 140 Z"
      />
      {/* přední hřeben v barvě patičky, na něj patička plynule navazuje */}
      <path
        className="fill-sand"
        d="M0 140 L0 120 C150 114 260 110 400 114 C540 118 620 126 760 124 C900 122 980 112 1120 114 C1250 116 1340 122 1440 118 L1440 140 Z"
      />
    </svg>
  );
}

export default function CTASection({
  title,
  subtitle,
  buttonLabel = "Rezervovat pobyt přes Booking.com →",
  buttonHref = V.BOOKING_URL,
}: {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  // Poslední mezera (před šipkou →) se nahradí nedělitelnou ( ), aby
  // se šipka na mobilu nikdy neodtrhla samotná na druhý řádek.
  const label = buttonLabel.replace(/ (?=\S*$)/, " ");

  return (
    <section className="relative bg-gradient-to-b from-bark via-bark to-[#563f2c] px-6 pb-28 pt-14 text-center sm:px-10 sm:pb-36 sm:pt-16 lg:pb-44">
      <TopRidge />
      <div className="relative">
        <h2 className="font-serif text-[28px] font-bold text-cream sm:text-[34px] lg:text-[40px]">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">{subtitle}</p>
        <a
          href={buttonHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-cream px-6 py-3.5 text-[13px] font-semibold text-bark transition-colors hover:bg-sand sm:px-11 sm:py-4 sm:text-[15px] lg:text-base"
        >
          {label}
        </a>
      </div>
      <BottomRidges />
    </section>
  );
}
