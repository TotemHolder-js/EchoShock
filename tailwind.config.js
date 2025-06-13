/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.offwhite.DEFAULT"),
            a: {
              color: theme("colors.flame.start"),
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: theme("colors.flame.end"),
              },
            },
            h1: { color: theme("colors.offwhite.DEFAULT") },
            h2: { color: theme("colors.offwhite.DEFAULT") },
            h3: { color: theme("colors.offwhite.DEFAULT") },
            h4: { color: theme("colors.offwhite.DEFAULT") },
            h5: { color: theme("colors.offwhite.DEFAULT") },
            h6: { color: theme("colors.offwhite.DEFAULT") },
            strong: { color: theme("colors.offwhite.DEFAULT") },
            code: {
              color: theme("colors.ember.DEFAULT"),
              backgroundColor: theme("colors.steel.medium"),
              padding: "0.2em 0.4em",
              borderRadius: "0.25em",
            },
            blockquote: {
              color: theme("colors.offwhite.muted"),
              borderLeftColor: theme("colors.ember.DEFAULT"),
              fontStyle: "italic",
            },
            "ul > li::marker": {
              color: theme("colors.ember.DEFAULT"),
            },
            "ol > li::marker": {
              color: theme("colors.ember.DEFAULT"),
            },
            hr: { borderColor: theme("colors.steel.medium") },
            pre: {
              color: theme("colors.offwhite.DEFAULT"),
              backgroundColor: theme("colors.steel.medium"),
              borderRadius: "0.5em",
            },
            table: {
              color: theme("colors.offwhite.DEFAULT"),
            },
            thead: {
              color: theme("colors.offwhite.DEFAULT"),
              borderBottomColor: theme("colors.steel.light"),
            },
            tbody: {
              color: theme("colors.offwhite.DEFAULT"),
            },
          },
        },
      }),
      colors: {
        steel: {
          dark: "#2B2B2B",
          medium: "#4D4D4D",
          light: "#5A5A5A",
        },
        flame: {
          start: "#FF4500",
          end: "#FF0000",
        },
        ember: {
          DEFAULT: "#FFA500",
        },
        offwhite: {
          DEFAULT: "#F5F5F5",
          muted: "#E6E6E6",
        },
        danger: {
          DEFAULT: "#C62828",
        },
        success: {
          DEFAULT: "#B0B0B0",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(90deg, var(--flame-start), var(--flame-end))",
        "surface-bevel":
          "linear-gradient(145deg, var(--steel-light), var(--steel-medium))",
      },
      boxShadow: {
        "accent-glow":
          "0 0 8px 0px hsl(var(--primary) / 0.7), 0 0 12px 0px hsl(var(--secondary) / 0.6)",
        "inner-bevel":
          "inset 0 1px 2px rgba(0,0,0,0.5), inset 0 -1px 1px hsl(var(--steel-light) / 0.5)",
        "success-glow": "0 0 12px 2px hsl(var(--success) / 0.3)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    extend: {
      animation: ["focus-visible"],
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
