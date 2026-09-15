import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import GalleryFilterGrid from "@/components/gallery/GalleryFilterGrid";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Take a look inside Roubenka Ořechovka and its surroundings — exterior, interior and trips in the Krkonoše.",
  alternates: {
    canonical: `${V.SITE_URL}/en/galerie`,
    languages: { cs: `${V.SITE_URL}/galerie`, en: `${V.SITE_URL}/en/galerie` },
  },
  openGraph: { locale: "en_US" },
};

export default async function GalleryPageEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]" />
          <div className="absolute inset-0 bg-[#2a1c12]/50" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Gallery</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              Take a look inside Roubenka Ořechovka and its surroundings.
            </p>
          </div>
        </section>

        <div className="px-6 sm:px-10 lg:px-[100px]">
          <GalleryFilterGrid locale="en" />
        </div>

        <CTASection
          title="Roubenka Ořechovka is waiting"
          subtitle="Book your stay simply and safely via Booking.com."
          buttonLabel="Book your stay via Booking.com →"
        />
      </main>
      <Footer locale="en" />
    </>
  );
}
