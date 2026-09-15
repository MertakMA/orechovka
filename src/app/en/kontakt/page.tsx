import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Phone, Globe, Car, SquareParking, TrainFront } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ContactForm from "@/components/kontakt/ContactForm";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — contact details, a form, a map and practical arrival information for Roubenka Ořechovka.",
  alternates: {
    canonical: `${V.SITE_URL}/en/kontakt`,
    languages: { cs: `${V.SITE_URL}/kontakt`, en: `${V.SITE_URL}/en/kontakt` },
  },
  openGraph: { locale: "en_US" },
};

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(V.MAPA_QUERY)}&output=embed`;

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    label: "Address",
    value: `${V.ADRESA_RADEK_1} — ${V.ADRESA_RADEK_2}`,
    href: "#mapa-kontakt",
  },
  {
    Icon: Mail,
    label: "Email",
    value: V.KONTAKT_EMAIL,
    href: `mailto:${V.KONTAKT_EMAIL}`,
  },
  {
    Icon: Phone,
    label: "Phone",
    value: V.KONTAKT_TELEFON,
    href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}`,
  },
  {
    Icon: Globe,
    label: "Booking",
    value: "roubenkaorechovka.booking.com",
    href: V.BOOKING_URL,
    external: true,
  },
];

// Firemní modrá/růžová sociálních sítí do přírodní palety nesedí — držíme
// je v hnědé jako ostatní prvky webu.
const SOCIAL_LINKS = [
  { label: "Facebook", href: V.FACEBOOK_URL },
  { label: "Instagram", href: V.INSTAGRAM_URL },
];

const DIRECTIONS = [
  {
    Icon: Car,
    label: "By car",
    text: `From Prague: D11 motorway, exit at Hradec Králové, then road I/37 towards Trutnov. From Trutnov about ${V.VZDALENOST_TRUTNOV_KM} to Mladé Buky.`,
  },
  {
    Icon: SquareParking,
    label: "Parking",
    text: `Free on-site parking, ${V.POCET_PARKOVACICH_MIST} spaces.`,
  },
  {
    Icon: TrainFront,
    label: "By train",
    text: `Trutnov main railway station (connections from Prague via Hradec Králové), then a bus or taxi about ${V.VZDALENOST_TRUTNOV_KM}.`,
  },
];

export default async function KontaktPageEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image src={withBasePath("/images/hero-facade.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]" />
          <div className="absolute inset-0 bg-[#2a1c12]/50" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">Contact</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              We're happy to answer your questions. Bookings go through Booking.com.
            </p>
          </div>
        </section>

        <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">CONTACT DETAILS</p>
              <div className="mt-2 h-[2px] w-8 bg-pec" />
              <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Get in touch</h2>

              <div className="mt-8 flex flex-col gap-4">
                {CONTACT_CARDS.map(({ Icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-brand"
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
                <p className="text-[13px] font-semibold text-ink">Follow us</p>
                <div className="mt-3 flex gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-brand/40 bg-cream px-5 py-2 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-cream"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">CONTACT FORM</p>
              <div className="mt-2 h-[2px] w-8 bg-pec" />
              <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Write to us</h2>
              <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-clay">
                This form is for enquiries only, not for booking. Please use Booking.com to book.
              </p>

              <div className="mt-8">
                <ContactForm locale="en" />
              </div>
            </div>
          </div>
        </section>

        <section id="mapa-kontakt" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">FIND US</p>
            <div className="mt-2 h-[2px] w-8 bg-pec" />
            <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">Where to find us</h2>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row">
              <div className="h-[300px] w-full overflow-hidden rounded-[10px] border border-border lg:h-auto lg:flex-1">
                <iframe
                  src={MAP_EMBED_SRC}
                  title="Map – Mladé Buky"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="w-full shrink-0 rounded-[10px] border border-border bg-surface p-6 lg:w-[300px]">
                <p className="text-[15px] font-semibold text-ink">Getting here</p>
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

        <CTASection
          title="Book via Booking.com"
          subtitle="Safe and simple booking. No sign-up required, with a best-price guarantee."
          buttonLabel="Go to Booking.com and book →"
        />
      </main>
      <Footer locale="en" />
    </>
  );
}
