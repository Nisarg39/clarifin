/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // V2 Cyber-Fintech Brand Colors
        "navy-base": "#01010A",
        "navy-surface": "#030334",
        "sky-blue": "#70AAE4",
        "accent-yellow": "#F5F27A",

        // Legacy support mapping
        navy: "#030334",
        "sky-blue-legacy": "#70AAE4",
        accent: "#F5F27A",
        "positive-strong": "#16A34A",
        positive: "#22C55E",
        neutral: "#8AAAB8",
        negative: "#EF4444",
        "negative-strong": "#DC2626",
        warning: "#F59E0B",

        // Backgrounds
        "bg-page": "#01010A",
        "bg-screen": "#01010A",
        "bg-card": "#030334",
        "bg-input": "#01010A",
        "bg-navy": "#030334",

        // Borders
        "border-light": "rgba(255,255,255,0.05)",
        "border-default": "rgba(255,255,255,0.1)",
        "border-focus": "#70AAE4",

        // Text
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        "text-muted": "#94A3B8",
        "text-on-dark": "#FFFFFF",
        "text-on-yellow": "#030334",
        "text-sky-label": "#70AAE4",

        // Returns
        "return-strong-pos": "#16A34A",
        "return-pos": "#22C55E",
        "return-neutral": "#8AAAB8",
        "return-neg": "#EF4444",
        "return-strong-neg": "#DC2626",

        // Risk badges
        "risk-low-bg": "#DCFCE7",
        "risk-low-text": "#166534",
        "risk-low-mod-bg": "#D1FAE5",
        "risk-low-mod-text": "#065F46",
        "risk-mod-bg": "#FEF9C3",
        "risk-mod-text": "#854D0E",
        "risk-mod-high-bg": "#FFEDD5",
        "risk-mod-high-text": "#9A3412",
        "risk-high-bg": "#FEE2E2",
        "risk-high-text": "#991B1B",
        "risk-very-high-bg": "#FFE4E6",
        "risk-very-high-text": "#9F1239",
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "26px",
        "2xl": "32px",
      },
      boxShadow: {
        "glow-primary": "0px 0px 40px rgba(112, 170, 228, 0.3)",
        "glow-accent": "0px 0px 40px rgba(245, 242, 122, 0.2)",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      fontSize: {
        // V2 Typography
        "display-hero": ["84px", { lineHeight: "96px" }],
        "title-lg": ["32px", { lineHeight: "40px" }],
        "body-base": ["16px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],

        // Legacy Typography
        "display-2xl": ["72px", { lineHeight: "80px", letterSpacing: "-3px" }],
        "display-xl": ["56px", { lineHeight: "64px", letterSpacing: "-2.5px" }],
        "display-lg": ["44px", { lineHeight: "52px", letterSpacing: "-2px" }],
        "display-md": ["32px", { lineHeight: "40px", letterSpacing: "-1px" }],
        "title-xl": ["22px", { lineHeight: "28px", letterSpacing: "-0.3px" }],
        "title-md": ["15px", { lineHeight: "20px" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "label-key": ["11px", { lineHeight: "16px" }],
        "label-light": ["11px", { lineHeight: "16px" }],
        "label-cap": ["11px", { lineHeight: "16px", letterSpacing: "1.5px" }],
        button: ["14px", { lineHeight: "20px", letterSpacing: "0.2px" }],
        badge: ["11px", { lineHeight: "16px", letterSpacing: "0.3px" }],
        "mono-xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
        "mono-lg": ["18px", { lineHeight: "24px" }],
        "mono-md": ["14px", { lineHeight: "20px" }],
        "mono-sm": ["12px", { lineHeight: "18px" }],
      },
      fontFamily: {
        display: ["Inter_700Bold"],
        "inter-light": ["Inter_300Light"],
        "inter-regular": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semi": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        "mono-regular": ["DMMono_400Regular"],
        "mono-medium": ["DMMono_500Medium"],
      },
    },
  },
  plugins: [],
};
