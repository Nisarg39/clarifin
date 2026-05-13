import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Layers, BarChart2, MessageCircle } from "lucide-react-native";
import { colors, fonts, radius, shadows } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "index", label: "Home", Icon: Home },
  { name: "explore", label: "Explore", Icon: Layers },
  { name: "compare", label: "Compare", Icon: BarChart2 },
  { name: "chat", label: "Chat", Icon: MessageCircle },
] as const;

function ClarifInTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.bgCard,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingBottom: insets.bottom,
        paddingHorizontal: 16,
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        minHeight: 72 + insets.bottom,
      }}
    >
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        const { Icon, label } = tab;

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              ...(isFocused
                ? {
                    backgroundColor: colors.bgDark,
                    borderRadius: radius.full,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    flexDirection: "row",
                    gap: 6,
                    ...shadows.darkButton,
                  }
                : {
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }),
            }}
          >
            <Icon
              size={20}
              strokeWidth={1.5}
              color={isFocused ? colors.textOnDark : colors.textMuted}
            />
            {isFocused && (
              <Text
                style={{
                  fontFamily: fonts.interSemi,
                  fontSize: 13,
                  color: colors.textOnDark,
                }}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <ClarifInTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="compare" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}
