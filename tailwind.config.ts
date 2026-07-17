import type { Config } from "tailwindcss";

// NOTA: O projeto está utilizando Tailwind v4, que configura o tema nativamente no arquivo CSS (src/app/globals.css).
// Este arquivo é mantido para compatibilidade de tipos e IDEs.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neonCyan: "#06b6d4",
        neonPink: "#db2777",
        neonPurple: "#9333ea",
      },
      boxShadow: {
        neonCyan: "0 0 15px rgba(6, 182, 212, 0.4)",
        neonPink: "0 0 15px rgba(219, 39, 119, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
