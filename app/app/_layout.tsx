import "../global.css";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
  useFonts as usePlayfairFonts,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts as useSoraFonts,
} from "@expo-google-fonts/sora";
import {
  DMMono_400Regular,
  DMMono_500Medium,
  useFonts as useDMMonoFonts,
} from "@expo-google-fonts/dm-mono";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* Prevent errors on unsupporting platforms like Web */
});

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [playfairLoaded] = usePlayfairFonts({ 
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black 
  });
  const [interLoaded] = useInterFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [soraLoaded] = useSoraFonts({
    Sora_600SemiBold,
    Sora_700Bold,
  });
  const [monoLoaded] = useDMMonoFonts({ DMMono_400Regular, DMMono_500Medium });

  const fontsLoaded = playfairLoaded && interLoaded && soraLoaded && monoLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      // Dismiss the native splash screen immediately to reveal the custom splash screen underneath
      const dismissNativeSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // Ignore error if platform doesn't support native splash
        }
      };
      dismissNativeSplash();

      // Show the custom JS splash screen for 2 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); // 2 seconds splash screen duration
      
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return (
      <LinearGradient
        colors={["#EBF4FF", "#F0F7FF", "#E8F2FF"]}
        style={styles.splashContainer}
      >
        <StatusBar style="dark" backgroundColor="#EBF4FF" />
        <Text style={styles.splashText}>Clarifin</Text>
        <Text style={styles.splashSubText}>© 2026 Clarifin Inc. | Simplicity in Finance</Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#EBF4FF" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="instrument/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    fontFamily: "PlayfairDisplay_900Black",
    fontSize: 48,
    color: "#030334",
    letterSpacing: -1,
  },
  splashSubText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#7A8BAA",
    position: "absolute",
    bottom: 40,
  },
});
