"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { withBasePath } from "@/lib/basePath";
import { handleHashNavClick } from "@/lib/hashNav";
import { V } from "@/generated/variables";

const MotionLink = motion(Link);

type Locale = "cs" | "en";
type NavLink = { label: string; href: string; isNews?: boolean };

const BASE_NAV_LINKS: Record<Locale, NavLink[]> = {
  cs: [
    { label: "O roubence", href: "/#vyhody" },
    { label: "Galerie", href: "/galerie" },
    { label: "Ceník", href: "/cenik" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Tipy na výlety", href: "/vylety" },
  ],
  en: [
    { label: "About", href: "/en#vyhody" },
    { label: "Gallery", href: "/en/galerie" },
    { label: "Rates", href: "/en/cenik" },
    { label: "Contact", href: "/en/kontakt" },
    { label: "Trip ideas", href: "/en/vylety" },
  ],
};

const NEWS_LINK: Record<Locale, NavLink> = {
  cs: { label: "Novinky", href: "/#novinky", isNews: true },
  en: { label: "News", href: "/en#novinky", isNews: true },
};

const SOCIAL_LINKS = [
  { label: "Facebook", href: V.FACEBOOK_URL, icon: "/images/icons/facebook.svg" },
  { label: "Instagram", href: V.INSTAGRAM_URL, icon: "/images/icons/instagram.svg" },
];

const TEXT: Record<
  Locale,
  { home: string; openMenu: string; closeMenu: string; book: string; switchTo: string; switchLabel: string }
> = {
  cs: {
    home: "Roubenka Ořechovka – domů",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
    book: "Rezervovat na Bookingu",
    switchTo: "EN",
    switchLabel: "Switch to English",
  },
  en: {
    home: "Roubenka Ořechovka – home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    book: "Book on Booking.com",
    switchTo: "CS",
    switchLabel: "Přepnout do češtiny",
  },
};

// Odvodí odpovídající cestu ve druhém jazyce podle prefixu /en — funguje
// obecně pro libovolnou cestu, ne jen pro pevně vyjmenované stránky.
function otherLocalePath(pathname: string | null): string {
  if (!pathname) return "/";
  if (pathname.startsWith("/en")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest;
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

// Tyrkysová podtržená "důležitá" značka pod odkazem Novinky — jemně pulzuje,
// ať si jí je nejdřív všimnout, že je na webu něco nového.
function NavLinkLabel({ link }: { link: NavLink }) {
  if (!link.isNews) return <>{link.label}</>;
  return (
    <span className="relative inline-block">
      {link.label}
      <span
        aria-hidden
        className="animate-nav-badge-pulse absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-pec"
      />
    </span>
  );
}

export default function Navbar({ hasNews = false, locale = "cs" }: { hasNews?: boolean; locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = TEXT[locale];

  // Odkaz na Novinky se zobrazí, jen když nějaké skutečně jsou (viz
  // NewsSection — prázdno = sekce na webu vůbec není, takže by odkaz
  // jinak mířil na nic). Zařazený hned za Kontakt.
  const baseLinks = BASE_NAV_LINKS[locale];
  const navLinks = hasNews ? [...baseLinks.slice(0, 4), NEWS_LINK[locale], ...baseLinks.slice(4)] : baseLinks;
  const switchHref = otherLocalePath(pathname);

  // Otevřené mobilní menu je fixed přes celou obrazovku, ale stránka pod
  // ním by bez tohohle šla dál posouvat scrollem prstu/kolečkem.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 sm:h-24 md:px-10 lg:px-[100px]">
        {/* Logo má v SVG ořezané prázdné okraje, takže kresba sahá až na hranu
            rámečku. Výška se bere z navbaru (h-full), ne naopak — logo tedy
            vyplní celý pruh, ale nikdy mu nezmění rozměry. */}
        <Link
          href={locale === "cs" ? "/" : "/en"}
          className="relative z-10 flex h-full shrink-0 items-center pr-4"
          aria-label={t.home}
        >
          <Image
            src={withBasePath("/images/logo.svg")}
            alt="Roubenka Ořechovka"
            width={795}
            height={742}
            className="h-[82%] w-auto"
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
                className={`whitespace-nowrap text-[16px] font-medium transition-colors hover:text-pec-dark ${
                  isActive ? "font-semibold text-pec-dark" : "text-ink"
                }`}
              >
                <NavLinkLabel link={link} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={switchHref}
            aria-label={t.switchLabel}
            className="rounded border border-border px-2.5 py-1 text-[12px] font-semibold text-clay transition-colors hover:border-pec-dark hover:text-pec-dark"
          >
            {t.switchTo}
          </Link>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <Image src={withBasePath(link.icon)} alt="" width={20} height={20} className="size-5" />
            </a>
          ))}
          <a
            href={V.BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-brand px-5 py-[10px] text-[14px] font-semibold text-cream transition-colors hover:bg-brand-dark"
          >
            {t.book}
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href={switchHref}
            aria-label={t.switchLabel}
            className="rounded border border-border px-2.5 py-1 text-[12px] font-semibold text-clay"
          >
            {t.switchTo}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label={t.openMenu}
          >
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream lg:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6 sm:h-24">
              <span className="font-subhead text-lg font-bold text-ink">Roubenka Ořechovka</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-3xl text-ink"
                aria-label={t.closeMenu}
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
                href={V.BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 rounded bg-brand px-8 py-4 text-center text-[16px] font-semibold text-cream"
              >
                {t.book}
              </a>

              <div className="mt-4 flex items-center justify-center gap-6">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="opacity-80 transition-opacity hover:opacity-100"
                  >
                    <Image src={withBasePath(link.icon)} alt="" width={24} height={24} className="size-6" />
                  </a>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
