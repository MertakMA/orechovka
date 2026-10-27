import { texty, type Locale } from "@/lib/texty";
import type { PriceCardProps } from "@/components/pricing/PriceCard";
import { reservationHref, RESERVATION_LABEL } from "@/lib/rezervace";

// Jediná sada cenových karet — stejná na úvodní stránce i na /cenik (úvod ukazuje zkrácenou verzi).
// Názvy, sezóny, období, typy pobytů a „Cena zahrnuje“ jsou v Notionu (Texty → Společné).
export function buildPlans(locale: Locale): PriceCardProps[] {
  const s = texty("spolecne", locale);
  const features = s.seznam("ceny.vlastnosti").map((f) => f.t);
  const shoulderSeasonDates =
    locale === "cs"
      ? ["Duben – červen", "Září – listopad"]
      : ["April – June", "September – November"];
  const labels = {
    badge: s.t("ceny.odznak"),
    includedHeading: s.t("ceny.zahrnuje"),
    buttonLabel: RESERVATION_LABEL[locale],
    buttonHref: reservationHref(locale),
  };

  const plans = [
    { id: "ceny.vedlejsi" },
    { id: "ceny.hlavni", featured: true },
    { id: "ceny.vanoce" },
  ];

  return plans.flatMap(({ id, ...plan }) => {
    const season = s.t(id);
    if (!season) return [];
    return [
      {
        ...plan,
        ...labels,
        season,
        periods: s.seznam(`${id}.obdobi`).map((o, i) => ({
          name: o.t,
          dates: o.p || (id === "ceny.vedlejsi" ? shoulderSeasonDates[i] ?? "" : ""),
        })),
        // Text 2: 1. řádek = cena, další řádky = dny / termín / poznámka
        stays: s.seznam(`${id}.pobyty`).map((p) => {
          const [price = "", ...details] = (p.p ?? "").split("\n").filter(Boolean);
          return { name: p.t, price, details };
        }),
        features: [...features, ...s.seznam(`${id}.navic`).map((f) => f.t)],
      },
    ];
  });
}
