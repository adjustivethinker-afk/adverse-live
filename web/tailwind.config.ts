import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "SF Pro Display", "Inter", "system-ui"],
        sans: ["var(--font-sans)", "Inter", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        midnight: "#09090F",
        ink: "#12131A",
        graphite: "#1B1C26",
        glass: "rgba(255,255,255,0.08)",
        glassStrong: "rgba(255,255,255,0.12)",
        glassSoft: "rgba(255,255,255,0.04)",
        cyan: { 400: "#00E5FF" },
        indigo: { 500: "#4F46E5" },
        violet: { 500: "#8B5CF6", 600: "#7C3AED" },
        success: "#00D26A",
        warning: "#FFC700",
        danger: "#FF4D6D",
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.06)",
        ring: "#7C3AED",
        background: "#09090F",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.08)",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF4D6D",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "rgba(255,255,255,0.6)",
        },
        accent: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#12131A",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.04)",
          foreground: "#FFFFFF",
        },
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(60% 60% at 20% 20%, rgba(0,229,255,0.25) 0%, rgba(0,229,255,0) 60%)," +
          "radial-gradient(50% 50% at 80% 30%, rgba(139,92,246,0.30) 0%, rgba(139,92,246,0) 60%)," +
          "radial-gradient(60% 60% at 50% 90%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 60%)",
        "neon-cta":
          "linear-gradient(135deg,#00E5FF 0%,#4F46E5 45%,#8B5CF6 100%)",
        "glass-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)",
        "grid-fade":
          "linear-gradient(to bottom, rgba(9,9,15,0) 0%, rgba(9,9,15,1) 80%)",
      },
      boxShadow: {
        glass:
          "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(0,0,0,0.6)",
        glow: "0 0 40px rgba(124,58,237,0.45), 0 0 80px rgba(0,229,255,0.20)",
        neon: "0 0 24px rgba(0,229,255,0.55), 0 0 64px rgba(139,92,246,0.45)",
        floating:
          "0 10px 30px -10px rgba(0,0,0,0.7), 0 30px 60px -30px rgba(124,58,237,0.4)",
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
        "3xl": "48px",
      },
      keyframes: {
        aurora: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%,-3%,0) scale(1.05)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) rotate(20deg)" },
          "100%": { transform: "translateX(220%) rotate(20deg)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(124,58,237,0.45)" },
          "50%": { boxShadow: "0 0 24px 8px rgba(124,58,237,0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ping2: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        sheen: "sheen 2.6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        ping2: "ping2 1.6s cubic-bezier(0,0,0.2,1) infinite",
        spinSlow: "spinSlow 18s linear infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        liquid: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
