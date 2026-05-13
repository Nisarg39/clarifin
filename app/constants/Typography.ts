import { TextStyle } from "react-native";

export const Typography = {
  // Font Families
  fonts: {
    display: "PlayfairDisplay_900Black",
    heading: "Inter_600SemiBold",
    body: "Inter_400Regular",
    bodyMedium: "Inter_500Medium",
    labelLight: "Inter_300Light",
    labelBold: "Inter_700Bold",
    mono: "DMMono_500Medium",
    monoRegular: "DMMono_400Regular",
  },

  // Type Scale
  presets: {
    display2xl: {
      fontSize: 72,
      fontFamily: "PlayfairDisplay_900Black",
      letterSpacing: -3,
      lineHeight: 80,
    } as TextStyle,
    displayXl: {
      fontSize: 56,
      fontFamily: "PlayfairDisplay_900Black",
      letterSpacing: -2.5,
      lineHeight: 64,
    } as TextStyle,
    displayLg: {
      fontSize: 44,
      fontFamily: "PlayfairDisplay_900Black",
      letterSpacing: -2,
      lineHeight: 52,
    } as TextStyle,
    displayMd: {
      fontSize: 32,
      fontFamily: "PlayfairDisplay_900Black",
      letterSpacing: -1,
      lineHeight: 40,
    } as TextStyle,
    titleXl: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.3,
      lineHeight: 28,
    } as TextStyle,
    titleLg: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      lineHeight: 24,
    } as TextStyle,
    titleMd: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      lineHeight: 20,
    } as TextStyle,
    bodyLg: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      lineHeight: 24,
    } as TextStyle,
    bodyMd: {
      fontSize: 14,
      fontFamily: "Inter_400Regular", // Can be 500 too as per spec
      lineHeight: 20,
    } as TextStyle,
    bodyMdMedium: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      lineHeight: 20,
    } as TextStyle,
    bodySm: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    } as TextStyle,
    labelKey: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      lineHeight: 16,
    } as TextStyle,
    labelLight: {
      fontSize: 11,
      fontFamily: "Inter_300Light",
      lineHeight: 16,
    } as TextStyle,
    labelCap: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      lineHeight: 16,
    } as TextStyle,
    button: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 0.2,
      lineHeight: 20,
    } as TextStyle,
    badge: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 0.3,
      lineHeight: 16,
    } as TextStyle,
    monoXl: {
      fontSize: 24,
      fontFamily: "DMMono_500Medium",
      letterSpacing: -0.5,
      lineHeight: 32,
    } as TextStyle,
    monoLg: {
      fontSize: 18,
      fontFamily: "DMMono_500Medium",
      lineHeight: 24,
    } as TextStyle,
    monoMd: {
      fontSize: 14,
      fontFamily: "DMMono_500Medium",
      lineHeight: 20,
    } as TextStyle,
    monoSm: {
      fontSize: 12,
      fontFamily: "DMMono_500Medium",
      lineHeight: 18,
    } as TextStyle,
  },
};
