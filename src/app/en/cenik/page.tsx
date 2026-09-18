import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, CloudSun, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import PriceCard from "@/components/pricing/PriceCard";
import FAQAccordion from "@/components/pricing/FAQAccordion";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Rates",
  description:
    "Clear prices, no hidden fees. Seasonal rates, what's included, and frequently asked questions about booking via Booking.com.",
  alternates: {
    canonical: `${V.SITE_URL}/en/cenik`,
    languages: { cs: `${V.SITE_URL}/cenik`, en: `${V.SITE_URL}/en/cenik` },
  },
  openGraph: { locale: "en_US" },
};

const PLANS = [
  {
    season: "Shoulder season",
    price: V.CENA_VEDLEJSI_SEZONA,
    dateRange: V.TERMIN_VEDLEJSI_SEZONA,
    features: ["Utilities included", "Free WiFi", "Free parking", "Bed linen"],
  },
  {
    season: "Peak season",
    price: V.CENA_HLAVNI_SEZONA,
    dateRange: V.TERMIN_HLAVNI_SEZONA,
    features: ["Utilities included", "Free WiFi", "Free parking", "Bed linen", "Welcome pack"],
    featured: true,
  },
  {
    season: "Off season",
    price: V.CENA_MIMO_SEZONU,
    dateRange: V.TERMIN_MIMO_SEZONU,
    features: ["Utilities included", "Free WiFi", "Free parking", "Bed linen"],
  },
];

const INCLUDED = [
  "Utilities (electricity, heating)",
  "WiFi connection",
  `On-site parking (${V.POCET_PARKOVACICH_MIST} spaces)`,
  "Bed linen and towels",
  "Basic kitchen equipment",
  "Garden and terrace",
];

const FEES = [
  { label: "Local tourist tax", value: V.POPLATEK_TURISTICKA_TAXA },
  { label: "Departure cleaning", value: V.POPLATEK_UKLID },
  { label: "Late check-out", value: V.POPLATEK_POZDNI_CHECKOUT },
  { label: "Off-season weekend", value: V.POPLATEK_VIKEND },
];

const PRACTICAL_INFO = [
  { Icon: Clock, label: "Check-in", value: V.CHECK_IN, note: "Other times by arrangement" },
  { Icon: Clock, label: "Check-out", value: V.CHECK_OUT, note: "Other times by arrangement" },
  { Icon: CloudSun, label: "Weather", value: "Current forecast", note: "Mladé Buky and surroundings", href: "/en#pocasi" },
  { Icon: Video, label: "Webcam", value: "Live feed from the area", note: "Mladé Buky ski area", href: "/en#pocasi" },
];

export default async function CenikPageEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]" />
          <div className="absolute inset-0 bg-[#2a1c12]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Rates</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              Clear prices, no hidden fees. Booking via Booking.com.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">SEASONAL RATES</p>
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[38px]">Pick your dates</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-clay">
              Prices are for the whole cabin. Minimum stay: {V.MIN_DELKA_POBYTU}.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8">
              {PLANS.map((plan) => (
                <PriceCard
                  key={plan.season}
                  {...plan}
                  perNightLabel="per night"
                  buttonLabel="Book via Booking.com"
                  badge="★ Most popular"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream px-6 py-14 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-subhead text-[24px] font-bold text-ink sm:text-[28px]">What's included in the price</h2>
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

        <section className="bg-sand px-6 py-14 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-subhead text-[22px] font-bold text-ink">Additional fees</h2>
            <div className="mt-6 divide-y divide-border border-t border-border">
              {FEES.map((fee) => (
                <div key={fee.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[15px] font-semibold text-ink">{fee.label}</span>
                  <span className="text-[15px] font-medium text-clay">{fee.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream px-6 py-16 sm:px-10 lg:px-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-subhead text-[24px] font-bold text-ink sm:text-[28px]">Frequently asked questions</h2>
            <div className="mt-8">
              <FAQAccordion locale="en" />
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">PRACTICAL ARRIVAL INFO</p>
            <div className="mt-2 h-[2px] w-8 bg-pec" />
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">What to know before you arrive</h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRACTICAL_INFO.map(({ Icon, label, value, note, href }) => {
                const cardClassName =
                  "flex flex-col gap-2 rounded-lg bg-cream p-5 transition-colors hover:bg-tag/40";
                const content = (
                  <>
                    <Icon className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
                    <p className="text-[13px] font-semibold text-ink">{label}</p>
                    <p className="text-[14px] text-clay">
                      {value}
                      <br />
                      <span className="text-[13px]">{note}</span>
                    </p>
                  </>
                );
                return href ? (
                  <Link key={label} href={href} className={cardClassName}>
                    {content}
                  </Link>
                ) : (
                  <div key={label} className={cardClassName}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTASection
          title="Like our rates?"
          subtitle="Check available dates and book securely via Booking.com."
          buttonLabel="Check availability on Booking →"
        />
      </main>
      <Footer locale="en" />
    </>
  );
}
