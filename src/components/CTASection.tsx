export default function CTASection({
  title,
  subtitle,
  buttonLabel = "Rezervovat pobyt přes Booking.com →",
  buttonHref = "https://www.booking.com",
}: {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="bg-[#2e4238] px-6 py-16 text-center sm:px-10 sm:py-20">
      <h2 className="font-serif text-[28px] font-bold text-white sm:text-[34px] lg:text-[40px]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] text-[#d1e8de] sm:text-[17px]">{subtitle}</p>
      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-lg bg-brand px-11 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-light sm:text-base"
      >
        {buttonLabel}
      </a>
    </section>
  );
}
