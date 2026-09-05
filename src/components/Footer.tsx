"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/basePath";
import { handleHashNavClick } from "@/lib/hashNav";
import { V } from "@/generated/variables";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
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
];

const CONTACT_LINES = [
  { label: V.KONTAKT_EMAIL, href: `mailto:${V.KONTAKT_EMAIL}` },
  { label: V.KONTAKT_TELEFON, href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}` },
  { label: "Mladé Buky, okres Trutnov", href: "/kontakt#mapa-kontakt" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: V.FACEBOOK_URL },
  { label: "Instagram", href: V.INSTAGRAM_URL },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-[#242e29]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 sm:py-16 lg:px-[100px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex max-w-[280px] flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={withBasePath("/images/logo.svg")}
                alt=""
                width={40}
                height={47}
                className="h-10 w-auto rounded-full bg-white/90 p-0.5"
              />
              <p className="text-[14px] font-semibold text-[#e0ede5]">Roubenka Ořechovka</p>
            </div>
            <a href="https://roubenkaorechovka.cz" className="text-[13px] text-[#82a396] hover:underline">
              roubenkaorechovka.cz
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-12">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold text-[#e0ede5]">{col.heading}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-[#8ca69e] transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          prefetch={!link.href.includes("#")}
                          onClick={(e) => handleHashNavClick(e, link.href, pathname)}
                          className="text-[13px] text-[#8ca69e] transition-colors hover:text-white"
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
              <p className="text-[13px] font-semibold text-[#e0ede5]">Kontakt</p>
              <ul className="flex flex-col gap-2">
                {CONTACT_LINES.map((line) =>
                  line.href.startsWith("/") ? (
                    <li key={line.label}>
                      <Link
                        href={line.href}
                        prefetch={!line.href.includes("#")}
                        onClick={(e) => handleHashNavClick(e, line.href, pathname)}
                        className="text-[13px] text-[#8ca69e] transition-colors hover:text-white"
                      >
                        {line.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={line.label}>
                      <a
                        href={line.href}
                        className="text-[13px] text-[#8ca69e] transition-colors hover:text-white"
                      >
                        {line.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-[#e0ede5]">Sledujte nás</p>
              <ul className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[#8ca69e] transition-colors hover:text-white"
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

      <div className="border-t border-[#40594d]">
        <p className="mx-auto max-w-[1440px] px-6 py-5 text-[12px] text-[#738c80] sm:px-10 lg:px-[100px]">
          © {new Date().getFullYear()} Roubenka Ořechovka · roubenkaorechovka.cz · Všechna práva vyhrazena
        </p>
      </div>
    </footer>
  );
}
