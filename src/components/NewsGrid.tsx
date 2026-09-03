"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { NewsItem } from "@/lib/notion";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

// Klient v Notionu odděluje odstavce novým řádkem — každý neprázdný
// řádek se v popupu vykreslí jako vlastní odstavec.
function paragraphs(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Karty s novinkami + popup s detailem. Karta v mřížce ukazuje jen
 * obrázek/datum/název, ať se dlouhým textem nikdy nerozbije rozvržení —
 * celý text novinky je vidět až po kliknutí v popupu, rozdělený na
 * odstavce a zarovnaný na střed v pevné čitelné šířce.
 */
export default function NewsGrid({ news }: { news: NewsItem[] }) {
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-3">
        {news.map((item) => {
          const date = formatDate(item.date);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-[10px] border border-border bg-white text-left transition-colors hover:border-brand"
            >
              {item.imageUrl && (
                <div className="relative h-[180px] w-full">
                  <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-2 px-5 py-[18px]">
                {date && <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">{date}</p>}
                <h3 className="font-serif text-[18px] font-bold text-ink">{item.title}</h3>
                {item.text && (
                  <p className="line-clamp-2 text-[14px] leading-[1.55] text-clay">{item.text}</p>
                )}
                <span className="mt-1 text-[13px] font-semibold text-brand">Více informací →</span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="novinka-popup-title"
              className="relative max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-[14px] bg-white shadow-xl"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Zavřít"
                className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-xl text-[#1f150c] shadow-md"
              >
                ×
              </button>

              {selected.imageUrl && (
                <div className="relative h-[220px] w-full shrink-0">
                  <Image src={selected.imageUrl} alt={selected.title} fill unoptimized className="object-cover" />
                </div>
              )}

              <div className="flex flex-col items-center gap-3 px-6 py-6 text-center">
                {formatDate(selected.date) && (
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                    {formatDate(selected.date)}
                  </p>
                )}
                <h3 id="novinka-popup-title" className="font-serif text-[22px] font-bold text-ink">
                  {selected.title}
                </h3>

                {selected.text && (
                  <div className="mx-auto flex max-w-[380px] flex-col gap-3">
                    {paragraphs(selected.text).map((paragraph, i) => (
                      <p key={i} className="text-[15px] leading-[1.65] text-clay">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block w-fit rounded-lg bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-light"
                  >
                    {selected.linkText || "Otevřít odkaz"} →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
