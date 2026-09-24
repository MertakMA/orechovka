import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { texty } from "@/lib/texty";

// Statický export má jen jednu stránku 404 (bez jazykové verze), proto česky.
export default async function NotFound() {
  const news = await getNews();
  const t = texty("chyba404", "cs");
  const code = t.t("kod");
  const heading = t.t("nadpis");
  const text = t.t("text");
  const button = t.t("tlacitko");

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main className="flex flex-col items-center justify-center gap-6 bg-cream px-6 py-24 text-center sm:py-32">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-full bg-surface shadow-[0px_10px_30px_0px_rgba(34,25,16,0.12)] sm:size-32">
          <Image src={withBasePath("/images/logo.svg")} alt="" width={795} height={742} className="h-16 w-auto sm:h-20" />
        </div>
        {code && <p className="text-gradient font-serif text-[72px] font-bold leading-none sm:text-[110px]">{code}</p>}
        {heading && <h1 className="font-serif text-[32px] font-bold text-ink sm:text-[44px]">{heading}</h1>}
        {text && <p className="max-w-md text-[15px] leading-[1.6] text-clay">{text}</p>}
        {button && (
          <Link
            href="/"
            className="mt-2 rounded bg-brand px-8 py-4 text-[15px] font-semibold text-cream transition-colors hover:bg-brand-dark"
          >
            {button}
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}
