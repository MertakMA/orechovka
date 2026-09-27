import { forwardRef, useId } from "react";
import type { LucideProps } from "lucide-react";

// Lucide přeškrtnutou tlapku nemá. Tlapka je z lucide PawPrint; maska kolem
// přeškrtnutí vyřízne mezeru (jako u jejich "-off" ikon), jinak čára v malé
// velikosti splyne s polštářkem tlapky.
const PawPrintOff = forwardRef<SVGSVGElement, LucideProps>(function PawPrintOff(
  { color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth: _absolute, className, ...rest },
  ref,
) {
  const maskId = useId();
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={["lucide lucide-paw-print-off", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" stroke="none" />
        <path d="m2 2 20 20" stroke="black" strokeWidth={Number(strokeWidth) * 2.6} />
      </mask>
      <g mask={`url(#${maskId})`}>
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
      </g>
      <path d="m2 2 20 20" />
    </svg>
  );
});

export default PawPrintOff;
