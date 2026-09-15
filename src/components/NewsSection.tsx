import { getNews } from "@/lib/notion";
import NewsGrid from "@/components/NewsGrid";

type Locale = "cs" | "en";

const TEXT: Record<Locale, { eyebrow: string; heading: string }> = {
  cs: { eyebrow: "NOVINKY", heading: "Co je nového" },
  en: { eyebrow: "NEWS", heading: "What's new" },
};

export default async function NewsSection({ locale = "cs" }: { locale?: Locale }) {
  const news = await getNews();
  const t = TEXT[locale];

  // Klient si novinky přidává sám v Notionu — dokud tam žádné nejsou
  // (nebo databáze ještě není napojená), sekce se na webu vůbec nezobrazí.
  // Anglická verze zobrazuje stejné (české) novinky beze změny.
  if (news.length === 0) return null;

  return (
    <section id="novinky" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{t.eyebrow}</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          {t.heading}
        </h2>

        <NewsGrid news={news.slice(0, 6)} locale={locale} />
      </div>
    </section>
  );
}
