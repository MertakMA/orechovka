import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import PriceCard from "@/components/pricing/PriceCard";
import FAQAccordion from "@/components/pricing/FAQAccordion";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Ceník ubytování",
  description: "Jasné ceny, žádné skryté poplatky. Sezónní ceník, co je v ceně a časté dotazy k rezervaci přes Booking.com.",
};

const PLANS = [
  {
    season: "Vedlejší sezóna",
    price: V.CENA_VEDLEJSI_SEZONA,
    dateRange: V.TERMIN_VEDLEJSI_SEZONA,
    features: ["Energie v ceně", "WiFi zdarma", "Parkování zdarma", "Postel. prádlo"],
  },
  {
    season: "Hlavní sezóna",
    price: V.CENA_HLAVNI_SEZONA,
    dateRange: V.TERMIN_HLAVNI_SEZONA,
    features: ["Energie v ceně", "WiFi zdarma", "Parkování zdarma", "Postel. prádlo", "Uvítací balíček"],
    featured: true,
  },
  {
    season: "Mimo sezónu",
    price: V.CENA_MIMO_SEZONU,
    dateRange: V.TERMIN_MIMO_SEZONU,
    features: ["Energie v ceně", "WiFi zdarma", "Parkování zdarma", "Postel. prádlo"],
  },
];

const INCLUDED = [
  "Energie (elektřina, topení)",
  "WiFi připojení",
  `Parkování na pozemku (${V.POCET_PARKOVACICH_MIST} místa)`,
  "Ložní prádlo a ručníky",
  "Základní vybavení kuchyně",
  "Zahrada a terasa",
];

const FEES = [
  { label: "Turistická taxa", value: V.POPLATEK_TURISTICKA_TAXA },
  { label: "Úklid při odjezdu", value: V.POPLATEK_UKLID },
  { label: "Domácí mazlíčci", value: V.POPLATEK_MAZLICCI },
  { label: "Pozdní check-out", value: V.POPLATEK_POZDNI_CHECKOUT },
  { label: "Víkend mimo sezónu", value: V.POPLATEK_VIKEND },
];

export default async function CenikPage() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-[#1a241f]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Ceník ubytování</h1>
            <p className="max-w-xl text-[15px] text-[#d9ebe3] sm:text-[17px]">
              Jasné ceny, žádné skryté poplatky. Rezervace přes Booking.com.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-brand">SEZÓNNÍ CENY</p>
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[38px]">Vyberte si svůj termín</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-clay">
              Ceny jsou za celou roubenku. Minimální délka pobytu: {V.MIN_DELKA_POBYTU}.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8">
              {PLANS.map((plan) => (
                <PriceCard key={plan.season} {...plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5efe6] px-6 py-14 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">Co je zahrnuto v ceně</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                  <span className="text-[14px] text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fafaf8] px-6 py-14 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-serif text-[22px] font-bold text-ink">Doplňkové poplatky</h2>
            <div className="mt-6 divide-y divide-border border-t border-border">
              {FEES.map((fee) => (
                <div key={fee.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[14px] font-medium text-ink">{fee.label}</span>
                  <span className="text-[14px] text-clay">{fee.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5efe6] px-6 py-16 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">Časté dotazy k ceníku</h2>
            <div className="mt-8">
              <FAQAccordion />
            </div>
          </div>
        </section>

        <CTASection
          title="Zaujaly vás naše ceny?"
          subtitle="Zkontrolujte dostupné termíny a rezervujte bezpečně přes Booking.com."
          buttonLabel="Zkontrolovat dostupnost na Booking →"
        />
      </main>
      <Footer />
    </>
  );
}
