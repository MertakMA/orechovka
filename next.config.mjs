// Nasazení běží jako statický export na GitHub Pages, dokud web nemá
// vlastní doménu na kořeni. GITHUB_PAGES=true (nastaveno v Actions workflow)
// zapne basePath "/orechovka" — repozitář se tak servíruje na
// https://mertakma.github.io/orechovka/. Lokální `npm run dev`/`build` bez
// této proměnné běží normálně na kořeni.
// Až bude roubenkaorechovka.cz nasměrovaná na GitHub Pages (CNAME + DNS),
// stačí basePath nastavit natrvalo na "" a přidat soubor public/CNAME.
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPagesBuild ? "/orechovka" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // next/image u neoptimalizovaných obrázků (images.unoptimized níže)
  // basePath do src automaticky nepřidává — proto ho zpřístupňujeme jako
  // NEXT_PUBLIC_ proměnnou a ručně prefixujeme přes src/lib/basePath.ts.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // Statický export nemá server pro on-the-fly optimalizaci obrázků.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Nahrané obrázky novinek si stahuje scripts/sync-news.mjs do
      // public/images/novinky/, takže tyhle adresy se do HTML běžně vůbec
      // nedostanou. Zůstávají tu pro případ, že by klient v Notionu vložil
      // obrázek odkazem místo souboru.
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.notion-static.com",
      },
    ],
  },
};

export default nextConfig;
