import type { MetadataRoute } from "next";
import { V } from "@/generated/variables";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/galerie", "/cenik", "/kontakt"];

  return routes.map((route) => ({
    url: `${V.SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
