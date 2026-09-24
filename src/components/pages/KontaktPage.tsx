import { MapPin, Mail, Phone, Globe, Car, SquareParking, TrainFront, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SubpageHero from "@/components/SubpageHero";
import ContactForm from "@/components/kontakt/ContactForm";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { getNews } from "@/lib/notion";
import { MAP_EMBED_SRC } from "@/lib/mapa";
import { texty, type Locale } from "@/lib/texty";
import { V } from "@/generated/variables";

const CONTACT_CARDS: { id: string; Icon: LucideIcon; href: string; external?: boolean }[] = [
  { id: "karta.adresa", Icon: MapPin, href: "#mapa-kontakt" },
  { id: "karta.email", Icon: Mail, href: `mailto:${V.KONTAKT_EMAIL}` },
  { id: "karta.telefon", Icon: Phone, href: `tel:${V.KONTAKT_TELEFON.replace(/\s+/g, "")}` },
  { id: "karta.booking", Icon: Globe, href: V.BOOKING_URL, external: true },
];

// Firemní modrá/růžová sociálních sítí do přírodní palety nesedí — držíme
// je v hnědé jako ostatní prvky webu.
const SOCIAL_LINKS = [
  { id: "social.facebook", href: V.FACEBOOK_URL },
  { id: "social.instagram", href: V.INSTAGRAM_URL },
];

const DIRECTIONS: { id: string; Icon: LucideIcon }[] = [
  { id: "smer.auto", Icon: Car },
  { id: "smer.parkovani", Icon: SquareParking },
  { id: "smer.vlak", Icon: TrainFront },
];

export default async function KontaktPage({ locale }: { locale: Locale }) {
  const news = await getNews();
  const k = texty("kontakt", locale);
  const s = texty("spolecne", locale);

  const cards = CONTACT_CARDS.flatMap((card) => {
    const text = k.polozka(card.id);
    return text ? [{ ...card, label: text.t, value: text.p ?? "" }] : [];
  });
  const socialLinks = SOCIAL_LINKS.flatMap((link) => {
    const label = s.t(link.id);
    return label ? [{ label, href: link.href }] : [];
  });
  const directions = DIRECTIONS.flatMap(({ id, Icon }) => {
    const text = k.polozka(id);
    return text ? [{ id, Icon, label: text.t, text: text.p ?? "" }] : [];
  });

  const detailsEyebrow = k.t("udaje.nadtitulek");
  const detailsHeading = k.t("udaje.nadpis");
  const followHeading = s.t("sledujte-nas");
  const formEyebrow = k.t("formular.nadtitulek");
  const formHeading = k.t("formular.nadpis");
  const formNote = k.t("formular.poznamka");
  const mapEyebrow = k.t("mapa.nadtitulek");
  const mapHeading = k.t("mapa.nadpis");
  const directionsHeading = k.t("mapa.jak-se-dostat");

  return (
    <>
      {locale === "en" && <HtmlLangSetter lang="en" />}
      <Navbar hasNews={news.length > 0} locale={locale} />
      <main>
        <SubpageHero title={k.t("hero.nadpis")} subtitle={k.t("hero.podnadpis")} overlayClassName="bg-[#2a1c12]/50" />

        {(k.sekce("udaje") || k.sekce("formular")) && (
          <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
              {k.sekce("udaje") && (
                <div>
                  {detailsEyebrow && (
                    <>
                      <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{detailsEyebrow}</p>
                      <div className="mt-2 h-[2px] w-8 bg-pec" />
                    </>
                  )}
                  {detailsHeading && (
                    <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">{detailsHeading}</h2>
                  )}

                  <div className="mt-8 flex flex-col gap-4">
                    {cards.map(({ id, Icon, label, value, href, external }) => (
                      <a
                        key={id}
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

                  {followHeading && socialLinks.length > 0 && (
                    <div className="mt-8">
                      <p className="text-[13px] font-semibold text-ink">{followHeading}</p>
                      <div className="mt-3 flex gap-3">
                        {socialLinks.map((link) => (
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
                  )}
                </div>
              )}

              {k.sekce("formular") && (
                <div>
                  {formEyebrow && (
                    <>
                      <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{formEyebrow}</p>
                      <div className="mt-2 h-[2px] w-8 bg-pec" />
                    </>
                  )}
                  {formHeading && <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">{formHeading}</h2>}
                  {formNote && <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-clay">{formNote}</p>}

                  <div className="mt-8">
                    <ContactForm locale={locale} />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {k.sekce("mapa") && (
          <section id="mapa-kontakt" className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
            <div className="mx-auto max-w-[1440px]">
              {mapEyebrow && (
                <>
                  <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{mapEyebrow}</p>
                  <div className="mt-2 h-[2px] w-8 bg-pec" />
                </>
              )}
              {mapHeading && <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">{mapHeading}</h2>}

              <div className="mt-8 flex flex-col gap-6 lg:flex-row">
                <div className="h-[300px] w-full overflow-hidden rounded-[10px] border border-border lg:h-auto lg:flex-1">
                  <iframe
                    src={MAP_EMBED_SRC}
                    title={s.vzdy("mapa.titulek")}
                    className="size-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {directionsHeading && (
                  <div className="w-full shrink-0 rounded-[10px] border border-border bg-surface p-6 lg:w-[300px]">
                    <p className="text-[15px] font-semibold text-ink">{directionsHeading}</p>
                    <div className="mt-4 flex flex-col gap-4">
                      {directions.map(({ id, Icon, label, text }) => (
                        <div key={id} className="flex gap-3">
                          <Icon className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
                          <p className="text-[13px] leading-[1.6] text-clay">
                            <span className="font-semibold text-ink">{label}: </span>
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {k.sekce("cta") && (
          <CTASection title={k.t("cta.nadpis")} subtitle={k.t("cta.podnadpis")} buttonLabel={k.t("cta.tlacitko")} />
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
