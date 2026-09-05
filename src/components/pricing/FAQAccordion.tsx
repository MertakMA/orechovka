"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { V } from "@/generated/variables";

const FAQ = [
  {
    q: "Jak probíhá rezervace?",
    a: "Rezervujte přímo přes Booking.com. Po potvrzení vám zašleme veškeré pokyny k příjezdu.",
  },
  {
    q: "Jaká je minimální délka pobytu?",
    a: `Minimálně ${V.MIN_DELKA_POBYTU}. O víkendu a svátcích min. ${V.MIN_DELKA_POBYTU}, v hlavní sezóně min. ${V.MIN_DELKA_POBYTU_HLAVNI_SEZONA}.`,
  },
  {
    q: "Kdy probíhá check-in a check-out?",
    a: `Check-in: ${V.CHECK_IN} / Check-out: ${V.CHECK_OUT}. Jiné časy po dohodě.`,
  },
  {
    q: "Je možné platit v hotovosti?",
    a: "Platbu zajišťuje Booking.com (karta, PayPal). Na místě nejsou žádné platby.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-md border border-border bg-white">
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
                  <p className="px-5 pb-4 text-[13px] leading-[1.6] text-clay">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
