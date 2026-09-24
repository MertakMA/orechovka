import { texty, promenne, type Locale } from "@/lib/texty";
import type { PriceCardProps } from "@/components/pricing/PriceCard";

// Jediná sada cenových karet — stejná na úvodní stránce i na /cenik.
// Názvy sezón a odrážky jsou v Notionu (Texty → Společné), ceny a termíny ve Variables.
export function buildPlans(locale: Locale): PriceCardProps[] {
  const s = texty("spolecne", locale);
  const v = promenne(locale);
  const features = s.seznam("ceny.vlastnosti").map((f) => f.t);
  const labels = {
    badge: s.t("ceny.odznak"),
    perNightLabel: s.t("ceny.za-noc"),
    buttonLabel: s.t("ceny.tlacitko"),
  };

  const plans = [
    { id: "ceny.vedlejsi", price: v.CENA_VEDLEJSI_SEZONA, dateRange: v.TERMIN_VEDLEJSI_SEZONA, features },
    {
      id: "ceny.hlavni",
      price: v.CENA_HLAVNI_SEZONA,
      dateRange: v.TERMIN_HLAVNI_SEZONA,
      features: [...features, ...s.seznam("ceny.hlavni.navic").map((f) => f.t)],
      featured: true,
    },
    { id: "ceny.mimo", price: v.CENA_MIMO_SEZONU, dateRange: v.TERMIN_MIMO_SEZONU, features },
  ];

  return plans.flatMap(({ id, ...plan }) => {
    const season = s.t(id);
    return season ? [{ ...plan, ...labels, season }] : [];
  });
}
