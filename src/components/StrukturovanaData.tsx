import { V } from "@/generated/variables";
import { texty, type Locale } from "@/lib/texty";

// schema.org pro Google: WebSite dává výsledku hledání název webu místo holé domény,
// LodgingBusiness mu nabízí fotky pro náhled a kontakty/polohu ubytování.
export default function StrukturovanaData({ locale }: { locale: Locale }) {
  const s = texty("spolecne", locale);
  const name = s.vzdy("NAZEV_WEBU");
  const abs = (path: string) => `${V.SITE_URL}${path}`;
  const sameAs = [V.FACEBOOK_URL, V.INSTAGRAM_URL].filter((url) => url.startsWith("http"));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${V.SITE_URL}/#website`,
        url: V.SITE_URL,
        name,
        alternateName: new URL(V.SITE_URL).hostname,
        inLanguage: locale,
      },
      {
        "@type": "LodgingBusiness",
        "@id": `${V.SITE_URL}/#roubenka`,
        name,
        description: s.vzdy("seo.popis"),
        url: locale === "cs" ? V.SITE_URL : abs("/en"),
        image: [abs("/images/og-image.jpg"), abs("/images/hero-2.jpg"), abs("/images/carousel-1.jpg")],
        telephone: V.KONTAKT_TELEFON,
        email: V.KONTAKT_EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: V.ADRESA_RADEK_1,
          addressLocality: V.ADRESA_RADEK_1.replace(/\s*\d.*$/, ""),
          postalCode: V.ADRESA_RADEK_2.match(/\d{3}\s?\d{2}/)?.[0],
          addressCountry: "CZ",
        },
        geo: { "@type": "GeoCoordinates", latitude: Number(V.GPS_LAT), longitude: Number(V.GPS_LON) },
        ...(sameAs.length > 0 && { sameAs }),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
