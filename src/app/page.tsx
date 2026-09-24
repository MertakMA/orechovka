import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  alternates: {
    canonical: V.SITE_URL,
    languages: { cs: V.SITE_URL, en: `${V.SITE_URL}/en` },
  },
};

// Statický export (GitHub Pages) nemá server, takže ISR (revalidate) tu
// nefunguje — novinky i texty z Notionu se načtou vždy jen při buildu.
// Aktuálnost proto zajišťuje pravidelný rebuild naplánovaný v GitHub Actions
// workflow (viz .github/workflows/deploy.yml), ne runtime revalidace.
export default function Home() {
  return <HomePage locale="cs" />;
}
