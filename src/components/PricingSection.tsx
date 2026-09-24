"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PriceCard from "@/components/pricing/PriceCard";
import { buildPlans } from "@/lib/ceny";
import { texty, type Locale } from "@/lib/texty";

export default function PricingSection({ locale = "cs" }: { locale?: Locale }) {
  const u = texty("uvod", locale);
  const plans = buildPlans(locale);
  if (!u.sekce("cenik") || plans.length === 0) return null;

  const eyebrow = u.t("cenik.nadtitulek");
  const link = u.t("cenik.odkaz");

  return (
    <section id="cenik" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        {eyebrow && (
          <>
            <p className="text-[13px] font-semibold tracking-[2.16px] text-pec-dark">{eyebrow}</p>
            <div className="mt-[18px] h-[2px] w-10 bg-brand-gradient" />
          </>
        )}

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
              <PriceCard {...plan} />
            </motion.div>
          ))}
        </div>

        {link && (
          <div className="mt-10 text-center">
            <Link
              href={locale === "cs" ? "/cenik" : "/en/cenik"}
              className="text-[15px] font-semibold text-bark hover:underline"
            >
              {link}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
