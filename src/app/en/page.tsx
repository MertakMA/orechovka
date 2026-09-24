import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { texty } from "@/lib/texty";
import { V } from "@/generated/variables";

const s = texty("spolecne", "en");

export const metadata: Metadata = {
  title: { absolute: s.vzdy("seo.titulek") },
  description: s.vzdy("seo.popis"),
  alternates: {
    canonical: `${V.SITE_URL}/en`,
    languages: { cs: V.SITE_URL, en: `${V.SITE_URL}/en` },
  },
  openGraph: { locale: "en_US" },
};

export default function HomeEn() {
  return <HomePage locale="en" />;
}
