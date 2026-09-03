import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import GalleryFilterGrid from "@/components/gallery/GalleryFilterGrid";
import { withBasePath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Nahlédněte do Roubenky Ořechovka a jejího okolí — exteriér, interiér i výlety v Krkonoších.",
};

export default function GaleriePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-[#1a241f]/50" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Galerie</h1>
            <p className="max-w-xl text-[15px] text-[#d9ebe3] sm:text-[17px]">
              Nahlédněte do Roubenky Ořechovka a jejího okolí.
            </p>
          </div>
        </section>

        <div className="px-6 sm:px-10 lg:px-[100px]">
          <GalleryFilterGrid />
        </div>

        <CTASection
          title="Roubenka Ořechovka vás čeká"
          subtitle="Zarezervujte si pobyt jednoduše a bezpečně přes Booking.com."
        />
      </main>
      <Footer />
    </>
  );
}
