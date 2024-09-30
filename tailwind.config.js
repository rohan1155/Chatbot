/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        white: {
          css: {
            color: theme("colors.white"),
            h1: { color: theme("colors.white") },
            h2: { color: theme("colors.white") },
            h3: { color: theme("colors.white") },
            p: { color: theme("colors.white") },
            a: { color: theme("colors.blue.300") }, // Link color can be different
            strong: { color: theme("colors.white") },
            blockquote: {
              color: theme("colors.white"),
              borderLeftColor: theme("colors.gray.600"),
            },
            code: { color: theme("colors.white") },
            "ol > li::before": { color: theme("colors.white") },
            "ul > li::before": { backgroundColor: theme("colors.white") },
          },
        },
      }),
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/typography")],
};
