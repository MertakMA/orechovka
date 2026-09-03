import type { MetadataRoute } from "next";

// TODO: nahradit reálnou doménou, až bude web nasazený (musí odpovídat layout.tsx SITE_URL).
const SITE_URL = "https://roubenkaorechovka.cz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
