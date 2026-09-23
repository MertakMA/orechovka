// Web běží jako statický export na GitHub Pages, ale servíruje se z vlastní
// domény roubenkaorechovka.cz (viz public/CNAME), ne z podadresáře
// mertakma.github.io/orechovka/ — basePath proto zůstává natrvalo prázdný.
const basePath = "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // next/image u neoptimalizovaných obrázků (images.unoptimized níže)
  // basePath do src automaticky nepřidává — proto ho zpřístupňujeme jako
  // NEXT_PUBLIC_ proměnnou a ručně prefixujeme přes src/lib/basePath.ts.
  // S prázdným basePath je to no-op, ale kód zůstává funkční i kdyby se web
  // v budoucnu znovu stěhoval pod podadresář.
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
