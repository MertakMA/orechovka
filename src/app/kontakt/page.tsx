import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, Globe, Clock, CloudSun, Video, Car, SquareParking, TrainFront } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ContactForm from "@/components/kontakt/ContactForm";
import { withBasePath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Spojte se s námi — kontaktní údaje, formulář, mapa a praktické informace k příjezdu do Roubenky Ořechovka.",
};

// TODO: nahradit přesnou adresou/pinem od klienta (aktuálně obecná poloha Mladé Buky, u kostela).
const MAP_QUERY = "Mladé Buky, kostel svaté Kateřiny Alexandrijské";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    label: "Adresa",
    value: "Mladé Buky, u kostela — 542 23, okres Trutnov",
    href: "#mapa-kontakt",
  },
  {
    Icon: Mail,
    label: "E-mail",
    value: "info@roubenkaorechovka.cz",
    href: "mailto:info@roubenkaorechovka.cz",
  },
  {
    // TODO: doplnit skutečné telefonní číslo.
    Icon: Phone,
    label: "Telefon",
    value: "+420 XXX XXX XXX",
    href: "tel:+420XXXXXXXXX",
  },
  {
    Icon: Globe,
    label: "Booking",
    value: "roubenkaorechovka.booking.com",
    href: "https://www.booking.com",
    external: true,
  },
];

// TODO: doplnit skutečné odkazy na sociální sítě.
const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", className: "bg-[#1877F2] hover:bg-[#1467d8]" },
  {
    label: "Instagram",
    href: "#",
    className: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
  },
];

const PRACTICAL_INFO = [
  { Icon: Clock, label: "Check-in", value: "od 15:00", note: "Po dohodě jinak" },
  { Icon: Clock, label: "Check-out", value: "do 10:00", note: "Po dohodě jinak" },
  { Icon: CloudSun, label: "Počasí", value: "Aktuální předpověď", note: "Mladé Buky a okolí", href: "/#pocasi" },
  { Icon: Video, label: "Webkamera", value: "Živý záběr z okolí", note: "Ski areál Mladé Buky", href: "/#pocasi" },
];

const DIRECTIONS = [
  {
    Icon: Car,
    label: "Autem",
    text: "Z Prahy: dálnice D11, sjezd Hradec Králové, dále silnice I/37 směr Trutnov. Z Trutnova cca 5 km do Mladých Buků.",
  },
  {
    Icon: SquareParking,
    label: "Parkování",
    text: "Zdarma na pozemku, 2 parkovací místa.",
  },
  {
    Icon: TrainFront,
    label: "Vlakem",
    text: "Vlaková stanice Trutnov hlavní nádraží (spoje z Prahy přes Hradec Králové), odtud MHD nebo taxi cca 5 km.",
  },
];

export default function KontaktPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-[#1a241f]/50" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Kontakt</h1>
            <p className="max-w-xl text-[15px] text-[#d9ebe3] sm:text-[17px]">
              Rádi vám odpovíme na dotazy. Rezervace probíhají přes Booking.com.
            </p>
          </div>
        </section>

        <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-[13px] font-semibold tracking-[2px] text-brand">KONTAKTNÍ ÚDAJE</p>
              <div className="mt-2 h-[2px] w-8 bg-brand" />
              <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Spojte se s námi</h2>

              <div className="mt-8 flex flex-col gap-4">
                {CONTACT_CARDS.map(({ Icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 rounded-lg border border-border bg-white p-5 transition-colors hover:border-brand"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-brand">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{label}</span>
                      <span className="mt-0.5 block text-[14px] text-clay">{value}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-[13px] font-semibold text-ink">Sledujte nás</p>
                <div className="mt-3 flex gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-colors ${link.className}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-semibold tracking-[2px] text-brand">KONTAKTNÍ FORMULÁŘ</p>
              <div className="mt-2 h-[2px] w-8 bg-brand" />
              <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Napište nám</h2>
              <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-clay">
                Formulář slouží pouze ke kontaktu, ne k rezervaci. Pro rezervaci použijte prosím Booking.com.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section id="mapa-kontakt" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-brand">JAK NÁS NAJDETE</p>
            <div className="mt-2 h-[2px] w-8 bg-brand" />
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Kde nás najdete</h2>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row">
              <div className="h-[300px] w-full overflow-hidden rounded-[10px] border border-border lg:h-auto lg:flex-1">
                <iframe
                  src={MAP_EMBED_SRC}
                  title="Mapa – Mladé Buky"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="w-full shrink-0 rounded-[10px] border border-border bg-white p-6 lg:w-[300px]">
                <p className="text-[15px] font-semibold text-ink">Jak se dostat</p>
                <div className="mt-4 flex flex-col gap-4">
                  {DIRECTIONS.map(({ Icon, label, text }) => (
                    <div key={label} className="flex gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
                      <p className="text-[13px] leading-[1.6] text-clay">
                        <span className="font-semibold text-ink">{label}: </span>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-brand">PRAKTICKÉ INFORMACE K PŘÍJEZDU</p>
            <div className="mt-2 h-[2px] w-8 bg-brand" />
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Co vědět před příjezdem</h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRACTICAL_INFO.map(({ Icon, label, value, note, href }) => {
                const cardClassName =
                  "flex flex-col gap-2 rounded-lg bg-cream p-5 transition-colors hover:bg-tag/40";
                const content = (
                  <>
                    <Icon className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
                    <p className="text-[13px] font-semibold text-ink">{label}</p>
                    <p className="text-[14px] text-clay">
                      {value}
                      <br />
                      <span className="text-[12px]">{note}</span>
                    </p>
                  </>
                );
                return href ? (
                  <Link key={label} href={href} className={cardClassName}>
                    {content}
                  </Link>
                ) : (
                  <div key={label} className={cardClassName}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTASection
          title="Rezervujte přes Booking.com"
          subtitle="Bezpečná a jednoduchá rezervace. Bez registrace, s garancí nejlepší ceny."
          buttonLabel="Přejít na Booking.com a rezervovat →"
        />
      </main>
      <Footer />
    </>
  );
}
