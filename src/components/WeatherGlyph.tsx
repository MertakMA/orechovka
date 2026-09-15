import type { WeatherKind } from "@/lib/weather";

// Ručně kreslené obrysové ikonky počasí — jen tahy, žádné výplně a žádná
// emoji, aby karta počasí ladila se zbytkem webu. Kreslí se currentColor,
// velikost i barvu řídí className zvenčí.
//
// Obrysový mrak je průhledný, takže se slunce nikdy nepřekrývá s mrakem —
// každá kombinace má sluníčko odsazené vedle, ne za ním.

const CLOUD =
  "M6.8 17.2C4.9 17.2 3.5 15.8 3.5 14.1c0-1.6 1.2-2.9 2.8-3.1C6.7 8.6 8.8 6.8 11.3 6.8c2.4 0 4.4 1.6 5 3.8 2.1.1 3.7 1.8 3.7 3.8 0 1.6-1.3 2.8-2.9 2.8Z";

function Cloud({ transform }: { transform?: string }) {
  return <path d={CLOUD} transform={transform} />;
}

function Glyphs({ kind }: { kind: WeatherKind }) {
  switch (kind) {
    case "clear":
      return (
        <>
          <circle cx="12" cy="12" r="4.3" />
          <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5" />
        </>
      );

    // Skoro jasno: velké slunce, mráček jen v rohu.
    case "few-clouds":
      return (
        <>
          <circle cx="10.2" cy="8.6" r="3.4" />
          <path d="M10.2 4V2.8M6.95 5.35l-.85-.85M13.45 5.35l.85-.85M5.6 8.6H4.4M14.8 8.6H16M6.95 11.85l-.85.85" />
          <Cloud transform="translate(6 10.8) scale(0.52)" />
        </>
      );

    // Polojasno: mrak vede, slunce vykukuje vpravo nahoře.
    case "partly-cloudy":
      return (
        <>
          <circle cx="16.8" cy="7.2" r="2.9" />
          <path d="M16.8 3V1.9M13.8 4.2l-.8-.8M19.8 4.2l.8-.8M21 7.2h1.1M19.8 10.2l.8.8" />
          <Cloud transform="translate(-1.2 5.6) scale(0.76)" />
        </>
      );

    // Zataženo: dva mraky nad sebou.
    case "cloudy":
      return (
        <>
          <Cloud transform="translate(7 -0.8) scale(0.46)" />
          <Cloud transform="translate(-0.5 3.4) scale(0.88)" />
        </>
      );

    // Mlha: pruhy táhnoucí se krajinou.
    case "fog":
      return (
        <path d="M3.4 8.4c3.4-.6 6.4.6 9.9 0 2.7-.5 5.1-.1 6.9.2M3.4 12.2c3.6-.6 6.8.6 10.4 0 2.6-.4 4.8 0 6.4.2M3.4 16c3.4-.6 6.4.6 9.9 0 2.7-.5 5.1-.1 6.9.2M5.9 19.7c3-.5 5.6.5 8.7 0" />
      );

    case "drizzle":
      return (
        <>
          <Cloud />
          <path d="M8.4 19.6l-.7 1.9M12.2 19.6l-.7 1.9M16 19.6l-.7 1.9" />
        </>
      );

    case "rain":
      return (
        <>
          <Cloud />
          <path d="M8.2 19.4l-1.1 3.1M12.2 19.4l-1.1 3.1M16.2 19.4l-1.1 3.1" />
        </>
      );

    case "snow":
      return (
        <>
          <Cloud />
          <path d="M8.8 19v3.8M7.15 19.95l3.3 1.9M10.45 19.95l-3.3 1.9M15.2 19v3.8M13.55 19.95l3.3 1.9M16.85 19.95l-3.3 1.9" />
        </>
      );

    case "storm":
      return (
        <>
          <Cloud />
          <path d="M13.2 18.2l-2.8 3.1h2.2l-1.5 1.8" />
        </>
      );
  }
}

export default function WeatherGlyph({
  kind,
  className = "size-7",
  strokeWidth = 1.4,
}: {
  kind: WeatherKind;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <Glyphs kind={kind} />
    </svg>
  );
}
