"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/basePath";
import { handleHashNavClick } from "@/lib/hashNav";
import { V } from "@/generated/variables";
import { texty, type Locale } from "@/lib/texty";

type LinkDef = { id: string; href: Record<Locale, string> };

const COLUMNS: { headingId: string; links: LinkDef[] }[] = [
  {
    headingId: "paticka.stranky",
    links: [
      { id: "menu.o-roubence", href: { cs: "/#vyhody", en: "/en#vyhody" } },
      { id: "menu.galerie", href: { cs: "/galerie", en: "/en/galerie" } },
      { id: "menu.cenik", href: { cs: "/cenik", en: "/en/cenik" } },
      { id: "menu.kontakt", href: { cs: "/kontakt", en: "/en/kontakt" } },
    ],
  },
  {
    headingId: "paticka.informace",
    links: [
      { id: "menu.pocasi", href: { cs: "/#pocasi", en: "/en#pocasi" } },
      { id: "menu.webkamera", href: { cs: "/#pocasi", en: "/en#pocasi" } },
      { id: "menu.booking", href: { cs: V.BOOKING_URL, en: V.BOOKING_URL } },
      { id: "menu.osobni-udaje", href: { cs: "/zpracovani-osobnich-udaju", en: "/en/zpracovani-osobnich-udaju" } },
    ],
  },
];

const SOCIAL_LINKS = [
  { id: "social.facebook", href: V.FACEBOOK_URL },
  { id: "social.instagram", href: V.INSTAGRAM_URL },
];

type Line = { label: string; href: string };

export default function Footer({ locale = "cs" }: { locale?: Locale }) {
  const pathname = usePathname();
  const s = texty("spolecne", locale);
  const withLabel = (link: LinkDef): Line[] => {
    const label = s.t(link.id);
    return label ? [{ label, href: link.href[locale] }] : [];
  };

  const columns = COLUMNS.flatMap((col) => {
    const heading = s.t(col.headingId);
    return heading ? [{ heading, links: col.links.flatMap(withLabel) }] : [];
  });
  const address = s.t("paticka.adresa");
  const contactLines: Line[] = [
    { label: V.KONTAKT_EMAIL, href: `mailto:${V.KONTAKT_EMAIL}` },
    { label: V.KONTAKT_TELEFON, href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}` },
    ...(address ? [{ label: address, href: locale === "cs" ? "/kontakt#mapa-kontakt" : "/en/kontakt#mapa-kontakt" }] : []),
  ];
  const socialLinks = SOCIAL_LINKS.flatMap((link) => {
    const label = s.t(link.id);
    return label ? [{ label, href: link.href }] : [];
  });
  const siteName = s.t("NAZEV_WEBU");
  const webLabel = s.t("paticka.web");
  const contactHeading = s.t("paticka.kontakt");
  const followHeading = s.t("sledujte-nas");
  const rights = s.t("paticka.prava");

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
              {siteName && (
                <p className="whitespace-nowrap font-subhead text-[16px] font-bold text-espresso">{siteName}</p>
              )}
            </div>
            {webLabel && (
              <a href={V.SITE_URL} className="text-[14px] font-bold text-pec-dark hover:underline">
                {webLabel}
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-12">
            {columns.map((col) => (
              <div key={col.heading} className="flex min-w-0 flex-col gap-3">
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

            {contactHeading && (
            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-[13px] font-bold uppercase tracking-[1.2px] text-espresso">{contactHeading}</p>
              <ul className="flex flex-col gap-2">
                {contactLines.map((line) =>
                  line.href.startsWith("/") ? (
                    <li key={line.label}>
                      <Link
                        href={line.href}
                        prefetch={!line.href.includes("#")}
                        onClick={(e) => handleHashNavClick(e, line.href, pathname)}
                        className="break-words text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                      >
                        {line.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={line.label}>
                      <a
                        href={line.href}
                        className="break-words text-[15px] font-semibold text-espresso transition-colors hover:text-pec-dark"
                      >
                        {line.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            )}

            {followHeading && socialLinks.length > 0 && (
              <div className="flex min-w-0 flex-col gap-3">
                <p className="text-[13px] font-bold uppercase tracking-[1.2px] text-espresso">{followHeading}</p>
                <ul className="flex flex-col gap-2">
                  {socialLinks.map((link) => (
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
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#cbb99c]">
        <p className="mx-auto max-w-[1440px] px-6 py-5 text-[13px] font-semibold text-espresso sm:px-10 lg:px-[100px]">
          {[`© ${new Date().getFullYear()}${siteName ? ` ${siteName}` : ""}`, webLabel, rights].filter(Boolean).join(" · ")}
        </p>
      </div>
    </footer>
  );
}
