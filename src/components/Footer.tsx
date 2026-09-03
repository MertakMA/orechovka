import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";

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
      { label: "Booking.com", href: "https://www.booking.com" },
    ],
  },
];

// TODO: doplnit skutečné telefonní číslo.
const CONTACT_LINES = [
  { label: "info@roubenkaorechovka.cz", href: "mailto:info@roubenkaorechovka.cz" },
  { label: "+420 XXX XXX XXX", href: "tel:+420XXXXXXXXX" },
  { label: "Mladé Buky, okres Trutnov", href: "/kontakt#mapa-kontakt" },
];

// TODO: doplnit skutečné odkazy na sociální sítě.
const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Footer() {
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
            <p className="text-[13px] leading-[1.6] text-[#a6bfb2]">
              Útulná roubenka pro vaši dovolenou v krásné přírodě.
            </p>
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
          © 2026 Roubenka Ořechovka · roubenkaorechovka.cz · Všechna práva vyhrazena
        </p>
      </div>
    </footer>
  );
}
