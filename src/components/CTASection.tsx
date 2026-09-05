import { V } from "@/generated/variables";

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
  // Poslední mezera (před šipkou →) se nahradí nedělitelnou ( ), aby
  // se šipka na mobilu nikdy neodtrhla samotná na druhý řádek.
  const label = buttonLabel.replace(/ (?=\S*$)/, " ");

  return (
    <section className="bg-[#2e4238] px-6 py-16 text-center sm:px-10 sm:py-20">
      <h2 className="font-serif text-[28px] font-bold text-white sm:text-[34px] lg:text-[40px]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] text-[#d1e8de] sm:text-[17px]">{subtitle}</p>
      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-lg bg-brand px-6 py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-light sm:px-11 sm:py-4 sm:text-[15px] lg:text-base"
      >
        {label}
      </a>
    </section>
  );
}
