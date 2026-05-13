import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [playfairLoaded] = usePlayfairFonts({ PlayfairDisplay_900Black });
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
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
