"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { texty, type Locale } from "@/lib/texty";
import Radky from "@/components/Radky";

export default function FAQAccordion({ locale = "cs" }: { locale?: Locale }) {
  const [open, setOpen] = useState<number | null>(0);
  const faq = texty("cenik", locale)
    .seznam("faq.polozky")
    .map((item) => ({ q: item.t, a: item.p ?? "" }));

  return (
    <div className="flex flex-col gap-3">
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-md border border-border bg-surface">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[14px] font-semibold text-ink">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="size-4 shrink-0 text-clay" aria-hidden />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-[13px] leading-[1.6] text-clay">
                    <Radky text={item.a} />
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
