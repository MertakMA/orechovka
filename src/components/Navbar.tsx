"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { withBasePath } from "@/lib/basePath";
import { handleHashNavClick } from "@/lib/hashNav";

const MotionLink = motion(Link);

type NavLink = { label: string; href: string; isNews?: boolean };

const BASE_NAV_LINKS: NavLink[] = [
  { label: "O nás", href: "/#o-nas" },
  { label: "Ceník", href: "/cenik" },
  { label: "Galerie", href: "/galerie" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Tipy na výlety", href: "/#tipy" },
  { label: "Počasí", href: "/#pocasi" },
];

const NEWS_LINK: NavLink = { label: "Novinky", href: "/#novinky", isNews: true };

// Zelená podtržená "důležitá" značka pod odkazem Novinky — jemně pulzuje,
// ať si jí je nejdřív všimnout, že je na webu něco nového.
function NavLinkLabel({ link }: { link: NavLink }) {
  if (!link.isNews) return <>{link.label}</>;
  return (
    <span className="relative inline-block">
      {link.label}
      <span
        aria-hidden
        className="animate-nav-badge-pulse absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-brand-gradient"
      />
    </span>
  );
}

export default function Navbar({ hasNews = false }: { hasNews?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Odkaz na Novinky se zobrazí, jen když nějaké skutečně jsou (viz
  // NewsSection — prázdno = sekce na webu vůbec není, takže by odkaz
  // jinak mířil na nic). Zařazený hned za Kontakt.
  const navLinks = hasNews
    ? [...BASE_NAV_LINKS.slice(0, 4), NEWS_LINK, ...BASE_NAV_LINKS.slice(4)]
    : BASE_NAV_LINKS;

  // Otevřené mobilní menu je fixed přes celou obrazovku, ale stránka pod
  // ním by bez tohohle šla dál posouvat scrollem prstu/kolečkem.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 sm:h-24 md:px-10 lg:px-[100px]">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center py-2 pr-4"
          aria-label="Roubenka Ořechovka – domů"
        >
          <Image
            src={withBasePath("/images/logo.svg")}
            alt="Roubenka Ořechovka"
            width={100}
            height={117}
            className="h-20 w-auto sm:h-28"
            priority
          />
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-[45px]">
          {navLinks.map((link) => {
            const isActive =
              link.href !== "/" && link.href.startsWith("/") && !link.href.includes("#") && pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={!link.href.includes("#")}
                onClick={(e) => handleHashNavClick(e, link.href, pathname)}
                className={`whitespace-nowrap text-[16px] transition-colors hover:text-brand ${
                  isActive ? "font-semibold text-brand" : "text-ink"
                }`}
              >
                <NavLinkLabel link={link} />
              </Link>
            );
          })}
        </nav>

        <a
          href="https://www.booking.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded bg-brand px-5 py-[10px] text-[14px] font-semibold text-white transition-colors hover:bg-brand-light lg:inline-block"
        >
          Rezervovat na Bookingu
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Otevřít menu"
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6 sm:h-24">
              <span className="font-serif text-lg font-bold text-ink">Roubenka Ořechovka</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-3xl text-ink"
                aria-label="Zavřít menu"
              >
                ×
              </button>
            </div>
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: {},
              }}
              className="flex flex-col gap-2 px-6 py-4"
            >
              {navLinks.map((link) => (
                <MotionLink
                  key={link.href}
                  href={link.href}
                  prefetch={!link.href.includes("#")}
                  onClick={(e) => {
                    // Zrušit scroll-lock rovnou tady, ne čekat na efekt
                    // navázaný na `open` — jinak by scroll níž mohl
                    // proběhnout dřív, než se stránka vůbec odemkne.
                    document.body.style.overflow = "";
                    setOpen(false);
                    handleHashNavClick(e, link.href, pathname);
                  }}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 12 },
                  }}
                  className="border-b border-border py-4 text-lg text-ink"
                >
                  <NavLinkLabel link={link} />
                </MotionLink>
              ))}
              <a
                href="https://www.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 rounded bg-brand px-8 py-4 text-center text-[16px] font-semibold text-white"
              >
                Rezervovat na Bookingu
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
