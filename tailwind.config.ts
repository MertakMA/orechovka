import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Barevná paleta podle brand boardu od klientky, stažená zhruba na půl
        // cesty zpátky k původnímu webu: pozadí světlejší (blíž původní bílé),
        // hnědá drží tlačítka, nadpisy a text, a tyrkysová (blízká původní
        // zelené značky) nese akcenty — štítky sekcí, linky, ikony, hover.
        // Odstíny jsou proti boardu o chlup ostřejší (světlá pozadí čistší, text
        // a hnědá tmavší), aby web nepůsobil jako přes béžový filtr.
        ink: "#33281f", // tmavě hnědý text, mezi původní #2c2c2c a #493528 z boardu
        clay: "#624d3a", // teplejší doplňkový text, popisky
        border: "#ddd1bd", // jemné linky v pískovém tónu
        cream: "#faf7f0", // Krémová — hlavní pozadí, o kus světlejší než board
        surface: "#fffdf9", // teplá "bílá" pro karty
        sand: "#e9dfcb", // Písková — oddělení sekcí, světlejší než #ded2bd z boardu
        parchment: "#ece1cc", // mezistupeň mezi krémovou a pískovou
        bark: "#452f20", // Tmavší hnědá — tmavé plochy, hover
        espresso: "#2a1c12", // nejtmavší hnědá pro kontrastní bloky
        tag: "#e8d3b3",
        live: "#d62e2e",
        stone: "#82755f",
        olive: "#6b7551", // Tlumená olivová — ikony, odkazy, drobné prvky
        pec: {
          DEFAULT: "#559895", // Tyrkys (pec) — ikony, linky, dekorace
          dark: "#34706c", // tmavší tyrkys pro text (štítky sekcí, hover), drží kontrast
          light: "#dfeeed", // jemný tyrkysový podklad pod ikonky
        },
        brand: {
          DEFAULT: "#68452b", // Ořechová hnědá — logo, nadpisy, hlavní barva
          light: "#886140", // světlejší ořech pro jemné varianty
          dark: "#452f20", // tmavší odstín pro hover tlačítek
        },
      },
      fontFamily: {
        // Nadpisy Playfair Display, podnadpisy Lora, text a menu Montserrat.
        serif: ["var(--font-heading)", "Georgia", "serif"],
        subhead: ["var(--font-subheading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #34706c 0%, #34706c 46%, #559895 83%, #559895 100%)",
        "sun-gradient": "linear-gradient(90deg, #8f5a14 0%, #8f5a14 46%, #c38a36 83%, #c38a36 100%)",
      },
      container: {
        center: true,
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
