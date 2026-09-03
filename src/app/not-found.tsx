import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";

export default async function NotFound() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main className="flex flex-col items-center justify-center gap-6 bg-cream px-6 py-24 text-center sm:py-32">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_10px_30px_0px_rgba(34,25,16,0.12)] sm:size-32">
          <Image src={withBasePath("/images/logo.svg")} alt="" width={100} height={117} className="h-20 w-auto sm:h-24" />
        </div>
        <p className="text-gradient font-serif text-[72px] font-bold leading-none sm:text-[110px]">CHYBA 404</p>
        <h1 className="font-serif text-[32px] font-bold text-ink sm:text-[44px]">Tahle stezka nikam nevede</h1>
        <p className="max-w-md text-[15px] leading-[1.6] text-clay">
          Stránka, kterou hledáte, tu bohužel není. Možná byla přesunuta, nebo jste zabloudili v lese.
        </p>
        <Link
          href="/"
          className="mt-2 rounded bg-brand px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-light"
        >
          Zpět na hlavní stránku
        </Link>
      </main>
      <Footer />
    </>
  );
}
