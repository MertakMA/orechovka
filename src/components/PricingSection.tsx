"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PriceCard from "@/components/pricing/PriceCard";

const FEATURES = ["Energie v ceně", "WiFi zdarma", "Parkování zdarma", "Postel. prádlo"];

const PLANS = [
  {
    season: "Vedlejší sezóna",
    price: "od 3 200 Kč",
    dateRange: "Květen, září, říjen",
    features: FEATURES,
  },
  {
    season: "Hlavní sezóna",
    price: "od 4 500 Kč",
    dateRange: "Červen – srpen, svátky",
    features: [...FEATURES, "Uvítací balíček"],
    featured: true,
  },
  {
    season: "Mimo sezónu",
    price: "od 2 500 Kč",
    dateRange: "Listopad – duben",
    features: FEATURES,
  },
];

export default function PricingSection() {
  return (
    <section id="cenik" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[13px] font-semibold tracking-[2.16px] text-brand">CENÍK</p>
        <div className="mt-[18px] h-[2px] w-10 bg-brand" />
        <h2 className="mt-[12px] font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          Kolik vás to bude stát
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[42px] lg:grid-cols-3 lg:items-center lg:gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.season}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full"
            >
              <PriceCard {...plan} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/cenik" className="text-[15px] font-semibold text-brand hover:underline">
            Zobrazit celý ceník a časté dotazy →
          </Link>
        </div>
      </div>
    </section>
  );
}
