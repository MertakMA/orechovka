import { Check, Clock, CloudSun, Video, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SubpageHero from "@/components/SubpageHero";
import PriceCard from "@/components/pricing/PriceCard";
import FAQAccordion from "@/components/pricing/FAQAccordion";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { buildPlans } from "@/lib/ceny";
import { texty, type Locale } from "@/lib/texty";

// Text karty v Notionu: Text = nadpis, Text 2 = "hodnota\ndrobný text".
const PRACTICAL_INFO: { id: string; Icon: LucideIcon; href?: Record<Locale, string> }[] = [
  { id: "prakticke.checkin", Icon: Clock },
  { id: "prakticke.checkout", Icon: Clock },
  { id: "prakticke.pocasi", Icon: CloudSun, href: { cs: "/#pocasi", en: "/en#pocasi" } },
  { id: "prakticke.webkamera", Icon: Video, href: { cs: "/#webkamera", en: "/en#webkamera" } },
];

export default async function CenikPage({ locale }: { locale: Locale }) {
  const news = await getNews();
  const c = texty("cenik", locale);
  const plans = buildPlans(locale);
  const included = c.seznam("v-cene.polozky");
  const fees = c.seznam("poplatky.polozky");
  const practicalInfo = PRACTICAL_INFO.flatMap(({ id, Icon, href }) => {
    const card = c.polozka(id);
    if (!card) return [];
    const [value = "", ...note] = (card.p ?? "").split("\n");
    return [{ id, Icon, label: card.t, value, note: note.join(" "), href: href && withBasePath(href[locale]) }];
  });

  const seasonsEyebrow = c.t("sezony.nadtitulek");
  const seasonsHeading = c.t("sezony.nadpis");
  const seasonsText = c.t("sezony.text");
  const includedHeading = c.t("v-cene.nadpis");
  const feesHeading = c.t("poplatky.nadpis");
  const faqHeading = c.t("faq.nadpis");
  const practicalEyebrow = c.t("prakticke.nadtitulek");
  const practicalHeading = c.t("prakticke.nadpis");

  return (
    <>
      {locale === "en" && <HtmlLangSetter lang="en" />}
      <Navbar hasNews={news.length > 0} locale={locale} />
      <main>
        <SubpageHero title={c.t("hero.nadpis")} subtitle={c.t("hero.podnadpis")} />

        {c.sekce("sezony") && (
          <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
            <div className="mx-auto max-w-[1440px]">
              {seasonsEyebrow && <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{seasonsEyebrow}</p>}
              {seasonsHeading && (
                <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[38px]">{seasonsHeading}</h2>
              )}
              {seasonsText && <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-clay">{seasonsText}</p>}

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8">
                {plans.map((plan) => (
                  <PriceCard key={plan.season} {...plan} />
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sekce("v-cene") && included.length > 0 && (
          <section className="bg-cream px-6 py-14 sm:px-10 lg:px-[100px]">
            <div className="mx-auto max-w-[1440px]">
              {includedHeading && (
                <h2 className="font-subhead text-[24px] font-bold text-ink sm:text-[28px]">{includedHeading}</h2>
              )}
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {included.map((item) => (
                  <div key={item.t} className="flex items-center gap-3">
                    <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                    <span className="text-[14px] text-ink">{item.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sekce("poplatky") && fees.length > 0 && (
          <section className="bg-sand px-6 py-14 sm:px-10 lg:px-[100px]">
            <div className="mx-auto max-w-[1440px]">
              {feesHeading && <h2 className="font-subhead text-[22px] font-bold text-ink">{feesHeading}</h2>}
              <div className="mt-6 divide-y divide-border border-t border-border">
                {fees.map((fee) => (
                  <div key={fee.t} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[15px] font-semibold text-ink">{fee.t}</span>
                    {fee.p && <span className="text-[15px] font-medium text-clay">{fee.p}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sekce("faq") && (
          <section className="bg-cream px-6 py-16 sm:px-10 lg:px-[100px]">
            <div className="mx-auto max-w-[1440px]">
              {faqHeading && <h2 className="font-subhead text-[24px] font-bold text-ink sm:text-[28px]">{faqHeading}</h2>}
              <div className="mt-8">
                <FAQAccordion locale={locale} />
              </div>
            </div>
          </section>
        )}

        {c.sekce("prakticke") && (
          <section className="bg-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
            <div className="mx-auto max-w-[1440px]">
              {practicalEyebrow && (
                <>
                  <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{practicalEyebrow}</p>
                  <div className="mt-2 h-[2px] w-8 bg-pec" />
                </>
              )}
              {practicalHeading && (
                <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">{practicalHeading}</h2>
              )}

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {practicalInfo.map(({ id, Icon, label, value, note, href }) => {
                  const cardClassName = "flex flex-col gap-2 rounded-lg bg-cream p-5 transition-colors hover:bg-tag/40";
                  const content = (
                    <>
                      <Icon className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
                      <p className="text-[13px] font-semibold text-ink">{label}</p>
                      <p className="text-[14px] text-clay">
                        {value}
                        {note && (
                          <>
                            <br />
                            <span className="text-[13px]">{note}</span>
                          </>
                        )}
                      </p>
                    </>
                  );
                  return href ? (
                    <a key={id} href={href} className={cardClassName}>
                      {content}
                    </a>
                  ) : (
                    <div key={id} className={cardClassName}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {c.sekce("cta") && (
          <CTASection title={c.t("cta.nadpis")} subtitle={c.t("cta.podnadpis")} buttonLabel={c.t("cta.tlacitko")} />
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
