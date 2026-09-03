import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // sladěno s Figma "05 Design System" (Text/Charcoal, Border/Natural, Background/Beige)
        ink: "#2c2c2c",
        clay: "#735d47",
        border: "#d6cec4",
        cream: "#f5efe6",
        surface: "#fafaf8",
        sand: "#f2eae0",
        parchment: "#ede6dd",
        bark: "#4a3728",
        espresso: "#1f150c",
        tag: "#eed1b8",
        live: "#d62e2e",
        stone: "#908980",
        brand: {
          DEFAULT: "#5f8c7a",
          light: "#82a396",
        },
      },
      fontFamily: {
        serif: ["var(--font-heading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #5f8c7a 0%, #5f8c7a 46%, #82a396 83%, #82a396 100%)",
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
