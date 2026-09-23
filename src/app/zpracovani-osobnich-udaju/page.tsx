import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Zpracování osobních údajů",
  description: "Jaké osobní údaje z kontaktního formuláře zpracováváme, k čemu je používáme a jaká máte práva.",
  alternates: {
    canonical: `${V.SITE_URL}/zpracovani-osobnich-udaju`,
    languages: { cs: `${V.SITE_URL}/zpracovani-osobnich-udaju`, en: `${V.SITE_URL}/en/zpracovani-osobnich-udaju` },
  },
};

// Vychází přesně z toho, co kontaktní formulář (ContactForm.tsx) skutečně
// dělá: NEODESÍLÁ nic na server ani do žádné databáze. Tlačítko jen sestaví
// mailto: odkaz a otevře e-mailového klienta návštěvníka — e-mail pak
// odchází přímo z jeho zařízení na náš e-mail. Pokud se formulář v budoucnu
// nahradí opravdovým odesláním přes server (viz TODO "zprovoznit formulář"),
// je potřeba tuhle stránku podle nové architektury přepsat.
const SECTIONS = [
  {
    heading: "Kdo je správcem údajů",
    body: (
      <>
        <p>
          Správcem osobních údajů je provozovatel Roubenky Ořechovka, {V.ADRESA_RADEK_1} — {V.ADRESA_RADEK_2}, e-mail{" "}
          <a href={`mailto:${V.KONTAKT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {V.KONTAKT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    heading: "Jaké údaje zpracováváme",
    body: (
      <>
        <p>Přes kontaktní formulář na stránce Kontakt od vás můžeme získat:</p>
        <ul className="list-disc pl-5">
          <li>jméno a příjmení,</li>
          <li>e-mailovou adresu,</li>
          <li>telefonní číslo (nepovinné),</li>
          <li>předmět a obsah vaší zprávy.</li>
        </ul>
        <p>Jiné osobní údaje přes web nezískáváme.</p>
      </>
    ),
  },
  {
    heading: "Jak formulář technicky funguje",
    body: (
      <>
        <p>
          Kontaktní formulář nic neodesílá na náš server ani do žádné databáze. Po kliknutí na „Odeslat zprávu“ se
          na vašem zařízení otevře váš vlastní e-mailový klient s předvyplněnou zprávou adresovanou na{" "}
          {V.KONTAKT_EMAIL} — samotný e-mail pak odešlete vy, stejně jako kterýkoli jiný e-mail. Web samotný tedy
          zadané údaje nikde needukládá; ke zpracování dochází až doručením e-mailu do naší schránky, kde s ním
          nakládáme jako s běžnou e-mailovou korespondencí.
        </p>
      </>
    ),
  },
  {
    heading: "Proč údaje zpracováváme a na jakém základě",
    body: (
      <>
        <p>
          Účelem je odpovědět na váš dotaz a případně s vámi dál komunikovat ohledně pobytu. Právním základem je váš
          souhlas, který potvrzujete zaškrtnutím políčka před odesláním formuláře. Souhlas můžete kdykoli odvolat —
          stačí nám napsat na {V.KONTAKT_EMAIL}.
        </p>
        <p>
          Rezervace pobytu neprobíhá přes tento web, ale výhradně přes Booking.com, který má vlastní zásady ochrany
          osobních údajů.
        </p>
      </>
    ),
  },
  {
    heading: "Jak dlouho údaje uchováváme",
    body: (
      <>
        <p>
          E-maily z kontaktního formuláře uchováváme jen po dobu nezbytnou k vyřízení vaší zprávy a případné
          navazující komunikace, nejdéle však 2 roky od posledního kontaktu, pokud nevznikne důvod pro delší
          uchování (např. probíhající domluva o pobytu).
        </p>
      </>
    ),
  },
  {
    heading: "Cookies a externí služby",
    body: (
      <>
        <p>Web sám o sobě nepoužívá žádné vlastní cookies pro sledování návštěvnosti ani žádné analytické nástroje.</p>
        <p>Na některých stránkách jsou vložené služby třetích stran, které mohou zpracovávat technické údaje (např. IP adresu) podle vlastních zásad:</p>
        <ul className="list-disc pl-5">
          <li>Google Maps — mapa s polohou roubenky,</li>
          <li>externí webkamera (holidayinfo.cz) — živý záběr z okolí,</li>
          <li>Booking.com — rezervační systém.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Vaše práva",
    body: (
      <>
        <p>V souvislosti se zpracováním osobních údajů máte právo:</p>
        <ul className="list-disc pl-5">
          <li>na přístup ke svým osobním údajům,</li>
          <li>na opravu nepřesných údajů,</li>
          <li>na výmaz údajů,</li>
          <li>na omezení zpracování,</li>
          <li>na přenositelnost údajů,</li>
          <li>kdykoli odvolat souhlas se zpracováním,</li>
          <li>podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz).</li>
        </ul>
        <p>
          Pro uplatnění kteréhokoli z těchto práv nás kontaktujte na{" "}
          <a href={`mailto:${V.KONTAKT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {V.KONTAKT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
];

export default async function ZpracovaniOsobnichUdajuPage() {
  const news = await getNews();

  return (
    <>
      <Navbar hasNews={news.length > 0} />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image
            src={withBasePath("/images/hero-facade.jpg")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]"
          />
          <div className="absolute inset-0 bg-[#2a1c12]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[32px] font-bold text-white sm:text-[44px]">Zpracování osobních údajů</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              Jaké údaje z kontaktního formuláře zpracováváme a jaká máte práva.
            </p>
          </div>
        </section>

        <section className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[760px]">
            <p className="text-[13px] font-medium text-clay">Poslední aktualizace: 23. 9. 2026</p>

            <div className="mt-10 flex flex-col gap-10">
              {SECTIONS.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-subhead text-[20px] font-bold text-ink sm:text-[22px]">{section.heading}</h2>
                  <div className="mt-3 flex flex-col gap-3 text-[15px] leading-[1.7] text-clay">{section.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
