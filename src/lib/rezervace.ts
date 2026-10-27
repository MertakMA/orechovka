import type { Locale } from "@/lib/texty";

export const E_CHALUPY_URL =
  "https://www.e-chalupy.cz/ubytovani-mlade-buky-roubenka-orechovka-chalupa-pronajem-o24056";

export const E_CHALUPY_CALENDAR_ORIGIN = "https://obsazenost.e-chalupy.cz";

export const RESERVATION_LABEL: Record<Locale, string> = {
  cs: "Rezervovat pobyt",
  en: "Book your stay",
};

export function reservationHref(locale: Locale): string {
  return locale === "cs" ? "/kontakt#formular" : "/en/kontakt#formular";
}

export function availabilityCalendarUrl(locale: Locale, stylesheetUrl?: string): string {
  const params = new URLSearchParams({
    id: "24056",
    pocetMesicu: "12",
    jazyk: locale === "cs" ? "cz" : "en",
    // Legendu kreslíme sami pod kalendářem (AvailabilityCalendar), ve stylu webu.
    legenda: "ne",
    velikost: "1",
    fontFamily: "Montserrat",
    naStred: "ano",
    // Bez parametru "pozadi" je kalendář průhledný a převezme barvu karty kolem.
    kalendarText: "33281F",
    kalendarPozadi: "FFFDF9",
    ramecek: "DDD1BD",
    mesicText: "33281F",
    mesicPozadi: "E9DFCB",
    dnyText: "624D3A",
    dnyPozadi: "F1ECE4",
    obsazenoText: "FFFFFF",
    obsazenoPozadi: "68452B",
    volnoText: "33281F",
    volnoPozadi: "FFFDF9",
    castecneText: "33281F",
    castecnePozadi: "DFEEED",
    neaktivniDnyText: "82755F",
    neaktivniDnyPozadi: "F1ECE4",
    legendaText: "33281F",
  });

  if (stylesheetUrl) params.set("extCss", stylesheetUrl);

  return `${E_CHALUPY_CALENDAR_ORIGIN}/kalendar.php?${params.toString()}`;
}
