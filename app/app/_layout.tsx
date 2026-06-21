import "../global.css";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
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

import { DarkTheme, ThemeProvider } from "@react-navigation/native";

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
      const dismissNativeSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {}
      };
      dismissNativeSplash();

      const timer = setTimeout(() => {
        setShowSplash(false);
        SystemUI.setBackgroundColorAsync("#01010A"); // Force root iOS window to dark
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: showSplash ? "#EBF4FF" : "#01010A" }}>
      <StatusBar 
        style={showSplash ? "dark" : "light"} 
        backgroundColor={showSplash ? "#EBF4FF" : "#01010A"} 
      />
      {showSplash ? (
        <LinearGradient
          colors={["#EBF4FF", "#F0F7FF", "#E8F2FF"]}
          style={styles.splashContainer}
        >
          <Text style={styles.splashText}>Clarifin</Text>
          <Text style={styles.splashSubText}>© 2026 Clarifin Inc. | Simplicity in Finance</Text>
        </LinearGradient>
      ) : (
        <ThemeProvider value={DarkTheme}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#01010A' } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="instrument/[id]" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      )}
    </View>
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
