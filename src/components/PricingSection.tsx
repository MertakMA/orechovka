"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PriceCard from "@/components/pricing/PriceCard";
import { V } from "@/generated/variables";

type Locale = "cs" | "en";

const FEATURES: Record<Locale, string[]> = {
  cs: ["Energie v ceně", "WiFi zdarma", "Parkování zdarma", "Postel. prádlo"],
  en: ["Utilities included", "Free WiFi", "Free parking", "Bed linen"],
};

const SEASON_LABELS: Record<Locale, { off: string; shoulder: string; peak: string; welcomePack: string }> = {
  cs: { off: "Mimo sezónu", shoulder: "Vedlejší sezóna", peak: "Hlavní sezóna", welcomePack: "Uvítací balíček" },
  en: { off: "Off season", shoulder: "Shoulder season", peak: "Peak season", welcomePack: "Welcome pack" },
};

const TEXT: Record<Locale, { eyebrow: string; link: string; perNight: string; button: string; badge: string }> = {
  cs: {
    eyebrow: "CENÍK",
    link: "Zobrazit celý ceník a časté dotazy →",
    perNight: "za noc",
    button: "Rezervovat přes Booking",
    badge: "★ Nejoblíbenější",
  },
  en: {
    eyebrow: "RATES",
    link: "See the full price list and FAQ →",
    perNight: "per night",
    button: "Book via Booking.com",
    badge: "★ Most popular",
  },
};

function buildPlans(locale: Locale) {
  const features = FEATURES[locale];
  const s = SEASON_LABELS[locale];
  return [
    {
      season: s.shoulder,
      price: V.CENA_VEDLEJSI_SEZONA,
      dateRange: V.TERMIN_VEDLEJSI_SEZONA,
      features,
    },
    {
      season: s.peak,
      price: V.CENA_HLAVNI_SEZONA,
      dateRange: V.TERMIN_HLAVNI_SEZONA,
      features: [...features, s.welcomePack],
      featured: true,
    },
    {
      season: s.off,
      price: V.CENA_MIMO_SEZONU,
      dateRange: V.TERMIN_MIMO_SEZONU,
      features,
    },
  ];
}

export default function PricingSection({ locale = "cs" }: { locale?: Locale }) {
  const t = TEXT[locale];
  const plans = buildPlans(locale);

  return (
    <section id="cenik" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[13px] font-semibold tracking-[2.16px] text-pec-dark">{t.eyebrow}</p>
        <div className="mt-[18px] h-[2px] w-10 bg-pec" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[42px] lg:grid-cols-3 lg:items-center lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.season}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full"
            >
              <PriceCard {...plan} perNightLabel={t.perNight} buttonLabel={t.button} badge={t.badge} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={locale === "cs" ? "/cenik" : "/en/cenik"}
            className="text-[15px] font-semibold text-bark hover:underline"
          >
            {t.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
