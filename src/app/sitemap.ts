import type { MetadataRoute } from "next";
import { V } from "@/generated/variables";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/galerie", "/cenik", "/kontakt", "/vylety"];
  // Právní stránka — nízká priorita a řídká změna, ať se v sitemapě
  // netváří jako obsah srovnatelný s marketingovými podstránkami.
  const legalRoutes = ["/zpracovani-osobnich-udaju"];

  const mainEntries = routes.flatMap((route) => {
    const alternates = {
      languages: {
        cs: `${V.SITE_URL}${route}`,
        en: `${V.SITE_URL}/en${route}`,
      },
    };
    return [
      {
        url: `${V.SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.7,
        alternates,
      },
      {
        url: `${V.SITE_URL}/en${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.7,
        alternates,
      },
    ];
  });

  const legalEntries = legalRoutes.flatMap((route) => {
    const alternates = {
      languages: {
        cs: `${V.SITE_URL}${route}`,
        en: `${V.SITE_URL}/en${route}`,
      },
    };
    return [
      {
        url: `${V.SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates,
      },
      {
        url: `${V.SITE_URL}/en${route}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates,
      },
    ];
  });

  return [...mainEntries, ...legalEntries];
}
