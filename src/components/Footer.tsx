"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/basePath";
import { handleHashNavClick } from "@/lib/hashNav";
import { V } from "@/generated/variables";

type Locale = "cs" | "en";

const COLUMNS: Record<Locale, { heading: string; links: { label: string; href: string }[] }[]> = {
  cs: [
    {
      heading: "Stránky",
      links: [
        { label: "O nás", href: "/#o-nas" },
        { label: "Galerie", href: "/galerie" },
        { label: "Ceník", href: "/cenik" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
    {
      heading: "Informace",
      links: [
        { label: "Počasí", href: "/#pocasi" },
        { label: "Webkamera", href: "/#pocasi" },
        { label: "Booking.com", href: V.BOOKING_URL },
      ],
    },
  ],
  en: [
    {
      heading: "Pages",
      links: [
        { label: "About", href: "/en#o-nas" },
        { label: "Gallery", href: "/en/galerie" },
        { label: "Rates", href: "/en/cenik" },
        { label: "Contact", href: "/en/kontakt" },
      ],
    },
    {
      heading: "Information",
      links: [
        { label: "Weather", href: "/en#pocasi" },
        { label: "Webcam", href: "/en#pocasi" },
        { label: "Booking.com", href: V.BOOKING_URL },
      ],
    },
  ],
};

const CONTACT_LINES: Record<Locale, { label: string; href: string }[]> = {
  cs: [
    { label: V.KONTAKT_EMAIL, href: `mailto:${V.KONTAKT_EMAIL}` },
    { label: V.KONTAKT_TELEFON, href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}` },
    { label: "Mladé Buky, okres Trutnov", href: "/kontakt#mapa-kontakt" },
  ],
  en: [
    { label: V.KONTAKT_EMAIL, href: `mailto:${V.KONTAKT_EMAIL}` },
    { label: V.KONTAKT_TELEFON, href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}` },
    { label: "Mladé Buky, Trutnov district", href: "/en/kontakt#mapa-kontakt" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Facebook", href: V.FACEBOOK_URL },
  { label: "Instagram", href: V.INSTAGRAM_URL },
];

const TEXT: Record<Locale, { contact: string; follow: string; rights: string }> = {
  cs: { contact: "Kontakt", follow: "Sledujte nás", rights: "Všechna práva vyhrazena" },
  en: { contact: "Contact", follow: "Follow us", rights: "All rights reserved" },
};

export default function Footer({ locale = "cs" }: { locale?: Locale }) {
  const pathname = usePathname();
  const columns = COLUMNS[locale];
  const contactLines = CONTACT_LINES[locale];
  const t = TEXT[locale];

  return (
    // Patička se o pixel či dva přesune přes spodní okraj sekce nad sebou
    // (obvykle CTASection s vlnkami). Přední hřeben vln je vykreslený jako
    // SVG cesta a při zaokrouhlení na fyzické pixely (typicky při zoomu na
    // 125 %/150 %, běžném na Windows) se o zlomek pixelu neshoduje s koncem
    // své sekce — bez přesahu by tou skulinou na vlásek prosvítalo tmavé
    // pozadí CTA sekce. Patička je stejně písková jako přední hřeben, takže
    // přesah nikde není vidět, jen spolehlivě zakryje případnou mezeru.
    <footer className="relative -mt-1 bg-sand">
      <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 sm:py-16 lg:px-[100px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex max-w-[280px] flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={withBasePath("/images/logo.svg")}
                alt=""
                width={795}
                height={742}
                className="h-12 w-auto"
              />
              <p className="whitespace-nowrap font-subhead text-[16px] font-bold text-espresso">Roubenka Ořechovka</p>
            </div>
            <a href="https://roubenkaorechovka.cz" className="text-[14px] font-bold text-pec-dark hover:underline">
              roubenkaorechovka.cz
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-12">
            {columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-[13px] font-bold uppercase tracking-[1.2px] text-espresso">{col.heading}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          prefetch={!link.href.includes("#")}
                          onClick={(e) => handleHashNavClick(e, link.href, pathname)}
                          className="text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-bold uppercase tracking-[1.2px] text-espresso">{t.contact}</p>
              <ul className="flex flex-col gap-2">
                {contactLines.map((line) =>
                  line.href.startsWith("/") ? (
                    <li key={line.label}>
                      <Link
                        href={line.href}
                        prefetch={!line.href.includes("#")}
                        onClick={(e) => handleHashNavClick(e, line.href, pathname)}
                        className="text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                      >
                        {line.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={line.label}>
                      <a
                        href={line.href}
                        className="text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                      >
                        {line.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-bold uppercase tracking-[1.2px] text-espresso">{t.follow}</p>
              <ul className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#cbb99c]">
        <p className="mx-auto max-w-[1440px] px-6 py-5 text-[13px] font-semibold text-espresso sm:px-10 lg:px-[100px]">
          © {new Date().getFullYear()} Roubenka Ořechovka · roubenkaorechovka.cz · {t.rights}
        </p>
      </div>
    </footer>
  );
}
