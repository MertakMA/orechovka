import { getNews } from "@/lib/notion";
import NewsGrid from "@/components/NewsGrid";

export default async function NewsSection() {
  const news = await getNews();

  // Klient si novinky přidává sám v Notionu — dokud tam žádné nejsou
  // (nebo databáze ještě není napojená), sekce se na webu vůbec nezobrazí.
  if (news.length === 0) return null;

  return (
    <section id="novinky" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">NOVINKY</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">
          Co je nového
        </h2>

        <NewsGrid news={news.slice(0, 6)} />
      </div>
    </section>
  );
}
