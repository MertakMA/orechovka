import type { MetadataRoute } from "next";

// TODO: nahradit reálnou doménou, až bude web nasazený (musí odpovídat layout.tsx SITE_URL).
const SITE_URL = "https://roubenkaorechovka.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/galerie", "/cenik", "/kontakt"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
