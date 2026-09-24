import { getNews } from "@/lib/notion";
import NewsGrid from "@/components/NewsGrid";
import { texty, type Locale } from "@/lib/texty";

export default async function NewsSection({ locale = "cs" }: { locale?: Locale }) {
  const news = await getNews();
  const u = texty("uvod", locale);

  // Klient si novinky přidává sám v Notionu — dokud tam žádné nejsou
  // (nebo databáze ještě není napojená), sekce se na webu vůbec nezobrazí.
  // Anglická verze zobrazuje stejné (české) novinky beze změny.
  if (news.length === 0 || !u.sekce("novinky")) return null;

  const eyebrow = u.t("novinky.nadtitulek");
  const heading = u.t("novinky.nadpis");

  return (
    <section id="novinky" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        {eyebrow && (
          <div className="flex flex-col gap-[5px]">
            <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{eyebrow}</p>
            <div className="h-[2px] w-7 bg-brand-gradient" />
          </div>
        )}
        {heading && (
          <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
            {heading}
          </h2>
        )}

        <NewsGrid news={news.slice(0, 6)} locale={locale} />
      </div>
    </section>
  );
}
