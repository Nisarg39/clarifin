import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageCircle } from "lucide-react-native";
import { colors, fonts, shadows, radius } from "@/constants/theme";

export default function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgScreen }} edges={["top"]}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ marginBottom: 16, marginTop: 0 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
            AI Assistant
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
            Ask anything about financial instruments
          </Text>
        </View>

        <View style={{
          backgroundColor: colors.bgCard,
          borderRadius: radius.lg,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...shadows.card,
        }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted }}>
            AI chat coming soon.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
