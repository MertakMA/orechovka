"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { V } from "@/generated/variables";
import { availabilityCalendarUrl, E_CHALUPY_CALENDAR_ORIGIN } from "@/lib/rezervace";
import { texty, type Locale } from "@/lib/texty";

// Barvy jako v kalendáři (parametry volnoPozadi / obsazenoPozadi v rezervace.ts).
// Den příjezdu a odjezdu e-chalupy kreslí šikmo půl volný, půl obsazený.
const VOLNO = "#fffdf9";
const OBSAZENO = "#68452b";

// Popisky štítků jsou v Notionu (Společné, kalendar.legenda.*), barvy dává kalendář.
const LEGENDA: { id: string; background: string }[] = [
  { id: "kalendar.legenda.volno", background: VOLNO },
  { id: "kalendar.legenda.obsazeno", background: OBSAZENO },
  { id: "kalendar.legenda.prijezd", background: `linear-gradient(135deg, ${VOLNO} 50%, ${OBSAZENO} 50%)` },
  { id: "kalendar.legenda.odjezd", background: `linear-gradient(135deg, ${OBSAZENO} 50%, ${VOLNO} 50%)` },
];

// joinPrevious = sekce navazuje na ceník nad sebou (stejné krémové pozadí),
// takže nepotřebuje vlastní horní odsazení — jinak by mezi nimi zůstala dvojitá mezera.
export default function AvailabilityCalendar({
  locale = "cs",
  joinPrevious = false,
}: {
  locale?: Locale;
  joinPrevious?: boolean;
}) {
  const s = texty("spolecne", locale);
  const eyebrow = s.t("kalendar.nadtitulek");
  const heading = s.t("kalendar.nadpis");
  const description = s.t("kalendar.popis");
  const link = s.t("kalendar.odkaz");
  const legend = LEGENDA.flatMap(({ id, background }) => {
    const label = s.t(id);
    return label ? [{ label, background }] : [];
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [calendarUrl, setCalendarUrl] = useState(() =>
    availabilityCalendarUrl(locale, new URL("/e-chalupy-calendar.css", V.SITE_URL).toString())
  );

  useEffect(() => {
    const stylesheetUrl = new URL("/e-chalupy-calendar.css", window.location.origin).toString();
    setCalendarUrl(availabilityCalendarUrl(locale, stylesheetUrl));
  }, [locale]);

  // Kalendář po načtení a při změně šířky posílá výšku svého obsahu — iframe
  // se jí přizpůsobí. Pevné výšky v className platí jen do první zprávy.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== E_CHALUPY_CALENDAR_ORIGIN || event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { msg?: unknown; height?: unknown } | null;
      if (data?.msg !== "echalupy-calendar-height" || typeof data.height !== "number" || data.height <= 0) return;
      // Pár px navíc, ať zaokrouhlená výška neusekne spodní okraj posledních měsíců.
      setHeight(Math.ceil(data.height) + 4);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Drobná změna výšky vyvolá v kalendáři resize a ten pošle výšku znovu.
  // Děláme to po načtení a při každém doscrollování ke kalendáři — písmo se
  // může načíst až po první zprávě a změnit šířku měsíců.
  const remeasure = useCallback(() => setHeight((h) => (h ?? iframeRef.current?.offsetHeight ?? 0) + 1), []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) remeasure();
    });
    observer.observe(iframe);
    return () => observer.disconnect();
  }, [remeasure]);

  if (!s.sekce("kalendar")) return null;

  return (
    <section
      id="obsazenost"
      className={`scroll-mt-24 bg-cream px-6 pb-16 sm:px-10 sm:pb-20 lg:px-[100px] lg:pb-24 ${
        joinPrevious ? "pt-0" : "pt-16 sm:pt-20 lg:pt-24"
      }`}
    >
      <div className="mx-auto max-w-[1440px]">
        {eyebrow && (
          <>
            <p className="text-[13px] font-semibold tracking-[2px] text-pec-dark">{eyebrow}</p>
            <div className="mt-2 h-[2px] w-8 bg-pec" />
          </>
        )}
        {heading && <h2 className="mt-3 font-serif text-[30px] font-bold text-ink sm:text-[34px]">{heading}</h2>}
        {description && <p className="mt-3 text-[15px] leading-[1.6] text-clay">{description}</p>}

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-sm sm:p-4">
          <iframe
            ref={iframeRef}
            src={calendarUrl}
            title={s.vzdy("kalendar.nadpis")}
            className="h-[1215px] w-full border-0 sm:h-[805px] lg:h-[615px] xl:h-[420px]"
            style={height ? { height } : undefined}
            // Vnitřní posuvník by kalendáři ubral šířku a měsíce by se přeskládaly
            // do méně sloupců (a poslaly by tu vyšší výšku) — výška se ladí podle
            // obsahu, takže rolovat uvnitř není potřeba.
            scrolling="no"
            onLoad={remeasure}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <ul className="flex flex-wrap gap-2">
            {legend.map(({ label, background }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-clay"
              >
                <span aria-hidden className="h-[18px] w-[18px] rounded-[5px] border border-border" style={{ background }} />
                {label}
              </li>
            ))}
          </ul>

          {link && (
            <a
              href={V.E_CHALUPY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-brand hover:underline"
            >
              {link}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
