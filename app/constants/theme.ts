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

  bgScreen: "#F4F8FE",
  bgCard: "#FFFFFF",
  bgInput: "#F4F8FE",
  bgNavy: "#030334",
  bgBlueGradient: ["#70AAE4", "#4A8ED4"] as const,

  borderLight: "rgba(112,170,228,0.15)",
  borderDefault: "#C5DCEF",
  borderFocus: "#70AAE4",

  textPrimary: "#030334",
  textSecondary: "#4A6A8A",
  textMuted: "#7A8BAA",
  textOnDark: "#FFFFFF",
  textOnYellow: "#030334",
  textSkyLabel: "#70AAE4",

  // compat aliases — old token names used in screens
  primary: "#030334",   // → navy
  bgApp: "#F4F8FE",     // → bgScreen (gradient not usable as RN backgroundColor)
  bgDark: "#030334",    // → bgNavy
} as const;

export const shadows = {
  level1: {
    shadowColor: "#030334",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  level2: {
    shadowColor: "#030334",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  level3: {
    shadowColor: "#030334",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 6,
  },
  yellowCard: {
    shadowColor: "#F5F27A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 5,
  },
  navyCard: {
    shadowColor: "#030334",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 24,
    elevation: 6,
  },
  blueCard: {
    shadowColor: "#70AAE4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 20,
    elevation: 5,
  },
  button: {
    shadowColor: "#030334",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

export const fonts = {
  display: "PlayfairDisplay_900Black",
  displayBold: "PlayfairDisplay_700Bold",
  displaySemi: "PlayfairDisplay_600SemiBold",
  interLight: "Inter_300Light",
  interRegular: "Inter_400Regular",
  interMedium: "Inter_500Medium",
  interSemi: "Inter_600SemiBold",
  interBold: "Inter_700Bold",
  monoRegular: "DMMono_400Regular",
  monoMedium: "DMMono_500Medium",
  // compat aliases
  soraBold: "Sora_700Bold",
  soraSemi: "Sora_600SemiBold",
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  "2xl": 32,
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
  colors: ["#EBF4FF", "#F0F7FF", "#E8F2FF"] as const,
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
};

export function formatReturn(value: number): string {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${Math.abs(value).toFixed(1)}%`;
}

export const RISK_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  low: { bg: "#BBF7D0", text: "#14532D", border: "#86EFAC", label: "Low" },
  low_to_moderate: { bg: "#A7F3D0", text: "#064E3B", border: "#6EE7B7", label: "Low–Moderate" },
  moderate: { bg: "#FEF08A", text: "#713F12", border: "#FDE047", label: "Moderate" },
  moderately_high: { bg: "#FED7AA", text: "#7C2D12", border: "#FDBA8C", label: "Mod. High" },
  high: { bg: "#FECACA", text: "#7F1D1D", border: "#FCA5A5", label: "High" },
  very_high: { bg: "#FECDD3", text: "#881337", border: "#FDA4AF", label: "Very High" },
};
