export const colors = {
  navy: "#030334",
  skyBlue: "#70AAE4",
  accent: "#F5F27A",
  positiveStrong: "#16A34A",
  positive: "#22C55E",
  neutral: "#8AAAB8",
  negative: "#EF4444",
  negativeStrong: "#DC2626",
  warning: "#F59E0B",

  bgScreen: "#01010A", // Dark Mode Native
  bgCard: "#12121A", // Dark Mode Surface
  bgInput: "#01010A",
  bgNavy: "#12121A",
  bgBlueGradient: ["#12121A", "#01010A"] as const,

  borderLight: "rgba(255,255,255,0.05)",
  borderDefault: "rgba(255,255,255,0.1)",
  borderFocus: "#70AAE4",

  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#94A3B8",
  textOnDark: "#FFFFFF",
  textOnYellow: "#030334",
  textSkyLabel: "#70AAE4",

  // compat aliases
  primary: "#70AAE4", // Changed to skyBlue for better dark mode visibility
  bgApp: "#01010A",
  bgDark: "#12121A",
} as const;

export const shadows = {
  elevationDark: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  level1: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 3,
  },
  level2: {
    shadowColor: "#70AAE4", // Aurora Glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 5,
  },
  level3: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 6,
  },
  yellowCard: {
    shadowColor: "#F5F27A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 30,
    elevation: 5,
  },
  navyCard: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 30,
    elevation: 6,
  },
  blueCard: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 5,
  },
  button: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 25,
    elevation: 5,
  },
} as const;

export const fonts = {
  display: "Inter_700Bold",
  displayBold: "Inter_700Bold",
  displaySemi: "Inter_600SemiBold",
  interLight: "Inter_300Light",
  interRegular: "Inter_400Regular",
  interMedium: "Inter_500Medium",
  interSemi: "Inter_600SemiBold",
  interBold: "Inter_700Bold",
  monoRegular: "DMMono_400Regular",
  monoMedium: "DMMono_500Medium",
  // compat aliases - shifted to Inter
  soraBold: "Inter_700Bold",
  soraSemi: "Inter_600SemiBold",
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  "2xl": 32, // Soft Geometry
  full: 9999,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export function getReturnColor(value: number): string {
  if (value > 15) return colors.positiveStrong;
  if (value > 1) return colors.positive;
  if (value >= -1) return colors.neutral;
  if (value > -15) return colors.negative;
  return colors.negativeStrong;
}

export const appBackground = {
  colors: ["#01010A", "#01010A", "#01010A"] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export function formatReturn(value: number): string {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${Math.abs(value).toFixed(1)}%`;
}

export const RISK_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  low: { bg: "rgba(187, 247, 208, 0.15)", text: "#86EFAC", border: "rgba(134, 239, 172, 0.3)", label: "Low" },
  low_to_moderate: { bg: "rgba(167, 243, 208, 0.15)", text: "#6EE7B7", border: "rgba(110, 231, 183, 0.3)", label: "Low–Moderate" },
  moderate: { bg: "rgba(254, 240, 138, 0.15)", text: "#FDE047", border: "rgba(253, 224, 71, 0.3)", label: "Moderate" },
  moderately_high: { bg: "rgba(254, 215, 170, 0.15)", text: "#FDBA8C", border: "rgba(253, 186, 140, 0.3)", label: "Mod. High" },
  high: { bg: "rgba(254, 202, 202, 0.15)", text: "#FCA5A5", border: "rgba(252, 165, 165, 0.3)", label: "High" },
  very_high: { bg: "rgba(254, 205, 211, 0.15)", text: "#FDA4AF", border: "rgba(253, 164, 175, 0.3)", label: "Very High" },
};
