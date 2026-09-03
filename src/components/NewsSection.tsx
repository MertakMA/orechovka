import Image from "next/image";
import { getNews } from "@/lib/notion";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

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

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-3">
          {news.slice(0, 6).map((item) => {
            const date = formatDate(item.date);
            const Wrapper = item.link ? "a" : "div";
            return (
              <Wrapper
                key={item.id}
                {...(item.link ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white transition-colors hover:border-brand"
              >
                {item.imageUrl && (
                  <div className="relative h-[180px] w-full">
                    <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
                  </div>
                )}
                <div className="flex flex-col gap-2 px-5 py-[18px]">
                  {date && <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">{date}</p>}
                  <h3 className="font-serif text-[18px] font-bold text-ink">{item.title}</h3>
                  {item.text && <p className="text-[14px] leading-[1.55] text-clay">{item.text}</p>}
                  {item.link && <span className="mt-1 text-[13px] font-semibold text-brand">Více informací →</span>}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
