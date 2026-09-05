import type { MetadataRoute } from "next";
import { V } from "@/generated/variables";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${V.SITE_URL}/sitemap.xml`,
  };
}
