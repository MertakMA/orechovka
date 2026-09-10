import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { TIPS } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Tipy na výlety",
  description: "Vybrali jsme nejlepší výletní cíle v okolí Roubenky Ořechovka — od Sněžky po Adršpašské skály.",
};

export default async function TipyPage() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-[#1a241f]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Tipy na výlety</h1>
            <p className="max-w-xl text-[15px] text-[#d9ebe3] sm:text-[17px]">
              V okolí roubenky je toho hodně k objevování — vybrali jsme naše oblíbené cíle.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 sm:gap-20 lg:gap-24">
            {TIPS.map((tip, i) => (
              <article
                key={tip.title}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-lg ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={tip.src}
                    alt={tip.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-[#333333]/72 px-3 py-1 text-[12px] font-bold text-white">
                    {tip.distance} od roubenky
                  </span>
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-[26px] font-bold text-ink sm:text-[30px]">{tip.title}</h2>
                  <p className="mt-4 text-[15px] leading-[1.7] text-clay">{tip.description}</p>
                  <a
                    href={tip.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-[15px] font-semibold text-brand hover:underline"
                  >
                    Zjistit více →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <CTASection
          title="Roubenka Ořechovka vás čeká"
          subtitle="Zarezervujte si pobyt jednoduše a bezpečně přes Booking.com."
        />
      </main>
      <Footer />
    </>
  );
}
