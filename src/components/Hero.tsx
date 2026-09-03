"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/basePath";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-[calc(100svh-6rem)] max-h-[calc(900px-6rem)] min-h-[440px] items-end overflow-hidden"
    >
      <Image
        src={withBasePath("/images/hero-facade.jpg")}
        alt="Roubenka Ořechovka – dřevěná roubenka s prosklenou terasou"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_50%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(16,10,5,0) 0%, rgba(16,10,5,0.25) 40%, rgba(16,10,5,0.78) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full px-6 pb-14 sm:px-10 sm:pb-16 lg:px-[100px] lg:pb-[70px]"
      >
        <h1 className="max-w-3xl font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.5px] text-white sm:text-[64px] sm:leading-[1.05] lg:text-[96px] lg:leading-[90px] lg:tracking-[-1.2px]">
          Vaše útočiště
          <br />v srdci přírody
        </h1>
        <div className="mt-6 h-[2.5px] w-14 rounded bg-brand-gradient sm:mt-8" />
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <a
            href="https://www.booking.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-brand px-8 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-light"
          >
            Rezervovat na Bookingu
          </a>
          <Link
            href="/galerie"
            className="rounded border-[1.5px] border-white/80 bg-white/20 px-6 py-[14px] text-center text-[15px] text-white transition-colors hover:bg-white/30"
          >
            Prohlédnout galerii
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
